// ProfileModal.native.tsx
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  Alert as RNAlert,
  // SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import { getImageFile } from '../../API'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { carsActionCreators, carsSelectors } from '../../state/cars'
import { configActionCreators, configSelectors } from '../../state/config'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { userActionCreators, userSelectors } from '../../state/user'
import { formatPhoneNumber, normalizePhoneNumber } from '../../tools/phoneUtils'

import { defaultProfileModal } from '../../state/modals/reducer'

import {
  EStatuses,
  EUserCheckStates,
  EUserRoles,
  ICar,
  IUser,
} from '../../types/types'
import { styles } from './STYLES'

// ---------- constants same as web ----------
type RNFile = { uri: string; name: string; type: string }
const CLIENT_FIELDS = new Set([
  'u_role','u_name','u_family','u_middle','u_phone','u_email','u_photo','u_lang','u_currency','ref_code','u_details',
] as any)
const DRIVER_CHECK_REQUIRED_FIELDS = new Set([
  'u_role','u_name','u_family','u_middle','u_phone','u_email','u_photo','u_city','u_lang_skills','u_description','u_birthday','ref_code','u_details',
] as any)
const DRIVER_CHECK_ACTIVE_FIELDS = new Set([
  'u_role','u_lang','u_currency','u_gps_software','u_active','out_drive','out_address','out_latitude','out_longitude','out_est_datetime','out_s_address','out_s_latitude','out_s_longitude','out_passengers','out_luggage','ref_code','u_details',
] as any)
const CAR_FIELDS = new Set(['cm_id','seats','registration_plate','color','photo','details','cc_id'] as any)

// ---------- redux ----------
const mapStateToProps = (state: IRootState) => ({
  tokens: userSelectors.tokens(state),
  user: userSelectors.user(state),
  car: carsSelectors.userPrimaryCar(state),
  language: configSelectors.language(state),
  isOpen: modalsSelectors.isProfileModalOpen(state),
})
const mapDispatchToProps = {
  setProfileModal: modalsActionCreators.setProfileModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  updateUser: userActionCreators.initUser,
  getUserCars: carsActionCreators.getUserCars,
  editCar: carsActionCreators.edit,
  setLanguage: configActionCreators.setLanguage,
}
const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>


