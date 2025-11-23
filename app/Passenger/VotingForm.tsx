import moment from 'moment'
import React, { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps, useStore } from 'react-redux'
import * as API from '../../API'
import Button, { EButtonStyles } from '../../components/Button'
import CarClassSlider from '../../components/CarClassSlider'
import Icon from '../../components/Icon'
import Input, { EInputStyles, EInputTypes } from '../../components/Input'
import LocationInput from '../../components/LocationInput'
import PriceInput from '../../components/PriceInput'
import SeatSlider from '../../components/SeatSlider'
import ShortInfo from '../../components/ShortInfo'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { modalsActionCreators } from '../../state/modals'
import { ordersActionCreators, ordersSelectors } from '../../state/orders'
import { userSelectors } from '../../state/user'
import { getPhoneNumberError } from '../../tools/utils'
import { EPaymentWays, EPointType, IOptions } from '../../types/types'
import styles from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  activeOrders: ordersSelectors.activeOrders(state),
  from: clientOrderSelectors.from(state),
  to: clientOrderSelectors.to(state),
  comments: clientOrderSelectors.comments(state),
  time: clientOrderSelectors.time(state),
  phone: clientOrderSelectors.phone(state),
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  setPickTimeModal: modalsActionCreators.setPickTimeModal,
  setCommentsModal: modalsActionCreators.setCommentsModal,
  setLoginModal: modalsActionCreators.setLoginModal,
  getActiveOrders: ordersActionCreators.getActiveOrders,
  setPhone: clientOrderActionCreators.setPhone,
  resetClientOrder: clientOrderActionCreators.reset,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface IProps extends PropsFromRedux {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  syncFrom: () => void
  syncTo: () => void
  onSubmit: (data: Awaited<ReturnType<typeof API.postDrive>>) => void
  minimizedPartRef?: React.Ref<any>
  noSwipeElementsRef?: React.Ref<any[]>
}

