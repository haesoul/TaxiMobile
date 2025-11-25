// app/Order/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import Button from '../../components/Button'
import ChatToggler from '../../components/Chat/Toggler'
import LoadFrame from '../../components/LoadFrame'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators } from '../../state/modals'
import { EMapModalTypes } from '../../state/modals/constants'
import { orderActionCreators, orderSelectors } from '../../state/order'
import { userSelectors } from '../../state/user'
import { useInterval } from '../../tools/hooks'
import { addHiddenOrder } from '../../tools/utils'
import { EBookingDriverState, EBookingStates, EColorTypes, EStatuses } from '../../types/types'

import ClientInfo from '@/components/order/ClientInfo'
import OrderInfo from '@/components/order/orderInfo'
import PageSection from '../../components/PageSection'
import styles from './STYLES'

// --- helpers ---
function toDisplayString(value: string | string[] | number | null | undefined) {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

/**
 * Принимает bComments в виде строки или массива строк (или undefined/null)
 * Возвращает true если внутри есть '96' или '95'
 */
function bCommentsIncludes96(bComments?: string | string[] | null) {
  if (!bComments) return false
  if (Array.isArray(bComments)) {
    return bComments.some(item => {
      if (!item) return false
      return ['96', '95'].some(x => item.includes(x))
    })
  }
  return ['96', '95'].some(x => bComments.includes(x))
}

// --- Redux mappings ---
const mapStateToProps = (state: IRootState) => ({
  order: orderSelectors.order(state),
  client: orderSelectors.client(state),
  start: orderSelectors.start(state),
  destination: orderSelectors.destination(state),
  status: orderSelectors.status(state),
  message: orderSelectors.message(state),
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  getOrder: orderActionCreators.getOrder,
  setOrder: orderActionCreators.setOrder,
  setCancelDriverOrderModal: modalsActionCreators.setDriverCancelModal,
  setRatingModal: modalsActionCreators.setRatingModal,
  setAlarmModal: modalsActionCreators.setAlarmModal,
  setLoginModal: modalsActionCreators.setLoginModal,
  setMapModal: modalsActionCreators.setMapModal,
  setMessageModal: modalsActionCreators.setMessageModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IFormValues {
  votingNumber?: number
  performers_price?: number
}

type PropsFromRedux = ConnectedProps<typeof connector>
type IProps = PropsFromRedux

const imageSource = (src: any) => {
  if (!src) return undefined
  return typeof src === 'string' ? { uri: src } : src
}

const Order: React.FC<IProps> = ({
  order,
  client,
  start,
  destination,
  status,
  message,
  user,
  getOrder,
  setOrder,
  setMapModal,
  setRatingModal,
  setCancelDriverOrderModal,
  setMessageModal,
  setAlarmModal,
}) => {
  const [isFromAddressShort, setIsFromAddressShort] = useState(true)
  const [isToAddressShort, setIsToAddressShort] = useState(true)

  const router = useRouter()
  const params = useLocalSearchParams()
  // params.id может быть string | string[] | undefined — приводим к строке безопасно
  const rawId = (params?.id as string | string[] | undefined) ?? ''
  const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId
  const tabType = params.tab
  const driver = useMemo(() => {
    if (!order?.drivers) return undefined
    return order.drivers.find(item => (item?.c_state ?? 0) > EBookingDriverState.Canceled)
  }, [order])

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<IFormValues>({
    criteriaMode: 'all',
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (id) {
      try {
        getOrder(id)
      } catch (e) {

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])


  useInterval(() => {
    if (id) {
      try {
        getOrder(id)
      } catch (err) {
        // noop
      }
    }
  }, 3000)

  useEffect(() => {
    return () => {
      try {
        setOrder(null)
      } catch (e) {
        
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmitForm = () => {
    const values = getValues()

    const payload = {
      votingNumber: values.votingNumber ?? 0,
      performers_price: values.performers_price ?? 0,
    }

    const bComments = order?.b_comments ?? ''
    const isCandidate = bCommentsIncludes96(bComments)

    API.takeOrder(id, payload, isCandidate)
      .then(() => {
        getOrder(id)
        setMessageModal({
          isOpen: true,
          status: EStatuses.Success,
          message: isCandidate ? t(TRANSLATION.YOUR_OFFER_SENT) : t(TRANSLATION.YOUR_ORDER_DESCRIPTION),
        })
      })
      .catch(error => {
        console.error(error)
        setMessageModal({
          isOpen: true,
          message: error?.toString() || t(TRANSLATION.ERROR),
          status: EStatuses.Fail,
        })
      })
  }

  const onHideOrder = () => {
    addHiddenOrder(id, user?.u_id)
    router.push('/Driver/Orders')

  }

  const onArrivedClick = () =>
    API.setOrderState(id, EBookingDriverState.Arrived)
      .then(() => getOrder(id))
      .catch(error => {
        console.error(error)
        setMessageModal({ isOpen: true, message: t(TRANSLATION.ERROR), status: EStatuses.Fail })
      })

  const onStartedClick = () =>
    API.setOrderState(id, EBookingDriverState.Started)
      .then(() => {
        getOrder(id)
        router.push('/Driver/Map')
      })
      .catch(error => {
        console.error(error)
        setMessageModal({ isOpen: true, message: t(TRANSLATION.ERROR), status: EStatuses.Fail })
      })

  const onCompleteOrderClick = () => {
    if (!driver?.c_started) {
      setMessageModal({
        isOpen: true,
        status: EStatuses.Fail,
        message: t(TRANSLATION.ERROR),
      })
      return
    }

    API.setOrderState(id, EBookingDriverState.Finished)
      .then(() => {
        getOrder(id)
        setMessageModal({
          isOpen: true,
          status: EStatuses.Success,
          message: t(TRANSLATION.TRIP, {}),
        })
        setRatingModal({ isOpen: true })
      })
      .catch(error => {
        console.error(error)
        setMessageModal({
          isOpen: true,
          status: EStatuses.Fail,
          message: t(TRANSLATION.ERROR),
        })
      })
  }

  const onAlarmClick = () => setAlarmModal({ isOpen: true })
  const onRateOrderClick = () => setRatingModal({ isOpen: true })

  const onExit = () => router.push('/Driver/Orders')

  const getButtons = () => {
    if (!order) {
      return (
        <View style={styles.takeOrderBtnContainer}>
          <Button text={t(TRANSLATION.EXIT_NOT_AVIABLE)} onPress={onExit} label={message} status={status} />
        </View>
      )
    }

    const bState = order?.b_state
    const bComments = order?.b_comments ?? ''
    const currentDriver = driver

    if (currentDriver?.c_state === EBookingDriverState.Finished && currentDriver?.c_rating) {
      return (
        <View style={styles.takeOrderBtnContainer}>
          <Button text={t(TRANSLATION.EXIT)} onPress={onExit} label={message} status={status} />
        </View>
      )
    }

    if (bState === EBookingStates.Canceled) {
      return (
        <View style={styles.takeOrderBtnContainer}>
          <Button text={t(TRANSLATION.EXIT_USER_CANCELLED)} onPress={onExit} label={message} status={status} />
        </View>
      )
    }

    if (!currentDriver) {
      return (
        <>
          {order?.b_voting && (
            <Controller
              control={control}
              name="votingNumber"
              rules={{ required: t(TRANSLATION.REQUIRED_FIELD) as any, min: 0, max: 9 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.orderFields}>
                  <Text style={styles.label}>{t(TRANSLATION.DRIVE_NUMBER)}</Text>
                  <TouchableOpacity style={styles.touchable} onPress={() => {}}>
                    <Text>{toDisplayString(value)}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {bCommentsIncludes96(order?.b_comments) && (
            <Controller
              control={control}
              name="performers_price"
              rules={{ required: t(TRANSLATION.REQUIRED_FIELD) as any, min: 0 }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.orderFields}>
                  <Text style={styles.label}>{t(TRANSLATION.PRICE_PERFORMER)}</Text>
                  <TouchableOpacity style={styles.touchable} onPress={() => {}}>
                    <Text>{toDisplayString(value)}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          {order.drivers?.find(i => i.u_id === user?.u_id)?.c_state !== EBookingDriverState.Considering && (
            <>
              <View style={styles.takeOrderBtnContainer}>
                <Button
                  text={t(bCommentsIncludes96(order?.b_comments) ? TRANSLATION.MAKE_OFFER : TRANSLATION.TAKE_ORDER)}
                  onPress={handleSubmit(handleSubmitForm)}
                  label={message}
                  status={status}
                />
              </View>
              <View style={styles.hideOrderBtnContainer}>
                <Button text={t(TRANSLATION.HIDE_ORDER)} onPress={onHideOrder} />
              </View>
            </>
          )}
        </>
      )
    }

    if (currentDriver?.c_state === EBookingDriverState.Performer) {
      return (
        <View style={styles.takeOrderBtnContainer}>
          <Button text={t(TRANSLATION.ARRIVED)} onPress={onArrivedClick} label={message} status={status} />
        </View>
      )
    }

    if (currentDriver?.c_state === EBookingDriverState.Arrived) {
      return (
        <>
          <View style={styles.takeOrderBtnContainer}>
            <Button text={t(TRANSLATION.WENT)} onPress={onStartedClick} label={message} status={status} />
          </View>
          <View style={styles.hideOrderBtnContainer}>
            <Button text={t(TRANSLATION.CANCEL_ORDER)} onPress={() => setCancelDriverOrderModal(true)} label={message} status={status} />
          </View>
        </>
      )
    }

    if (currentDriver?.c_state === EBookingDriverState.Started) {
      return (
        <>
          <View style={styles.takeOrderBtnContainer}>
            <Button text={t(TRANSLATION.CLOSE_DRIVE)} onPress={onCompleteOrderClick} label={message} status={status} />
          </View>
          <View style={styles.alarmBtnContainer}>
            <Button text={`${t(TRANSLATION.ALARM)}`} onPress={onAlarmClick} colorType={EColorTypes.Accent} label={message} status={status} />
          </View>
        </>
      )
    }

    if (currentDriver?.c_state === EBookingDriverState.Finished) {
      return (
        <View style={styles.takeOrderBtnContainer}>
          <Button text={t(TRANSLATION.RATE_DRIVE)} onPress={onRateOrderClick} label={message} status={status} />
        </View>
      )
    }

    return null
  }

  if (!order && status !== EStatuses.Fail) {
    return <LoadFrame />
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <PageSection style={styles.order}>
          {!!order ? (
            <View>
              <ClientInfo order={order} client={client} user={user} />

              <View style={styles.fromTo}>
                <Text style={styles.estimateTime}>
                  {t(TRANSLATION.ESTIMATE_TIME)}:&nbsp;{Math.round((order?.b_estimate_waiting ?? 0) / 60)} {t(TRANSLATION.MINUTES)}
                </Text>

                <Text style={styles.heading}>
                  {order.b_options?.object ? `${t(TRANSLATION.PICK_UP_PACKAGE)}:` : t(TRANSLATION.ADDRESSES)}
                </Text>

                <View style={styles.locationRow}>
                  <Text style={styles.label}>
                    {isFromAddressShort && start?.shortAddress ? toDisplayString(start.shortAddress) : toDisplayString(start?.address)}
                  </Text>

                  <View style={styles.locationButtons}>
                    {start?.shortAddress && (
                      <TouchableOpacity onPress={() => setIsFromAddressShort(prev => !prev)}>
                        <Image source={imageSource(isFromAddressShort ? images.minusIcon : images.plusIcon)} style={styles.locationButtonImg} />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() =>
                        setMapModal({
                          isOpen: true,
                          type: EMapModalTypes.OrderDetails,
                          defaultCenter: start?.latitude && start?.longitude ? [start.latitude, start.longitude] : null,
                        })
                      }
                    >
                      <Image source={imageSource(images.markerYellow)} style={styles.locationButtonImg} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.orderFields}>
                  <Text style={styles.orderFieldsLabel}>
                    {!!order.b_options?.from_tel && (
                      <Text
                        style={styles.phoneLink}
                        onPress={() => Linking.openURL(`tel:${toDisplayString(order.b_options?.from_tel)}`)}
                      >
                        {toDisplayString(order.b_options?.from_tel)}
                      </Text>
                    )}
                  </Text>
                </View>

                <View style={styles.deliveryText as ViewStyle}>
                  {order.b_options?.from_porch && (
                    <View style={styles.group}>
                      <Text>
                        {t(TRANSLATION.PORCH)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.from_porch)}</Text>
                      </Text>
                      <Text>
                        {t(TRANSLATION.FLOOR)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.from_floor)}</Text>
                      </Text>
                      <Text>
                        {t(TRANSLATION.ROOM)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.from_room)}</Text>
                      </Text>
                    </View>
                  )}

                  {order.b_options?.from_way && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>
                        {t(bCommentsIncludes96(order?.b_comments) ? TRANSLATION.COMMENT : TRANSLATION.WAY)}:
                      </Text>&nbsp;
                      {toDisplayString(order.b_options?.from_way) || t(TRANSLATION.NOT_SPECIFIED, { toLower: true })}
                    </Text>
                  )}

                  {!bCommentsIncludes96(order?.b_comments) && order.b_options?.from_day && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>{t(TRANSLATION.TAKE)}:</Text>&nbsp;
                      {toDisplayString(order.b_options?.from_day)}, {t(TRANSLATION.TIME_FROM, { toLower: true })}&nbsp;
                      {toDisplayString(order.b_options?.from_time_from)} {t(TRANSLATION.TIME_TILL, { toLower: true })}&nbsp;
                      {toDisplayString(order.b_options?.from_time_to) || t(TRANSLATION.NO_MATTER, { toLower: true })}
                    </Text>
                  )}

                  {order.b_options?.from_tel && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>{t(TRANSLATION.PHONE_TO_CALL)}:</Text> {toDisplayString(order.b_options?.from_tel)}
                      <Image source={imageSource(images.phone)} style={styles.orderFieldsImg} />
                    </Text>
                  )}
                </View>

                {order.b_options?.object && <Text style={styles.heading}>{`${t(TRANSLATION.DELIVER_PACKAGE)}:`}</Text>}

                {(destination?.address || destination?.latitude || destination?.longitude) && (
                  <View style={styles.locationRow}>
                    <Text style={styles.label}>
                      {isToAddressShort && destination?.shortAddress ? toDisplayString(destination.shortAddress) : toDisplayString(destination?.address)}
                    </Text>

                    <View style={styles.locationButtons}>
                      {destination?.shortAddress && (
                        <TouchableOpacity onPress={() => setIsToAddressShort(prev => !prev)}>
                          <Image source={imageSource(isToAddressShort ? images.minusIcon : images.plusIcon)} style={styles.locationButtonImg} />
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() =>
                          setMapModal({
                            isOpen: true,
                            type: EMapModalTypes.OrderDetails,
                            defaultCenter: destination?.latitude && destination?.longitude ? [destination.latitude, destination.longitude] : null,
                          })
                        }
                      >
                        <Image source={imageSource(images.markerGreen)} style={styles.locationButtonImg} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={styles.deliveryText as ViewStyle}>
                  {order.b_options?.to_porch && (
                    <View style={styles.group}>
                      <Text>
                        {t(TRANSLATION.PORCH)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.to_porch)}</Text>
                      </Text>
                      <Text>
                        {t(TRANSLATION.FLOOR)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.to_floor)}</Text>
                      </Text>
                      <Text>
                        {t(TRANSLATION.ROOM)} <Text style={styles.labelStrong}>{toDisplayString(order.b_options?.to_room)}</Text>
                      </Text>
                    </View>
                  )}

                  {order.b_options?.to_way && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>
                        {t(bCommentsIncludes96(order?.b_comments) ? TRANSLATION.COMMENT : TRANSLATION.WAY)}:
                      </Text>&nbsp;
                      {toDisplayString(order.b_options?.to_way) || t(TRANSLATION.NOT_SPECIFIED, { toLower: true })}
                    </Text>
                  )}

                  {!bCommentsIncludes96(order?.b_comments) && order.b_options?.to_day && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>{t(TRANSLATION.TAKE)}:</Text>&nbsp;
                      {toDisplayString(order.b_options?.to_day)}, {t(TRANSLATION.TIME_FROM, { toLower: true })}&nbsp;
                      {toDisplayString(order.b_options?.to_time_from)} {t(TRANSLATION.TIME_TILL, { toLower: true })}&nbsp;
                      {toDisplayString(order.b_options?.to_time_to) || t(TRANSLATION.NO_MATTER, { toLower: true })}
                    </Text>
                  )}

                  {order.b_options?.to_tel && (
                    <Text style={styles.deliverySpanBlock}>
                      <Text style={styles.labelStrong}>{t(TRANSLATION.PHONE_TO_CALL)}:</Text> {toDisplayString(order.b_options?.to_tel)}
                      <Image source={imageSource(images.phone)} style={styles.orderFieldsImg} />
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.separator} />

              <OrderInfo order={order} />

              {getButtons()}

              {driver && driver.u_id === user?.u_id && (
                <ChatToggler anotherUserID={toDisplayString(order.u_id)} orderID={toDisplayString(order.b_id)} />
              )}
            </View>
          ) : (
            <Text>{t(TRANSLATION.NOT_AVIABLE_ORDER)}</Text>
          )}
        </PageSection>
      </ScrollView>
    </SafeAreaView>
  )
}

export default connector(Order)
