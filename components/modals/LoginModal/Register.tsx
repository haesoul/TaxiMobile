// RegisterForm.native.tsx
import { yupResolver } from '@hookform/resolvers/yup'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  Image,
  Alert as RNAlert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as yup from 'yup'
import { t, TRANSLATION } from '../../../localization'
import { IRootState } from '../../../state'
import { userActionCreators, userSelectors } from '../../../state/user'
import {
  ERegistrationType,
  LOGIN_TABS_IDS,
} from '../../../state/user/constants'
import { normalizePhoneNumber } from '../../../tools/phoneUtils'
import { getPhoneError } from '../../../tools/utils'
import { EStatuses, EUserRoles, EWorkTypes, IRequiredFields, TFilesMap } from '../../../types/types'
import styles from './STYLES'

import { useRoute } from '@react-navigation/native'

/** Redux mapping (оставил как было) */
const mapStateToProps = (state: IRootState) => {
  return {
    user: userSelectors.user(state),
    status: userSelectors.status(state),
    tab: userSelectors.tab(state),
    message: userSelectors.message(state),
    response: userSelectors.registerResponse(state),
  }
}

const mapDispatchToProps = {
  register: userActionCreators.register,
  setStatus: userActionCreators.setStatus,
  setMessage: userActionCreators.setMessage,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IFormValues {
  u_name: string;
  u_phone: string;
  u_email: string;
  ref_code: string;
  type: ERegistrationType;
  u_role: EUserRoles;
  city?: string;
  street?: string;
  state?: string;
  card?: string;
  passport_photo?: any;
  driver_license_photo?: any;
  license_photo?: any;
  car_model?: string;
  car_color?: string;
  car_classes?: string;
  seats?: string;
  car_number?: string;
}

/** Простая реализация visibility hook (веб-версия могла отличаться) */
const useVisibility = (initial = false) => {
  const [visible, setVisible] = useState(initial)
  const toggle = () => setVisible(v => !v)
  return [visible, toggle] as const
}

/** Вспомогательные валидаторы */
const getYupImageSchema = (isRequired: boolean = false) => {
  const schema = yup
    .mixed()
    .test('type', t(TRANSLATION.REQUIRED_FILE_IMAGE_TYPE), (value: any) => {
      if (value && value[0] && (value[0].uri || value[0].uri === '')) {
        // on RN we store { uri, name, type }
        const type = value[0].type || ''
        return (
          type === 'image/jpeg' ||
          type === 'image/png' ||
          type === 'image/jpg'
        )
      } else {
        return true
      }
    })
  return isRequired ? (schema.required(t(TRANSLATION.REQUIRED_FILE)) as yup.MixedSchema) : (schema as yup.MixedSchema)
}

const getYupSchema = (schema: any, isRequired: boolean = false) =>
  isRequired ? schema.required(t(TRANSLATION.REQUIRED_FIELD)) : schema

const RNFieldLabel: React.FC<{ label?: string, required?: boolean }> = ({ label, required }) => {
  if (!label) return null
  return (
    <Text style={{ marginBottom: 6, fontSize: 16, color: '#1D2A50' }}>
      {label}{required ? ' *' : ''}
    </Text>
  )
}

const RNTextInput: React.FC<any> = ({ value, onChange, placeholder, error, keyboardType = 'default', secureTextEntry = false, style, ...rest }) => {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          paddingHorizontal: 12,
          height: 44,
          backgroundColor: '#fff',
        }}
        {...rest}
      />
      {error && <Text style={{ color: 'red', marginTop: 6 }}>{String(error)}</Text>}
    </View>
  )
}