function JSONFormRN({
  defaultValues = {},
  fields,
  onSubmit,
  onChange,
  state = { pending: false },
  errors = {},
}: {
  defaultValues: any
  fields: any[]
  onSubmit: (vals: any) => void
  onChange?: (name: string, value: any) => void
  state?: { pending?: boolean }
  errors?: Record<string, any>
}) {
  const [values, setValues] = useState<any>({})

  useEffect(() => {
    setValues(defaultValues || {})
  }, [defaultValues])

  const change = (name: string, v: any) => {
    setValues((s: any) => {
      const nv = { ...s, [name]: v }
      onChange?.(name, v)
      return nv
    })
  }

  // file picker
  const pickImage = async (name: string, multiple = false) => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!perm.granted) {
        RNAlert.alert(t(TRANSLATION.PERMISSION_DENIED) || 'Permission denied')
        return
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsMultipleSelection: false,
        base64: false,
      })
      const cancelled = (res as any).canceled ?? (res as any).cancelled ?? false
      if (cancelled) return
      const maybeAsset = Array.isArray((res as any).assets) ? (res as any).assets[0] : res
      const uri = maybeAsset.uri
      const nameFile = maybeAsset.fileName || uri.split('/').pop() || `photo_${Date.now()}.jpg`
      const type = maybeAsset.type || (uri.endsWith('.png') ? 'image/png' : 'image/jpeg')
      const file: RNFile = { uri, name: nameFile, type }
      if (multiple) {
        const arr = (values[name] || []).slice()
        arr.push(file)
        change(name, arr)
      } else {
        change(name, file)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  if (!fields || !Array.isArray(fields)) return null

  return (
    <View>
      {fields.map((field: any, idx: number) => {
        const name = field.name || `field_${idx}`
        const value = values[name] ?? ''
        const error = errors?.[name]
        switch (field.type) {
          case 'text':
          case 'email':
          case 'phone':
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                {field.label && <Text style={{ marginBottom: 6 }}>{field.label}</Text>}
                <TextInput
                  value={String(value || '')}
                  placeholder={field.placeholder || ''}
                  keyboardType={field.type === 'phone' ? 'phone-pad' : (field.type === 'email' ? 'email-address' : 'default')}
                  onChangeText={(text) => change(name, text)}
                  style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8 }}
                />
                {error && <Text style={{ color: 'red' }}>{String(error)}</Text>}
              </View>
            )
          case 'textarea':
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                {field.label && <Text style={{ marginBottom: 6 }}>{field.label}</Text>}
                <TextInput
                  value={String(value || '')}
                  multiline
                  numberOfLines={4}
                  onChangeText={(text) => change(name, text)}
                  placeholder={field.placeholder || ''}
                  style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, minHeight: 90 }}
                />
                {error && <Text style={{ color: 'red' }}>{String(error)}</Text>}
              </View>
            )
          case 'select':
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                {field.label && <Text style={{ marginBottom: 6 }}>{field.label}</Text>}
                <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
                  <Picker selectedValue={value} onValueChange={(v) => change(name, v)}>
                    <Picker.Item label={field.placeholder || t(TRANSLATION.SELECT) || 'Select'} value={undefined} />
                    {(field.options || []).map((o: any) => <Picker.Item key={String(o.value)} label={o.label} value={o.value} />)}
                  </Picker>
                </View>
              </View>
            )
          case 'file':
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                {field.label && <Text style={{ marginBottom: 6 }}>{field.label}</Text>}
                <TouchableOpacity onPress={() => pickImage(name, !!field.multiple)} style={[styles.profileModalButton, { padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }]}>
                  <Text>{t(TRANSLATION.PICK_IMAGE) || 'Pick image'}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
                  {Array.isArray(value) ? value.map((f: RNFile, i: number) => (
                    <Image key={i} source={{ uri: f.uri }} style={{ width: 64, height: 64, marginRight: 8, borderRadius: 6 }} />
                  )) : (value ? <Image source={{ uri: (value as RNFile).uri }} style={{ width: 64, height: 64, marginRight: 8, borderRadius: 6 }} /> : null)}
                </View>
              </View>
            )
          case 'checkbox':
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                <TouchableOpacity onPress={() => change(name, !value)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#333', marginRight: 8, backgroundColor: value ? '#333' : 'transparent' }} />
                  <Text>{field.label}</Text>
                </TouchableOpacity>
              </View>
            )
          case 'date':
            // For brevity use TextInput; in production use DatePicker
            return (
              <View key={name} style={{ marginBottom: 12 }}>
                {field.label && <Text style={{ marginBottom: 6 }}>{field.label}</Text>}
                <TextInput value={String(value || '')} placeholder={field.placeholder || 'YYYY-MM-DD'} onChangeText={(v) => change(name, v)} style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8 }} />
              </View>
            )
          case 'submit':
            return (
              <View key={name} style={{ marginTop: 10, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => onSubmit(values)} style={[styles.profileModalButton, { padding: 12, backgroundColor: '#EC4C60', borderRadius: 8 }]}>
                  {state.pending ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', textAlign: 'center' }}>{field.label || t(TRANSLATION.SAVE) || 'Save'}</Text>}
                </TouchableOpacity>
              </View>
            )
          default:
            return (
              <View key={name}><Text>Unsupported field: {field.type}</Text></View>
            )
        }
      })}
    </View>
  )
}

