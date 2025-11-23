import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { months, years } from '../../constants/cardDetails'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import Button from '../Button'
import Input, { EInputTypes } from '../Input'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isCardDetailsModalOpen(state),
})

const mapDispatchToProps = {
  setCardDetailsModal: modalsActionCreators.setCardDetailsModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IFormValues {
  cardNumber: string
  name: string
  month: string
  year: string
  cvv: string
}

interface IProps extends ConnectedProps<typeof connector> {}

const CardDetailsModal: React.FC<IProps> = ({ isOpen, setCardDetailsModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormValues>({
    mode: 'onChange',
    criteriaMode: 'all',
  })

  const onSubmit = (data: IFormValues) => {
    if (isValid) {
      console.log('Fields are valid', data)
    } else {
      console.error('Fields are not valid')
    }
    setCardDetailsModal(false)
  }

  return (
      <Overlay isOpen={isOpen} onClick={() => setCardDetailsModal(false)}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.cardDetailsModalDetails}>
            <Text style={{ fontSize: 20, marginBottom: 15 }}>{t(TRANSLATION.ATTACH_CARD)}</Text>

            {/* Card Number */}
            <Controller
              control={control}
              name="cardNumber"
              rules={{
                required: t(TRANSLATION.REQUIRED_FIELD),
                pattern: { value: /^\d{16}$/, message: t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR) },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  inputProps={{
                    value,
                    onChangeText: onChange,
                    placeholder: 'ХХХХ-ХХХХ-ХХХХ-ХХХХ',
                  }}
                  label={t(TRANSLATION.CARD_NUMBER)}
                  buttons={[{ image: images.photoCamera }]}
                  error={errors.cardNumber?.message}
                />
              )}
            />

            {/* Name */}
            <Controller
              control={control}
              name="name"
              rules={{ required: t(TRANSLATION.REQUIRED_FIELD) }}
              render={({ field: { onChange, value } }) => (
                <Input
                  inputProps={{
                    value,
                    onChangeText: onChange,
                    placeholder: t(TRANSLATION.NAME_AND_SURNAME_PLACEHOLDER),
                  }}
                  label={`${t(TRANSLATION.NAME_AND_SURNAME)}:`}
                  error={errors.name?.message}
                />
              )}
            />

            {/* Expiration Date */}
            <View style={styles.cardDetailsModalDetailsExpirationDate}>
              <View style={styles.cardDetailsModalDetailsExpirationDateExp}>
                <Text style={styles.cardDetailsModalDetailsExpirationDateSpan}>{t(TRANSLATION.EXPIRES)}</Text>

                <Controller
                  control={control}
                  name="month"
                  rules={{ required: t(TRANSLATION.REQUIRED_FIELD) }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      inputProps={{ value, onChangeText: onChange }}
                      inputType={EInputTypes.Select}
                      options={months.map(m => ({ label: t(m.name), value: m.id.toString() }))}
                      style={styles.cardDetailsModalDetailsExpirationDateSelect}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="year"
                  rules={{ required: t(TRANSLATION.REQUIRED_FIELD) }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      inputProps={{ value, onChangeText: onChange }}
                      inputType={EInputTypes.Select}
                      options={years.map(y => ({ label: y.name, value: y.id.toString() }))}
                      style={styles.cardDetailsModalDetailsExpirationDateSelect}
                    />
                  )}
                />
              </View>

              {/* CVC */}
              <View style={styles.cardDetailsModalDetailsExpirationDateCvc}>
                <Text style={styles.cardDetailsModalDetailsExpirationDateSpan}>{t(TRANSLATION.CVC_CODE)}:</Text>
                <Controller
                  control={control}
                  name="cvv"
                  rules={{
                    required: t(TRANSLATION.REQUIRED_FIELD),
                    pattern: { value: /^\d{3}$/, message: t(TRANSLATION.CVC_PATTERN_ERROR) },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      inputProps={{
                        value,
                        onChangeText: onChange,
                        placeholder: 'ХХХ',
                      }}
                      buttons={[{ image: images.helpIcon }]}
                      error={errors.cvv?.message}
                      style={styles.cardDetailsModalDetailsExpirationDateSelect}
                    />
                  )}
                />
              </View>
            </View>

            {/* Save Button */}
            <Button
              text={t(TRANSLATION.SAVE)}
              onPress={handleSubmit(onSubmit)}
              style={[styles.cardDetailsModalDetailsSaveBtn, styles.cardDetailsModalDetailsSaveBtnButton]}
            />
          </View>
        </ScrollView>
      </Overlay>

  )
}

export default connector(CardDetailsModal)