const RNSelect: React.FC<any> = ({ value, onChange, options = [], placeholder }) => {
  return (
    <View style={{ marginBottom: 14, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
      <Picker
        selectedValue={value}
        onValueChange={(v) => onChange(v)}
        mode="dropdown"
      >
        {placeholder && <Picker.Item label={placeholder} value={undefined} />}
        {options.map((o: any) => <Picker.Item key={String(o.value)} label={o.label} value={o.value} />)}
      </Picker>
    </View>
  )
}

const RNFilePicker: React.FC<{ onChange: (files: any[]) => void, multiple?: boolean, value?: any[] }> = ({ onChange, multiple = true, value = [] }) => {
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        RNAlert.alert(t(TRANSLATION.PERMISSION_DENIED) || 'Permission denied')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsMultipleSelection не гарантирован на всех платформах/версиях,
        // поэтому ставим false и эмулируем добавление в массив.
        allowsMultipleSelection: false,
        quality: 0.7,
      })

      // robust cancelled detection (old/new prop names)
      const cancelled = (result as any).canceled ?? (result as any).cancelled ?? false
      if (!cancelled) {
        // new API: result.assets = [{ uri, type, ... }]
        const maybeAssets = (result as any).assets
        const asset = Array.isArray(maybeAssets) && maybeAssets.length ? maybeAssets[0] : (result as any)

        const uri: string = asset.uri || ''
        const name = asset.fileName || asset.uri?.split('/').pop() || `photo_${Date.now()}.jpg`
        const inferredType =
          asset.type ||
          (uri.endsWith('.png') ? 'image/png' : (uri.endsWith('.jpg') || uri.endsWith('.jpeg') ? 'image/jpeg' : 'image/jpeg'))

        const file = {
          uri,
          name,
          type: inferredType,
        }

        const newVal = multiple ? [...(value || []), file] : [file]
        onChange(newVal)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={pickImage} style={[styles.workTypeButton]}>
        <Text>{t(TRANSLATION.PICK_IMAGE) || 'Pick Image'}</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' }}>
        {(value || []).map((f: any, idx: number) => (
          <Image key={idx} source={{ uri: f.uri }} style={{ width: 64, height: 64, marginRight: 8, borderRadius: 6 }} />
        ))}
      </View>
    </View>
  )
}

const RNCheckbox: React.FC<any> = ({ value, onValueChange, label, disabled, wrapperStyle }) => {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, wrapperStyle]}>
      <Switch value={!!value} onValueChange={onValueChange} disabled={disabled} />
      {label && <Text style={{ marginLeft: 8 }}>{label}</Text>}
    </View>
  )
}

const RNButton: React.FC<any> = ({ onPress, text, disabled, style, loading }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.loginBtn, { opacity: disabled ? 0.6 : 1 }, style]}>
      <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 50 }}>{text}</Text>
    </TouchableOpacity>
  )
}

