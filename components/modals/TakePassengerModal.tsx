import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { EMapModalTypes } from '../../state/modals/constants'
import { userActionCreators } from '../../state/user'
import { getPointError } from '../../tools/utils'
import { EStatuses, ISuggestion } from '../../types/types'
import Button from '../Button'
import Input, { EInputTypes } from '../Input'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isTakePassengerModalOpen(state),
  from: modalsSelectors.takePassengerModalFrom(state),
  to: modalsSelectors.takePassengerModalTo(state),
})

const mapDispatchToProps = {
  setMapModal: modalsActionCreators.setMapModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  setTakePassengerModal: modalsActionCreators.setTakePassengerModal,
  updateTakePassengerModal: modalsActionCreators.updateTakePassengerModal,
  setTakePassengerModalFrom: modalsActionCreators.setTakePassengerModalFrom,
  setTakePassengerModalTo: modalsActionCreators.setTakePassengerModalTo,
  setUser: userActionCreators.setUser,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const debouncedGetFromPointSuggestion = _.debounce((callback, ...args) => {
  API.getPointSuggestions(...args).then(callback)
}, 500)

const debouncedGetToPointSuggestion = _.debounce((callback, ...args) => {
  API.getPointSuggestions(...args).then(callback)
}, 500)

const TakePassengerModal: React.FC<IProps> = ({
  isOpen,
  from,
  to,
  setMapModal,
  setMessageModal,
  setTakePassengerModal,
  updateTakePassengerModal,
  setTakePassengerModalFrom,
  setTakePassengerModalTo,
  setUser,
}) => {
  const [seats, setSeats] = useState(1)
  const [isFromAddressShort, setIsFromAddressShort] = useState(true)
  const [isToAddressShort, setIsToAddressShort] = useState(true)
  const [fromSuggestions, setFromSuggestions] = useState<ISuggestion[]>([])
  const [toSuggestions, setToSuggestions] = useState<ISuggestion[]>([])

  const onSubmit = () => {
    API.setOutDrive(
      false,
      {
        fromAddress: from?.address,
        fromLatitude: from?.latitude?.toString(),
        fromLongitude: from?.longitude?.toString(),
        toAddress: to?.address,
        toLatitude: to?.latitude?.toString(),
        toLongitude: to?.longitude?.toString(),
      },
      seats,
    )
      .then(() => setTakePassengerModal({ isOpen: false }))
      .then(API.getAuthorizedUser)
      .then(setUser)
      .catch(error => {
        console.error(error)
        setMessageModal({
          isOpen: true,
          message: t(TRANSLATION.ERROR),
          status: EStatuses.Fail,
        })
      })
  }

  // геолокация
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        updateTakePassengerModal({
          from: { latitude: coords.latitude, longitude: coords.longitude },
        }),
      error => console.error(error),
      { enableHighAccuracy: true },
    )
  }, [])

  useEffect(() => {
    debouncedGetFromPointSuggestion(setFromSuggestions, from?.address, true)
  }, [from])

  useEffect(() => {
    debouncedGetToPointSuggestion(setToSuggestions, to?.address, true)
  }, [to])

  const fromButtons = [
    {
      icon: isFromAddressShort ? images.minusIcon : images.plusIcon,
      onPress: () => setIsFromAddressShort(prev => !prev),
    },
    {
      icon: images.activeMarker,
      onPress: () =>
        setMapModal({
          isOpen: true,
          type: EMapModalTypes.TakePassenger,
          defaultCenter:
            from?.latitude && from?.longitude
              ? [from.latitude, from.longitude]
              : undefined,
        }),
    },
  ]

  const toButtons = [
    {
      icon: isToAddressShort ? images.minusIcon : images.plusIcon,
      onPress: () => setIsToAddressShort(prev => !prev),
    },
    {
      icon: images.activeMarker,
      onPress: () =>
        setMapModal({
          isOpen: true,
          type: EMapModalTypes.TakePassenger,
          defaultCenter:
            to?.latitude && to?.longitude ? [to.latitude, to.longitude] : undefined,
        }),
    },
  ]

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setTakePassengerModal({ isOpen: false })}
    >
      <View style={[styles.modal, styles.takePassengerModal]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>{t(TRANSLATION.TOOK_PASSENGER)}</Text>

          {/* FROM */}
          <Input
            inputProps={{
              placeholder: t(TRANSLATION.START_POINT),
              value:
                isFromAddressShort && from?.shortAddress
                  ? from?.shortAddress
                  : from?.address ||
                    (from?.latitude && from?.longitude
                      ? `${from.latitude}, ${from.longitude}`
                      : ''),
              onChangeText: (text: string) =>
                setTakePassengerModalFrom({ address: text }),
            }}
            label={t(TRANSLATION.FROM)}
            error={getPointError(from)}
            buttons={
              to?.shortAddress ?
                toButtons :
                toButtons.slice(1)
            }
            
            
            suggestions={fromSuggestions}
            onSuggestionClick={s => setTakePassengerModalFrom(s.point)}
          />

          {/* TO */}
          <Input
            inputProps={{
              placeholder: t(TRANSLATION.DESTINATION_POINT),
              value:
                isToAddressShort && to?.shortAddress
                  ? to?.shortAddress
                  : to?.address ||
                    (to?.latitude && to?.longitude
                      ? `${to.latitude}, ${to.longitude}`
                      : ''),
              onChangeText: (text: string) =>
                setTakePassengerModalTo({ address: text }),
            }}
            label={t(TRANSLATION.TO)}
            error={getPointError(to)}
            buttons={to?.shortAddress ? toButtons : toButtons.slice(1)}
            suggestions={toSuggestions}
            onSuggestionClick={s => setTakePassengerModalTo(s.point)}
          />

          {/* SEATS */}
          <Input
            inputProps={{
              value: String(seats),
              onChangeText: v => setSeats(Number(v)),
            }}
            label={t(TRANSLATION.SEATS)}
            inputType={EInputTypes.Select}
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
            ]}
          />

          <Button
            text={t(TRANSLATION.PROVE)}
            className="proove-btn"
            onPress={onSubmit}
          />
        </ScrollView>
      </View>
    </Overlay>
  )
}

export default connector(TakePassengerModal)
