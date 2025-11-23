import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as yup from 'yup'

import { Intent } from '../../Alert'
import Alert from '../../Alert/Alert'
import Button from '../../Button'
import Input from '../../Input'
import Overlay from '../Overlay'

import { t, TRANSLATION } from '../../../localization'
import { IRootState } from '../../../state'
import { modalsActionCreators, modalsSelectors } from '../../../state/modals'
import { defaultWACodeModal } from '../../../state/modals/reducer'
import { userSelectors } from '../../../state/user'
import { useVisibility } from '../../../tools/hooks'
import { EStatuses } from '../../../types/types'
import { styles } from '../STYLES'

interface IFormValues {
  code: number | null
}

const mapStateToProps = (state: IRootState) => ({
  payload: modalsSelectors.isWACodeModalOpen(state),
  user: userSelectors.user(state),
  status: userSelectors.status(state),
})

const mapDispatchToProps = {
  setWACodeModal: modalsActionCreators.setWACodeModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

const schema = yup.object({
  code: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? null : value
    )
    .nullable()
    .required(t(TRANSLATION.CODE_ERROR)),
});

const WACodeModal: React.FC<PropsFromRedux> = ({
  payload,
  setWACodeModal,
  status,
}) => {
  const [isVisible, toggleVisibility] = useVisibility(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    mode: 'all',

    resolver: yupResolver(schema) as any,
    defaultValues: { code: null },
  })

  useEffect(() => {
    if (status === EStatuses.Fail && !isVisible) {
      toggleVisibility()
    } else if (status === EStatuses.Success) {
      reset({ code: null })
      if (isVisible) toggleVisibility()
      setWACodeModal({ ...defaultWACodeModal })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const onSubmit: SubmitHandler<IFormValues> = (formData) => {
    if (!payload) return

    const data = { ...payload.data, password: formData.code }
    try {
      if (payload && typeof payload.login === 'function') {
        payload.login(data)
      } else {
        setWACodeModal({ ...defaultWACodeModal })
      }
    } catch (err) {
      console.error('login call failed', err)
    }
  }

  return (
    <Overlay
      isOpen={!!payload?.isOpen}
      onClick={() => setWACodeModal({ ...defaultWACodeModal })}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={[styles.modal, styles.whatsappModal]}>
          <ScrollView contentContainerStyle={styles.codeBlock}>
            <Text style={styles.infoText}>{t(TRANSLATION.CODE_INFO)}</Text>

            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  inputProps={{
                    value: value !== null && value !== undefined ? String(value) : '',
                    onChangeText: (text: string) => {
                      const digits = text.replace(/[^\d]/g, '')
                      const num = digits === '' ? null : Number(digits)
                      onChange(num)
                    },
                    onBlur,
                    keyboardType: 'numeric',
                    placeholder: t(TRANSLATION.CODE_WRITE),
                  }}
                  label={t(TRANSLATION.CODE_WRITE)}
                  error={errors.code?.message ? t(TRANSLATION.CODE_ERROR) : undefined}
                />
              )}
            />

            {isVisible && (
              <View style={styles.alertContainer}>
                <Alert
                  intent={Intent.ERROR}
                  message={t(TRANSLATION.LOGIN_FAIL)}
                  onClose={toggleVisibility}
                />
              </View>
            )}

            <View style={styles.buttonsWrapper}>
              <Button
                text={t(TRANSLATION.SIGN_IN)}
                onPress={handleSubmit(onSubmit)}
                disabled={!!Object.keys(errors).length}
                style={styles.whatsappModalBtn}
                buttonStyle={styles.whatsappModalBtnButton}
              />
              <Button
                text={t(TRANSLATION.CANCEL)}
                onPress={() => setWACodeModal({ ...defaultWACodeModal })}
                style={[styles.whatsappModalBtn, styles.whatsappModalBtnCancel]}
                buttonStyle={styles.whatsappModalBtnCancelButton}
                textStyle={styles.whatsappModalBtnCancelButtonText}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Overlay>
  )
}

export default connector(WACodeModal)