const RNAlertBox: React.FC<{ intent?: 'error' | 'success' | 'info', message?: string, onClose?: () => void }> = ({ intent = 'info', message, onClose }) => {
  if (!message) return null
  const bg = intent === 'error' ? '#fdecea' : intent === 'success' ? '#eef7ee' : '#eef2ff'
  return (
    <View style={[styles.alertContainer, { backgroundColor: bg, padding: 10, borderRadius: 8, marginBottom: 10 }]}>
      <Text>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={{ marginTop: 8 }}>
          <Text style={{ color: '#333' }}>{t(TRANSLATION.CLOSE) || 'Close'}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

/** Главный компонент */
const RegisterForm: React.FC<ConnectedProps<typeof connector> & { isOpen?: boolean }> = ({
  status,
  message,
  tab,
  register,
  isOpen,
}) => {
  // site constants: window.data в вебе — в RN берем global.data или пусто
  const appData = (global as any).data || {}

  const requireFeildsMap: IRequiredFields = useMemo(() => {
    const requireFieldsStr = (appData?.site_constants?.reg_driver?.value) || ''
    return requireFieldsStr
      .split(';')
      .reduce((res: any, item: any) => {
        if (!item) return res
        const [ key, value ] = item.split(',')
        return {
          ...res,
          [key]: !!Number(value),
        }
      }, {})
  }, [appData])

  // route fallback
  let route: any = {}
  try {
    route = useRoute() || {}
  } catch (e) {
    route = {}
  }
  const pathname = route?.name || route?.path || ''

  const [showRefCode, setShowRefCode] = useState(false)
  const [workType, setWorkType] = useState<EWorkTypes | null>(null)
  const [isRegistrationAlertVisible, toggleRegistrationAlertVisibility] = useVisibility(false)
  const [isWhatsappAlertVisible, toggleWhatsappAlertVisibility] = useVisibility(false)
  const [filesMap, setFilesMap] = useState<TFilesMap>({
    passport_photo: [],
    driver_license_photo: [],
    license_photo: [],
  })

  const [data, setData] = useState<{
    car_models: any
    car_colors: any
    car_classes: any
  } | null>(null)

  const isDefaultDriver = String(pathname).includes('/driver-order')


  const schema: yup.AnyObjectSchema = yup.object().shape({
    type: getYupSchema(yup.string(), isDefaultDriver),
    u_name: yup.string().required(t(TRANSLATION.REQUIRED_FIELD)).trim(),
    u_email: yup
      .string()
      .email(t(TRANSLATION.EMAIL_ERROR))
      .when('type', (typeVal: any, schema: yup.StringSchema) => {
        return typeVal === ERegistrationType.Email ? schema.required(t(TRANSLATION.REQUIRED_FIELD)).trim() : schema.trim()
      }),
    u_phone: yup.string().when('type', (typeVal: any, schema: yup.StringSchema) => {
      return typeVal === ERegistrationType.Phone ? schema.required(t(TRANSLATION.REQUIRED_FIELD)).trim() : schema
    }),
    street: getYupSchema(yup.string().trim(), isDefaultDriver && requireFeildsMap.street),
    city: getYupSchema(yup.string().trim(), isDefaultDriver && requireFeildsMap.city),
    state: getYupSchema(yup.string().trim(), isDefaultDriver && requireFeildsMap.state),
    card: getYupSchema(yup.string().min(16).max(16).trim(), isDefaultDriver && requireFeildsMap.card),
    passport_photo: isDefaultDriver ? getYupImageSchema(requireFeildsMap.passport_photo) : yup.string(),
    driver_license_photo: isDefaultDriver ? getYupImageSchema(requireFeildsMap.driver_license_photo) : yup.string(),
    license_photo: isDefaultDriver ? getYupImageSchema(requireFeildsMap.license_photo) : yup.string(),
  })
  

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    register: formRegisterWeb, // keep if project expects it
  } = useForm<IFormValues>({
    criteriaMode: 'all',
    mode: 'all',
    defaultValues: {
      type: ERegistrationType.Email,
      u_role: pathname.includes('/driver-order') ? EUserRoles.Driver : EUserRoles.Client,
      seats: '4',
    },
    resolver: yupResolver(schema),
  })

  const { type, u_phone, u_role } = useWatch<IFormValues>({ control })

  let whatsappResponseMessage = ''

  useEffect(() => {
    if (isOpen && isRegistrationAlertVisible) {
      toggleRegistrationAlertVisibility()
    }
  }, [isOpen])

  useEffect(() => {
    if (status === EStatuses.Fail && !isRegistrationAlertVisible) {
      toggleRegistrationAlertVisibility()
    }
  }, [status])

  useEffect(() => {
    let newData = appData
    if (newData && (data === null || data === undefined)) {
      setData({
        car_models: newData.car_models,
        car_colors: newData.car_colors,
        car_classes: newData.car_classes,
      })
    }
  }, [appData])

  useEffect(() => {
    if (type !== ERegistrationType.Email) {
      setValue('u_email', '')
    }
    if (type !== ERegistrationType.Phone) {
      setValue('u_phone', '')
    }
  }, [type])

  if (tab !== LOGIN_TABS_IDS[1]) return null

  const onSubmit = (formData: IFormValues) => {
    if (getPhoneError(u_phone, type === ERegistrationType.Phone)) return

    if (isRegistrationAlertVisible) {
      toggleRegistrationAlertVisibility()
    }

    const upload: any[] = []
    if (filesMap.passport_photo) {
      Array.from(filesMap.passport_photo).forEach((file: any) => {
        upload.push({ name: 'passport_photo', file })
      })
    }
    if (filesMap.driver_license_photo) {
      Array.from(filesMap.driver_license_photo).forEach((file: any) => {
        upload.push({ name: 'driver_license_photo', file })
      })
    }
    if (filesMap.license_photo) {
      Array.from(filesMap.license_photo).forEach((file: any) => {
        upload.push({ name: 'license_photo', file })
      })
    }

    const normalizedPhone = normalizePhoneNumber(formData.u_phone || '', true, Number(u_role) === EUserRoles.Driver)

    register({
      u_name: formData.u_name || '',
      u_phone: normalizedPhone,
      u_email: formData.u_email || '',
      u_role: formData.u_role || EUserRoles.Client,
      u_city: formData.city || '',
      ref_code: formData.ref_code || undefined,
      u_details: {
        street: formData.street || '',
        state: formData.state || '',
        card: formData.card || '',
      },
      u_car: {
        cm_id: formData.car_model || '',
        seats: +(formData?.seats || 0),
        registration_plate: formData.car_number || '',
        color: formData.car_color || '',
        photo: '',
        details: {},
        cc_id: formData.car_classes || '',
      },
      uploads: upload,
    })
  }

  const prepareOptions = (dataObj: any, key: string) => {
    const options: any[] = []
    if (!dataObj) return options
    Object.keys(dataObj).forEach((datum, index) => {
      if (key === TRANSLATION.CAR_CLASSES && index === 0) return
      options.push({
        value: datum,
        label: t(key[datum as any]),
      })
    })
    return options
  }

  const seatsOptions = () => {
    return Array(20).fill(0).map((_, i) => {
      const value = String(i + 1)
      return { value, label: value }
    })
  }

  const isDriver = Number(u_role) === EUserRoles.Driver
  let isValidForm = isValid
  if (isDriver && requireFeildsMap.passport_photo && !filesMap.passport_photo.length) isValidForm = false
  if (isDriver && requireFeildsMap.driver_license_photo && !filesMap.driver_license_photo.length) isValidForm = false
  if (isDriver && requireFeildsMap.license_photo && !filesMap.license_photo.length) isValidForm = false

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }} style={styles.loginForm}>
      {/* Work type (driver) */}
      {isDriver && (
        <Controller
          control={control}
          name="car_model" // we use this controller to display workType select behavior (original used simple select)
          render={({ field }) => (
            <View style={{ marginBottom: 12 }}>
              <RNFieldLabel label={t(TRANSLATION.WORK_TYPE) || 'Work type'} />
              <RNSelect
                value={String(workType ?? '')}
                onChange={(v: any) => {
                  setWorkType(Number(v))
                }}
                options={[
                  { label: t(TRANSLATION.SELF_EMPLOYED), value: EWorkTypes.Self },
                  { label: t(TRANSLATION.COMPANY), value: EWorkTypes.Company },
                ]}
                placeholder={t(TRANSLATION.SELECT) || 'Select'}
              />
            </View>
          )}
        />
      )}

      {/* Name */}
      <Controller
        control={control}
        name="u_name"
        render={({ field: { onChange, value } }) => (
          <>
            <RNFieldLabel label={workType === EWorkTypes.Company ? t(TRANSLATION.COMPANY_NAME) : t(TRANSLATION.NAME)} required />
            <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.NAME)} error={errors.u_name?.message} />
          </>
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="u_phone"
        render={({ field: { onChange, value } }) => (
          <>
            <RNFieldLabel label={t(TRANSLATION.PHONE)} required />
            <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.PHONE)} keyboardType="phone-pad"
              error={getPhoneError(value, type === ERegistrationType.Phone)} />
          </>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="u_email"
        render={({ field: { onChange, value } }) => (
          <>
            <RNFieldLabel label={t(TRANSLATION.EMAIL)} />
            <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.EMAIL)} keyboardType="email-address" error={errors.u_email?.message} />
          </>
        )}
      />

      {/* Type radio: show as switches - phone radio is disabled like original */}
      <View style={{ marginVertical: 8 }}>
        <RNCheckbox
          value={type === ERegistrationType.Phone}
          onValueChange={() => {}}
          label={t(TRANSLATION.PHONE)}
          disabled
        />
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <RNCheckbox
              value={value === ERegistrationType.Email}
              onValueChange={(v: boolean) => onChange(v ? ERegistrationType.Email : ERegistrationType.Phone)}
              label={t(TRANSLATION.EMAIL)}
            />
          )}
        />
      </View>

      {/* Driver-only fields */}
      {isDriver && (
        <>
          <Controller
            control={control}
            name="street"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={t(TRANSLATION.STREET_ADDRESS)} required={!!requireFeildsMap.street} />
                <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.STREET_ADDRESS)} error={errors.street?.message} style={styles.street} />
              </>
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={t(TRANSLATION.CITY)} required={!!requireFeildsMap.city} />
                <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.CITY)} error={errors.city?.message} />
              </>
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={t(TRANSLATION.STATE)} required={!!requireFeildsMap.state} />
                <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.STATE)} error={errors.state?.message} />
              </>
            )}
          />

          <Controller
            control={control}
            name="card"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={t(TRANSLATION.CARD_NUMBER)} required={!!requireFeildsMap.card} />
                <RNTextInput value={value} onChange={onChange} placeholder={'ХХХХ-ХХХХ-ХХХХ-ХХХХ'} keyboardType="numeric" error={errors.card?.message} />
              </>
            )}
          />

          {/* Passport photo */}
          <View style={{ marginTop: 8 }}>
            <RNFieldLabel label={t(TRANSLATION.PASSPORT_PHOTO)} required={!!requireFeildsMap.passport_photo} />
            <RNFilePicker
              value={filesMap.passport_photo}
              onChange={(files: any[]) => setFilesMap(m => ({ ...m, passport_photo: files }))}
            />
            {errors.passport_photo && <Text style={{ color: 'red' }}>{String(errors.passport_photo?.message)}</Text>}
          </View>

          {/* Driver license photo */}
          <View style={{ marginTop: 8 }}>
            <RNFieldLabel label={t(TRANSLATION.DRIVER_LICENSE_PHOTO)} required={!!requireFeildsMap.driver_license_photo} />
            <RNFilePicker
              value={filesMap.driver_license_photo}
              onChange={(files: any[]) => setFilesMap(m => ({ ...m, driver_license_photo: files }))}
            />
            {errors.driver_license_photo && <Text style={{ color: 'red' }}>{String(errors.driver_license_photo?.message)}</Text>}
          </View>

          {/* License photo */}
          <View style={{ marginTop: 8 }}>
            <RNFieldLabel label={t(TRANSLATION.LICENSE_PHOTO)} required={!!requireFeildsMap.license_photo} />
            <RNFilePicker
              value={filesMap.license_photo}
              onChange={(files: any[]) => setFilesMap(m => ({ ...m, license_photo: files }))}
            />
            {errors.license_photo && <Text style={{ color: 'red' }}>{String(errors.license_photo?.message)}</Text>}
          </View>
        </>
      )}

      {/* Promo/ref code toggle */}
      <Controller
        control={control}
        name="ref_code"
        render={({ field: { onChange, value } }) => (
          <>
            <RNCheckbox
              value={showRefCode}
              onValueChange={(v: boolean) => setShowRefCode(v)}
              label={t(TRANSLATION.PROMO_CODE)}
              wrapperStyle={styles.refCodeToggler}
            />
            {showRefCode && (
              <>
                <RNTextInput value={value} onChange={onChange} placeholder={t(TRANSLATION.PROMO_CODE)} style={styles.refCodeInputActive} />
              </>
            )}
          </>
        )}
      />

      {/* Car related */}
      {isDriver && (
        <>
          <Controller
            control={control}
            name="car_model"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={'Car models'} />
                <RNSelect value={value} onChange={onChange} options={prepareOptions(data?.car_models, TRANSLATION.CAR_MODELS)} placeholder={t(TRANSLATION.SELECT)} />
              </>
            )}
          />

          <Controller
            control={control}
            name="seats"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={t(TRANSLATION.SEATS)} />
                <RNSelect value={value} onChange={onChange} options={seatsOptions()} />
              </>
            )}
          />

          <Controller
            control={control}
            name="car_number"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={'Car number'} />
                <RNTextInput value={value} onChange={onChange} placeholder={'Car number'} />
              </>
            )}
          />

          <Controller
            control={control}
            name="car_color"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={'Car color'} />
                <RNSelect value={value} onChange={onChange} options={prepareOptions(data?.car_colors, TRANSLATION.CAR_COLORS)} />
              </>
            )}
          />

          <Controller
            control={control}
            name="car_classes"
            render={({ field: { onChange, value } }) => (
              <>
                <RNFieldLabel label={'Car classes'} />
                <RNSelect value={value} onChange={onChange} options={prepareOptions(data?.car_classes, TRANSLATION.CAR_CLASSES)} />
              </>
            )}
          />
        </>
      )}

      {/* Alerts */}
      {isRegistrationAlertVisible && (
        <RNAlertBox
          intent={status === EStatuses.Fail ? 'error' : 'success'}
          message={status === EStatuses.Fail ? (message || t(TRANSLATION.REGISTER_FAIL)) : t(TRANSLATION.REGISTER_SUCCESS)}
          onClose={toggleRegistrationAlertVisibility}
        />
      )}

      {isWhatsappAlertVisible && (
        <RNAlertBox intent="info" message={whatsappResponseMessage} onClose={toggleWhatsappAlertVisibility} />
      )}

      {/* Submit */}
      <RNButton
        onPress={handleSubmit(onSubmit)}
        text={t(TRANSLATION.SIGNUP)}
        disabled={!isValidForm}
        loading={status === EStatuses.Loading}
      />
    </ScrollView>
  )
}

export default connector(RegisterForm)