// ---------- main ProfileModal ----------
function ProfileModal(props: PropsFromRedux) {
  const {
    tokens, user, car, language, isOpen,
    setProfileModal, setMessageModal, updateUser, getUserCars, editCar, setLanguage,
  } = props

  useEffect(() => {
    getUserCars()
  }, [])

  // avatar picking & upload
  const onChangeAvatar = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        RNAlert.alert(t(TRANSLATION.PERMISSION_DENIED) || 'Permission denied')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        base64: true,
        quality: 0.7,
      })
      const canceled = (result as any).canceled ?? (result as any).cancelled ?? false
      if (canceled) return
      // new API: assets
      const asset = Array.isArray((result as any).assets) ? (result as any).assets[0] : result
      const base64 = (asset as any).base64
      if (!base64) {
        RNAlert.alert('Cannot get base64 from image')
        return
      }
      const dataUrl = `data:image/jpeg;base64,${base64}`
      await API.editUser({ u_photo: dataUrl })
      updateUser()
    } catch (err) {
      console.warn(err)
      RNAlert.alert('Error', String(err))
    }
  }, [updateUser])

  // preload passport & driver license images (getImageFile used in web)
  const [passportPhoto, setPassportPhoto] = useState<any[] | null>(null)
  const [driverLicensePhoto, setDriverLicensePhoto] = useState<any[] | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const passportImgs = (user?.u_details?.passport_photo) || []
    const driverImgs = (user?.u_details?.driver_license_photo) || []
    // getImageFile may return either [id, file] or { uri, ... }, handle both
    Promise.all((passportImgs || []).map((idOrObj: any) => getImageFile(idOrObj))).then((res) => {
      // normalize to [id, RNFile] or to RNFile
      const mapped = res.map((r: any) => {
        if (Array.isArray(r)) {
          // [id, file-like]
          const [id, fileLike] = r
          if (fileLike && fileLike.uri) return [id, fileLike]
          // fallback to object
          return [id, { uri: String(fileLike), name: `${id}.jpg`, type: 'image/jpeg' }]
        } else if (r && r.uri) {
          return r
        } else {
          return r
        }
      })
      setPassportPhoto(mapped)
    }).catch(() => setPassportPhoto([]))

    Promise.all((driverImgs || []).map((idOrObj: any) => getImageFile(idOrObj))).then((res) => {
      const mapped = res.map((r: any) => {
        if (Array.isArray(r)) {
          const [id, fileLike] = r
          if (fileLike && fileLike.uri) return [id, fileLike]
          return [id, { uri: String(fileLike), name: `${id}.jpg`, type: 'image/jpeg' }]
        } else if (r && r.uri) {
          return r
        } else {
          return r
        }
      })
      setDriverLicensePhoto(mapped)
    }).catch(() => setDriverLicensePhoto([]))
  }, [isOpen, user])

  type TFormValues = Omit<IUser, 'u_details'> & {
    u_details: any
    u_car: ICar | null
  }

  const isValuesLoaded = !!(user && car !== undefined && passportPhoto !== null && driverLicensePhoto !== null)

  const defaultValues = useMemo(() => isValuesLoaded ? {
    ...user,
    u_phone: user.u_phone ? formatPhoneNumber(user.u_phone) : '',
    u_details: {
      ...user.u_details,
      passport_photo: passportPhoto,
      driver_license_photo: driverLicensePhoto,
    },
    u_car: car,
  } : {}, [isValuesLoaded, user, car, passportPhoto, driverLicensePhoto])

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [errorsState, setErrorsState] = useState<Record<string, any>>({})

  const handleChange = useCallback((name: string, value: any) => {
    setErrorsState(prev => ({ ...prev, [name]: false }))
  }, [])

  async function handleSubmitForm(formValues: TFormValues) {
    // destructure as in web
    const {
      u_details: { passport_photo, driver_license_photo, ...u_details },
      u_car,
      ...values
    } = formValues as any

    if ('u_phone' in values && values.u_phone) {
      values.u_phone = normalizePhoneNumber(values.u_phone, false, user!.u_role === EUserRoles.Driver)
    }

    if (values.ref_code && values.ref_code !== user!.ref_code) {
      const res = await API.checkRefCode(values.ref_code)
      if (!res) {
        setErrorsState({ ref_code: true })
        return
      }
    }

    setIsSubmittingForm(true)

    try {
      // Client path
      if (user!.u_role === EUserRoles.Client) {
        await API.editUser(Object.fromEntries(Object.entries(values)
          .filter(([key]) => CLIENT_FIELDS.has(key as any))) as any)
        updateUser()
        setMessageModal({ isOpen: true, status: EStatuses.Success, message: t(TRANSLATION.SUCCESS_PROFILE_UPDATE_MESSAGE) })
        setIsSubmittingForm(false)
        return
      }

      // Edit car if present
      if (car) {
        const res = await editCar(car.c_id, Object.fromEntries(Object.entries(u_car!).filter(([key]) => CAR_FIELDS.has(key as any))) as any)
        const isError = res?.message === 'busy registration plate'
        if (isError) {
          setErrorsState(prev => ({ ...prev, 'u_car.registration_plate': true }))
          setIsSubmittingForm(false)
          return
        }
      }

      // images: passport_photo and driver_license_photo
      const imagesKeys = ['passport_photo', 'driver_license_photo']
      const imagesLists = [passport_photo ?? [], driver_license_photo ?? []]
      const imagesMap: Record<string, any[]> = {}

      await Promise.all(imagesLists.map(async (imageList: any[], i) => {
        const key = imagesKeys[i]
        imagesMap[key] = imagesMap[key] || []
        // imageList elements can be either [id, fileLike] (existing) or RNFile (new)
        // For new files we call API.uploadFile (same as web)
        await Promise.all(imageList.map(async (image: any) => {
          // existing: if image is array [id, fileLike] or is object containing an id
          if (Array.isArray(image) && image[0]) {
            imagesMap[key].push(image[0])
            return
          }
          if (image && (image as any).id) {
            imagesMap[key].push((image as any).id)
            return
          }
          // otherwise treat as new file-like (RNFile: { uri, name, type })
          if (image && (image as any).uri) {
            // call API.uploadFile - assume it accepts { file: { uri, name, type }, u_id, token, u_hash }
            const upRes = await API.uploadFile({ file: image, u_id: user!.u_id, token: tokens?.token, u_hash: tokens?.u_hash })
            if (upRes?.dl_id) imagesMap[key].push(upRes.dl_id)
          }
        }))
      }))

      // determine allowed fields based on user check state
      const fields = user!.u_check_state === EUserCheckStates.Required || !user!.u_check_state
        ? DRIVER_CHECK_REQUIRED_FIELDS
        : user!.u_check_state === EUserCheckStates.Active
          ? DRIVER_CHECK_ACTIVE_FIELDS
          : new Set()

      try {
        await API.editUser({
          ...Object.fromEntries(Object.entries(values).filter(([key]) => fields.has(key as any))) as any,
          u_details: { ...u_details, ...imagesMap },
        })
        updateUser()
        setMessageModal({ isOpen: true, status: EStatuses.Success, message: t(TRANSLATION.SUCCESS_PROFILE_UPDATE_MESSAGE) })
      } catch (err) {
        console.warn(err)
        setMessageModal({ isOpen: true, status: EStatuses.Fail, message: 'An error occured' })
      }
    } catch (err) {
      console.warn(err)
      setMessageModal({ isOpen: true, status: EStatuses.Fail, message: 'An error occured' })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const formState = useMemo(() => ({ pending: isSubmittingForm }), [isSubmittingForm])

  // parse fields config from global data (like web)
  const fieldsRaw = useMemo(() => {
    try {
      const formStr = (global as any).data?.site_constants?.form_profile?.value
      return (JSON.parse(formStr).fields) ?? null
    } catch {
      return null
    }
  }, [])

  const isClient = user?.u_role === EUserRoles.Client
  const fieldsFiltered = useMemo(() => {
    if (!fieldsRaw) return null
    if (!isClient) return fieldsRaw
    return fieldsRaw.filter((field: any) => (field.name && CLIENT_FIELDS.has(field.name)) || field.type === 'submit')
  }, [fieldsRaw, isClient])

  if (!fieldsFiltered) {
    return (
      <Modal visible={!!isOpen} animationType="fade" transparent>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.profileModal, { backgroundColor: '#fff', padding: 20 }]}>
            <Text>Bad json in data.js</Text>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

  return (
    <Modal visible={!!isOpen} animationType="slide" transparent>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.profileModal, { backgroundColor: '#fff', padding: 12 }]}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.profileModalAvatar}>
              <TouchableOpacity onPress={onChangeAvatar}>
                <View style={styles.profileModalAvatarImage}>
                  {isValuesLoaded ? (
                    <Image source={{ uri: user?.u_photo || '' }} style={styles.profileModalAvatarImageBg as any} />
                  ) : (
                    <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {isValuesLoaded && (
              <JSONFormRN
                defaultValues={defaultValues}
                fields={fieldsFiltered}
                onSubmit={handleSubmitForm}
                onChange={handleChange}
                state={formState}
                errors={errorsState}
              />
            )}
            <View style={{ height: 8 }} />
            <TouchableOpacity onPress={() => setProfileModal({ ...defaultProfileModal })} style={{ marginTop: 8 }}>
              <Text style={{ color: '#666', textAlign: 'center' }}>{t(TRANSLATION.CLOSE) || 'Close'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default connector(ProfileModal)