const VotingForm: React.FC<IProps> = ({
  activeOrders,
  from,
  to,
  comments,
  time,
  phone,
  user,
  setPickTimeModal,
  setCommentsModal,
  setLoginModal,
  getActiveOrders,
  setPhone,
  resetClientOrder,
  isExpanded,
  setIsExpanded,
  syncFrom,
  syncTo,
  onSubmit,
  minimizedPartRef,
  noSwipeElementsRef,
}) => {

  const carSliderRef = useRef<any>(null)
  const seatSliderRef = useRef<any>(null)


  useImperativeHandle(noSwipeElementsRef as any, () => [
    carSliderRef.current,
    seatSliderRef.current,
  ].filter(Boolean), [])

  const available = useMemo(() => !activeOrders?.some(order => order.b_voting), [activeOrders])

  const [fromError, setFromError] = useState<string | null>(null)
  useLayoutEffect(() => { setFromError(null) }, [from])
  const [toError, setToError] = useState<string | null>(null)
  useLayoutEffect(() => { setToError(null) }, [to])
  const [phoneError, setPhoneError] = useState<string | null>(null)
  useLayoutEffect(() => { setPhoneError(null) }, [phone])

  const store = useStore<IRootState>()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submit = useCallback(async (voting = false) => {
    setSubmitError(null)

    const state = store.getState()
    const carClass = clientOrderSelectors.carClass(state)
    const seats = clientOrderSelectors?.seats(state)

    let error = false
    if (!from?.address) {
      setFromError(t(TRANSLATION.MAP_FROM_NOT_SPECIFIED_ERROR))
      error = true
    }
    if (!voting && !to?.address) {
      setToError(t(TRANSLATION.MAP_TO_NOT_SPECIFIED_ERROR))
      error = true
    }
    const phoneErr = getPhoneNumberError(phone)
    if (phoneErr) {
      setPhoneError(phoneErr)
      setIsExpanded(true)
      error = true
    }
    if (error) return

    if (!user) {
      setLoginModal(true)
      return
    }

    const commentObj: any = {}
    commentObj['b_comments'] = comments.ids || []
    comments.custom && (commentObj['b_custom_comment'] = comments.custom)
    comments.flightNumber && (commentObj['b_flight_number'] = comments.flightNumber)
    comments.placard && (commentObj['b_placard'] = comments.placard)

    const startTime = moment(voting || time === 'now' ? undefined : time)

    const options: IOptions = {
      fromShortAddress: from?.shortAddress,
      toShortAddress: to?.shortAddress,
    }

    setSubmitting(true)
    try {
      SITE_CONSTANTS.init(store.getState().global.data);
      const data = await API.postDrive({
        b_start_address: from!.address,
        b_start_latitude: from!.latitude,
        b_start_longitude: from!.longitude,
        b_destination_address: to?.address,
        b_destination_latitude: to?.latitude,
        b_destination_longitude: to?.longitude,
        ...commentObj,
        b_contact: phone! + '',
        b_start_datetime: startTime,
        b_passengers_count: clientOrderSelectors?.seats(store.getState()),
        b_car_class: clientOrderSelectors.carClass(store.getState()),
        b_payment_way: EPaymentWays.Cash,
        b_max_waiting: voting ? SITE_CONSTANTS.WAITING_INTERVAL : 7200,
        b_options: options,
        b_voting: voting,
      })

      resetClientOrder()
      getActiveOrders()
      onSubmit(data)
    } catch (error) {
      setSubmitError((error as any)?.message?.toString() || t(TRANSLATION.ERROR))
      // eslint-disable-next-line no-console
      console.error(error)
    }
    setSubmitting(false)
  }, [from, to, comments, time, phone, user, store, setLoginModal, getActiveOrders, setIsExpanded, onSubmit, resetClientOrder])

  const submitButtons = (
    <View style={styles.passengerVotingFormOrderButtonWrapper}>
      {useMemo(() => (
        <>
          <View style={styles.passengerVotingFormOrderButton}>
            <Button
              buttonStyle={EButtonStyles.RedDesign as any}
              text={t(TRANSLATION.VOTE, { toUpper: false })}
              onPress={() => submit(true)}
              disabled={!available || submitting}
            />
          </View>

          <View style={styles.passengerVotingFormOrderButton}>
            <Button
              buttonStyle={EButtonStyles.RedDesign as any}
              text={t(TRANSLATION.TO_ORDER, { toUpper: false })}
              onPress={() => submit()}
              disabled={!available || submitting}
            />
          </View>
        </>
      ), [available, submitting, submit])}

      {submitError ? (
        <Text style={styles.passengerVotingFormOrderButtonError}>{submitError}</Text>
      ) : null}
    </View>
  )

  return (
    <View style={styles.passengerVotingForm}>

      <View
        ref={minimizedPartRef as any}
        style={styles.passengerVotingFormGroup}
      >
        <View style={styles.passengerVotingFormLocationWrapper}>
          {useMemo(() => (
            <LocationInput
              // style={styles.passengerVotingFormLocationWrapper}
              type={EPointType.From}
              onOpenMap={syncFrom}
              error={fromError ?? undefined}
            />
          ), [syncFrom, fromError])}

          {useMemo(() => (
            <LocationInput
              // style={styles.passengerVotingFormLocationWrapper}
              type={EPointType.To}
              onOpenMap={syncTo}
              error={toError ?? undefined}
            />
          ), [syncTo, toError])}
        </View>

        {useMemo(() => !isExpanded && <ShortInfo />, [isExpanded])}

        {!isExpanded && submitButtons}
      </View>

      <View style={styles.passengerVotingFormSeatsAndTime}>
        {useMemo(() => (
          <View style={styles.passengerVotingFormSeats}>
            <Text style={styles.passengerVotingFormSeatsTitle}>{t(TRANSLATION.SEATS)}</Text>
            <View ref={seatSliderRef}>
              <SeatSlider />
            </View>
          </View>
        ), [])}

        {useMemo(() => (
          <View style={styles.passengerVotingFormTime}>
            <View style={styles.passengerVotingFormTimeWrapper}>
              <Text style={styles.passengerVotingFormTimeTitle}>{t(TRANSLATION.START_TIME)}</Text>
              <Text style={styles.passengerVotingFormTimeValue}>
                {time === 'now' ? t(TRANSLATION.NOW) : (time && (time as any).format ? (time as any).format('D MMM, H:mm') : String(time))}
              </Text>
            </View>

            <TouchableOpacity style={styles.passengerVotingFormTimeBtn} onPress={() => setPickTimeModal(true)}>
              <Icon src="alarm" style={styles.passengerVotingFormTimeIcon} />
            </TouchableOpacity>
          </View>
        ), [time, setPickTimeModal])}
      </View>

      {useMemo(() => (
        <View style={styles.passengerVotingFormCarClass}>
          <View style={styles.passengerVotingFormCarClassHeader}>
            <Text style={styles.passengerVotingFormCarClassTitle}>{t(TRANSLATION.AUTO_CLASS)}</Text>

            <View style={styles.passengerVotingFormCarNearbyInfo}>
              <Icon src="carNearby" style={styles.passengerVotingFormCarNearbyIcon} />
              <Text style={styles.passengerVotingFormCarNearbyInfoText}>{7} автомобилей рядом</Text>
            </View>

            <View style={styles.passengerVotingFormCarNearbyInfo}>
              <Icon src="timeWait" style={styles.passengerVotingFormWaitingTimeIcon} />
              <Text style={styles.passengerVotingFormCarNearbyInfoText}>~{5} минут</Text>
            </View>
          </View>

          <View ref={carSliderRef}>
            <CarClassSlider />
          </View>
        </View>
      ), [])}

      {useMemo(() => (
        <View style={styles.passengerVotingFormComments}>
          <View style={styles.passengerVotingFormCommentsWrapper}>
            <Text style={styles.passengerVotingFormCommentsTitle}>{t(TRANSLATION.COMMENT)}</Text>
            <Text style={styles.passengerVotingFormCommentsValue}>
              {comments.ids.map((id: any) => t(TRANSLATION.BOOKING_COMMENTS[id])).join(', ') || '-'}
            </Text>
          </View>

          <TouchableOpacity style={styles.passengerVotingFormCommentsBtn} onPress={() => setCommentsModal(true)}>
            <Image source={images.seatSliderArrowRight as any} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
        </View>
      ), [comments, setCommentsModal])}

      {useMemo(() => (
        <Input
          fieldWrapperStyle={styles.passengerVotingFormLocationWrapper}
          // value={phone ?? ''}
          inputProps={{
            value: (phone ?? '').toString(),
          }}
          inputType={EInputTypes.MaskedPhone}
          style={EInputStyles.RedDesign as any}
          // buttons={user?.u_phone ? [{ image: images.checkMarkRed, onClick() { setPhone(+user!.u_phone!) } }] : []}
          buttons={
            user?.u_phone
              ? [
                  {
                    buttonProps: {
                      image: images.checkMarkRed,
                      onPress: () => setPhone(+user!.u_phone!),
                    },
                  },
                ]
              : []
          }
          
          error={phoneError ?? undefined}
          onChange={(val: any) => setPhone(val)}
        />
      ), [phone, setPhone, user, phoneError])}

      {useMemo(() => SITE_CONSTANTS.ENABLE_CUSTOMER_PRICE ? (
        <View style={styles.passengerVotingFormLocationWrapper}>
          <PriceInput />
        </View>
      ) : null, [])}

      {isExpanded && submitButtons}

    </View>
  )
}
// export const VotingFormConnected = connector(VotingForm)
export default connector(VotingForm)
