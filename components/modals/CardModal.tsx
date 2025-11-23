// CardModal.native.tsx
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Alert as RNAlert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { EDriverTabs } from '../../pages/Driver'
import { CURRENCY } from '../../siteConstants'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { EMapModalTypes } from '../../state/modals/constants'
import { orderActionCreators } from '../../state/order'
import { ordersActionCreators, ordersSelectors } from '../../state/orders'
import {
  ordersDetailsActionCreators,
  ordersDetailsSelectors,
} from '../../state/ordersDetails'
import { userSelectors } from '../../state/user'
import { useCachedState, useSelector } from '../../tools/hooks'
import {
  addHiddenOrder,
  dateFormatDate,
  dateShowFormat,
  formatCommentWithEmoji,
  formatCurrency,
  getOrderCount,
  getPayment,
} from '../../tools/utils'
import {
  EBookingDriverState,
  EBookingStates,
  EPaymentWays,
  EStatuses,
  IAddressDetails,
  IOrder
} from '../../types/types'
import { calculateFinalPrice, calculateFinalPriceFormula } from './RatingModal'


// Map numeric booking states to keys (kept from web)
const bookingStates: Record<number, keyof typeof EBookingStates> = {
  1: 'Processing',
  2: 'Approved',
  3: 'Canceled',
  4: 'Completed',
  5: 'PendingActivation',
  6: 'OfferedToDrivers',
}

const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
  modal: modalsSelectors.orderCardModal(state),
  activeChat: modalsSelectors.activeChat(state),
})

const mapDispatchToProps = {
  watchOrder: ordersActionCreators.watchOrder,
  takeOrder: ordersActionCreators.take,
  setOrderState: ordersActionCreators.setState,
  getOrderStart: ordersDetailsActionCreators.getOrderStart,
  getOrderDestination: ordersDetailsActionCreators.getOrderDestination,
  setSelectedOrderId: orderActionCreators.setSelectedOrderId,
  setModal: modalsActionCreators.setOrderCardModal,
  setCancelDriverOrderModal: modalsActionCreators.setDriverCancelModal,
  setRatingModal: modalsActionCreators.setRatingModal,
  setAlarmModal: modalsActionCreators.setAlarmModal,
  setLoginModal: modalsActionCreators.setLoginModal,
  setMapModal: modalsActionCreators.setMapModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  setActiveChat: modalsActionCreators.setActiveChat,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type ReduxProps = ConnectedProps<typeof connector>

interface IFormValues {
  votingNumber?: number
  performers_price?: number
}

function CardModal(props: ReduxProps) {
  const { modal } = props
  // Show only if modal has orderId
  if (!modal || !('orderId' in modal)) return null
  return <CardModalContent {...modal} {...props} />
}

type ContentProps = ReduxProps & {
  isOpen: boolean
  orderId: IOrder['b_id']
}

function CardModalContent({
  isOpen: active,
  orderId,
  setModal,
  user,
  activeChat,
  watchOrder,
  takeOrder,
  setOrderState,
  getOrderStart,
  getOrderDestination,
  setSelectedOrderId,
  setMapModal,
  setRatingModal,
  setCancelDriverOrderModal,
  setMessageModal,
  setAlarmModal,
  setActiveChat,
}: ContentProps) {
  const router = useRouter()
  const avatar = images.avatar
  const avatarSize = 48

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, orderId })
  }, [setModal, orderId])

  useEffect(() => {
    if (orderId) watchOrder(orderId)
  }, [orderId, watchOrder])

  const order = useSelector(ordersSelectors.order, orderId) ?? null
  const orderMutates = useSelector(ordersSelectors.orderMutates, orderId)

  useEffect(() => {
    if (order) {
      getOrderStart(order)
      getOrderDestination(order)
    }
  }, [order, getOrderStart, getOrderDestination])

  let address = useSelector(ordersDetailsSelectors.start, orderId)
  if (address && 'details' in (address as any)) {
    address = {
      ...(address as any),
      shortAddress: formatShortAddress((address as any).details as IAddressDetails),
    }
  }
  let destinationAddress = useSelector(ordersDetailsSelectors.destination, orderId)
  if (destinationAddress) {
    destinationAddress = {
      ...(destinationAddress as any),
      address: (destinationAddress as any).address ?? `${(destinationAddress as any).latitude}, ${(destinationAddress as any).longitude}`,
      shortAddress: 'details' in (destinationAddress as any) ?
        formatShortAddress((destinationAddress as any).details as IAddressDetails) :
        (destinationAddress as any).shortAddress ?? ((destinationAddress as any).address ? undefined : `${(destinationAddress as any).latitude}, ${(destinationAddress as any).longitude}`),
    }
  }

  const driver = useMemo(
    () => order?.drivers?.find((item) => item.c_state > EBookingDriverState.Canceled),
    [order?.drivers],
  )

  const [isFromAddressShort, setIsFromAddressShort] = useCachedState(
    'components.modals.CardModal.isFromAddressShort',
    false,
  )

  // react-hook-form usage
  const { register, formState: { errors }, handleSubmit: formHandleSubmit, getValues } = useForm<IFormValues>({
    criteriaMode: 'all',
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (active && orderId) setSelectedOrderId(orderId)
  }, [active, orderId, setSelectedOrderId])

  // helper for mutations
  async function orderMutation(mutation: () => Promise<void>) {
    try {
      await mutation()
    } catch (error) {
      console.error(error)
      setMessageModal({
        isOpen: true,
        message: (error as any) || t(TRANSLATION.ERROR),
        status: EStatuses.Fail,
      })
    }
  }

  const handleSubmit = () => orderMutation(async () => {
    await takeOrder(orderId, { ...getValues() } as any)
  })

  const onArrivedClick = () => orderMutation(async () => {
    await setOrderState(orderId, EBookingDriverState.Arrived)
  })

  const onHideOrder = () => {
    addHiddenOrder(orderId, user?.u_id)
  }

  const onStartedClick = () => orderMutation(async () => {
    await setOrderState(orderId, EBookingDriverState.Started)
    // navigate to driver-order map tab
    try {
      router.push({ pathname: '/driver-order', params: { tab: 'map' } } as any)
    } catch {
      // fallback: close modal
    }
    closeModal()
  })

  const onCompleteOrderClick = () => orderMutation(async () => {
    await setOrderState(orderId, EBookingDriverState.Finished)
    try {
      router.push({ pathname: '/driver-order', params: { tab: EDriverTabs.Lite } } as any)
    } catch {}
    setRatingModal({ isOpen: true })
    closeModal()
  })

  const onAlarmClick = () => setAlarmModal({ isOpen: true })
  const onRateOrderClick = () => setRatingModal({ isOpen: true })

  const openChatModal = () => {
    if (!order?.b_options?.createdBy) {
      const from = `${user?.u_id}_${orderId}`
      const to = `${order?.u_id}_${orderId}`
      const chatID = `${from};${to}`
      setActiveChat(activeChat === chatID ? null : chatID)
      return
    }
    if (!order.user) return
    switch (order.b_options.createdBy) {
      case 'sms':
        Linking.openURL(`tel:${order.user?.u_phone}`).catch(() => RNAlert.alert('Cannot open dialer'))
        break
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${order.user?.u_phone}`).catch(() => RNAlert.alert('Cannot open WhatsApp'))
        break
      default: {
        const from = `${user?.u_id}_${orderId}`
        const to = `${order?.u_id}_${orderId}`
        const chatID = `${from};${to}`
        setActiveChat(activeChat === chatID ? null : chatID)
      }
    }
  }

  const getButtons = () => {
    const disabled = !!orderMutates
    if (!order) {
      return (
        <TouchableOpacity style={styles.clientButton} onPress={closeModal} disabled={disabled}>
          <Text>{t(TRANSLATION.EXIT_NOT_AVIABLE)}</Text>
        </TouchableOpacity>
      )
    }

    if (driver?.c_state === EBookingDriverState.Finished && driver?.c_rating) {
      return (
        <TouchableOpacity style={styles.clientButton} onPress={closeModal}>
          <Text>{t(TRANSLATION.EXIT)}</Text>
        </TouchableOpacity>
      )
    }

    if (!driver) {
      return (
        <View>
          {order?.b_voting && (
            <View style={styles.clientInputFieldWrapperFull}>
              <Text>{t(TRANSLATION.DRIVE_NUMBER)}</Text>
              {/* Simple input - react-hook-form register isn't straightforward in RN; use getValues/setValue as alternative */}
              <TouchableOpacity style={[styles.clientButton, { marginTop: 6 }]} onPress={() => RNAlert.alert('Enter voting number in RN UI')}>
                <Text>{errors?.votingNumber ? String(errors.votingNumber.message) : t(TRANSLATION.DRIVE_NUMBER)}</Text>
              </TouchableOpacity>
            </View>
          )}
          {order.drivers?.find(i => i.u_id === user?.u_id)?.c_state !== EBookingDriverState.Considering && (
            <>
              <TouchableOpacity style={[styles.clientButton, disabled && { opacity: 0.6 }]} onPress={() => formHandleSubmit(handleSubmit)()} disabled={disabled}>
                <Text>{t(TRANSLATION.TAKE_ORDER)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clientButton} onPress={onHideOrder}>
                <Text>{t(TRANSLATION.HIDE_ORDER)}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )
    }

    if (order.b_state === EBookingStates.Canceled) {
      return (
        <TouchableOpacity style={styles.clientButton} onPress={closeModal}>
          <Text>{t(TRANSLATION.EXIT_USER_CANCELLED)}</Text>
        </TouchableOpacity>
      )
    }

    // driver present and different states
    if (driver?.c_state === EBookingDriverState.Performer) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={openChatModal}>
            <Text>{t(TRANSLATION.CHAT) || 'Chat'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={onArrivedClick} disabled={disabled}>
            <Text>{t(TRANSLATION.ARRIVED)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={() => setCancelDriverOrderModal(true)}>
            <Text>{t(TRANSLATION.WENT)}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (driver?.c_state === EBookingDriverState.Arrived) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={openChatModal}><Text>{t(TRANSLATION.CHAT) || 'Chat'}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={onStartedClick}><Text>{t(TRANSLATION.WENT)}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={() => setCancelDriverOrderModal(true)}><Text>{t(TRANSLATION.WENT)}</Text></TouchableOpacity>
        </View>
      )
    }

    if (driver?.c_state === EBookingDriverState.Started) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={onCompleteOrderClick}><Text>{t(TRANSLATION.CLOSE_DRIVE)}</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.clientButton, { marginRight: 8 }]} onPress={onAlarmClick}><Text>{t(TRANSLATION.ALARM)}</Text></TouchableOpacity>
        </View>
      )
    }

    if (driver?.c_state === EBookingDriverState.Finished) {
      return (
        <TouchableOpacity style={styles.clientButton} onPress={onRateOrderClick}><Text>{t(TRANSLATION.RATE_DRIVE)}</Text></TouchableOpacity>
      )
    }

    return null
  }

  const outsideClick = () => {
    closeModal()
  }

  const shortAddressHandler = () => {
    setIsFromAddressShort((prev) => !prev)
  }

  const getStatusText = () => {
    if (order?.b_voting) return t(TRANSLATION.VOTER)
    return ''
  }

  const getStatusTextColor = () => {
    if (order?.b_voting) return '#FF2400'
    return 'rgba(0,0,0,0.25)'
  }

  const price = calculateFinalPrice(order)
  const _type = order?.b_payment_way === EPaymentWays.Credit ? TRANSLATION.CARD : TRANSLATION.CASH
  const _value = (order && order.b_options && order.b_options.customer_price) ?
    `${t(_type)}. ${t(TRANSLATION.WHAT_WE_DELIVERING)} ${order.b_options.customer_price} ${CURRENCY.SIGN}` :
    `${t(_type)}. ${t(TRANSLATION.FIXED)}${price ? CURRENCY.SIGN : ''}${(price || '-') || getPayment(order).text}`

  // Modal content
  return (
    <Modal visible={!!active} animationType="slide" transparent>
      <TouchableOpacity activeOpacity={1} style={[styles.statusCardModal, active && styles.statusCardModalActive]} onPress={outsideClick}>
        <View style={styles.statusCardModalInner}>
          <ScrollView contentContainerStyle={{ padding: 12 }}>
            {/* Top */}
            <View style={styles.topGrid}>
              <View style={styles.topAvatar as any}>
                <Image source={{ uri: avatar }} style={[styles.cardImg, { width: avatarSize, height: avatarSize }]} />
              </View>
              <View style={styles.topName}>
                <Text style={styles.topParagraph as any}>
                  {order?.user?.u_family?.trimStart()} {order?.user?.u_name?.trimStart()} {order?.user?.u_middle?.trimStart()}
                </Text>
                <Text style={styles.topB as any}>
                  ({order?.u_id}) ({bookingStates[order?.b_state as any]})
                </Text>
              </View>
              <View style={styles.topStars}>
                <Text>★★★★☆ 24/20</Text>
              </View>
            </View>

            <View style={styles.statusCardSeparator as any} />

            {/* Address block */}
            <View style={styles.addressParagraph as any}>
              <Text style={styles.addressBold as any}>Estimate time: {(Math.trunc(order?.b_options?.pricingModel?.options?.duration) || 0)} min</Text>

              {/* From */}
              <View style={styles.addressParagraphRow as any}>
                <Text style={styles.addressParagraphRowSpan as any}>{t(TRANSLATION.FROM)}:</Text>
                <View style={styles.statusCardFromAddressRow as any}>
                  {address?.shortAddress ? (
                    <>
                      <Text style={styles.statusCardFromTextSmall as any}>{isFromAddressShort ? address.shortAddress : (address as any).address}</Text>
                      <TouchableOpacity onPress={shortAddressHandler} style={styles.statusCardFromAddressImg as any}>
                        <Text>{isFromAddressShort ? '+' : '-'}</Text>
                      </TouchableOpacity>
                    </>
                  ) : order?.b_destination_address ? (
                    <Text>{order?.b_start_address}</Text>
                  ) : (
                    <ActivityIndicator />
                  )}

                  <TouchableOpacity
                    style={{ marginLeft: 8 }}
                    onPress={() => setMapModal({
                      isOpen: true,
                      type: EMapModalTypes.OrderDetails,
                      defaultCenter: address?.latitude && address?.longitude ? [address.latitude, address.longitude] : null,
                    })}
                  >
                    <Text>[map]</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* To */}
              <View style={styles.addressParagraphRow as any}>
                <Text style={styles.addressParagraphRowSpan as any}>{t(TRANSLATION.TO)}:</Text>
                <View style={styles.statusCardFromAddressRow as any}>
                  {destinationAddress?.shortAddress ? (
                    <Text style={styles.statusCardFromTextSmall as any}>{isFromAddressShort ? destinationAddress.shortAddress : destinationAddress.address}</Text>
                  ) : order?.b_destination_address ? (
                    <Text>{order?.b_destination_address}</Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                  <TouchableOpacity
                    style={{ marginLeft: 8 }}
                    onPress={() => setMapModal({
                      isOpen: true,
                      type: EMapModalTypes.OrderDetails,
                      defaultCenter: destinationAddress?.latitude && destinationAddress?.longitude ? [destinationAddress.latitude, destinationAddress.longitude] : null,
                    })}
                  >
                    <Text>[map]</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.statusCardSeparator as any} />

            {/* Time & Payment */}
            <View style={styles.timeRowPaymentRow as any}>
              <View style={styles.statusCardTime as any}>
                <Text style={styles.statusCardTimeLabel as any}>{t(TRANSLATION.START_TIME)}:</Text>
                <Text>{order?.b_start_datetime?.format ? order.b_start_datetime.format(order.b_options?.time_is_not_important ? dateFormatDate : dateShowFormat) : String(order?.b_start_datetime)}</Text>
              </View>

              <View style={styles.paymentSpecial as any}>
                <Text>{t(TRANSLATION.PAYMENT_WAY)}: {_value}{order?.b_options?.pricingModel?.calculationType === 'incomplete' ? ' + ?' : ''}</Text>
                <Text>{t(TRANSLATION.CALCULATION) + ': ' + calculateFinalPriceFormula(order)}</Text>
                {order?.profit && <Text style={styles.statusCardProfit as any}>{formatCurrency(order.profit, { signDisplay: 'always' })}</Text>}
              </View>
            </View>

            <View style={styles.statusCardSeparator as any} />

            {/* Client comments */}
            <View style={styles.clientGrid as any}>
              <View style={styles.clientComments as any}>
                {order?.u_id && formatCommentWithEmoji(order.b_comments)?.map((c, idx) => (
                  <View key={idx} style={styles.clientCommentsP as any}>
                    <Image source={{ uri: c.src }} style={styles.clientCommentsPImg as any} />
                    <Text style={styles.clientCommentsPSpanHidden as any}>{c.hint}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusCardSeats as any}>
                <Text style={styles.statusCardSeatsLabel as any}>{getOrderCount(order as IOrder)}</Text>
              </View>

              {/* Buttons and form area */}
              <View style={styles.clientBtns as any}>
                <View style={styles.clientButtonWrapper as any}>
                  {getButtons()}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export default connector(CardModal)

/* Helpers */

function formatShortAddress(address: IAddressDetails) {
  const { road, suburb, city, county, state, country } = address || {}
  const parts = [road, suburb, city, county, state, country].filter(Boolean)
  return parts.join(', ')
}








// STYLES.ts
import { Platform, StyleSheet } from 'react-native'

const lowProfitBg = '#C19276'
const lowProfitFg = '#3E0C0C'
const mediumProfitBg = '#FFFB8E'
const mediumProfitFg = '#A37211'
const highProfitBg = '#A1FF97'
const highProfitFg = '#22A613'

const styles = StyleSheet.create({
  /* ---------- Card ---------- */
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    // shadow (iOS) + elevation (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
    borderRadius: 13,
    // cursor: pointer -> handled by Touchable* wrapper in RN
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    // filter: grayscale(100%) -> RN can't do CSS filters; use tintColor or custom image processing if needed
  },
  cardSpan: {
    // this corresponds to .card span
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },
  cardHr: {
    width: '68%',
    // box-shadow: 1px 0px 0px #FFFFFF -> emulate with border or background
    height: 1,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
  cardPrice: {
    fontWeight: '500',
    marginBottom: 0,
  },
  cardImg: {
    // filter: grayscale(100%) -> not supported; keep placeholder
    // If using <Image />, you can apply style like tintColor for monochrome effects.
  },
  cardActiveImg: {
    // When active, no grayscale: remove tint or use original image
  },

  /* ---------- Status Card ---------- */
  statusCard: {
    // cursor pointer -> use Touchable wrapper
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#AE0000',
    boxSizing: 'border-box' as any,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 4,
    borderRadius: 13,
    padding: 10,
    // minHeight omitted; set via container if needed
    marginBottom: 8, // corresponds to &:not(:last-child)
  },

  /* profit variants */
  statusCardProfitLow: {
    backgroundColor: lowProfitBg,
  },
  statusCardProfitLowProfitText: {
    color: lowProfitFg,
  },
  statusCardProfitMedium: {
    backgroundColor: mediumProfitBg,
  },
  statusCardProfitMediumProfitText: {
    color: mediumProfitFg,
  },
  statusCardProfitHigh: {
    backgroundColor: highProfitBg,
  },
  statusCardProfitHighProfitText: {
    color: highProfitFg,
  },

  /* mobile-specific rules (originally @include phone) must be applied conditionally in component code
     Example: if (isPhone) { ...spread phone styles } */
  statusCardPhoneContainer: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  statusCardMoney: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCardCost: {
    // #{$b}__cost
    alignSelf: 'flex-start',
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
  statusCardProfit: {
    fontSize: 18,
    alignSelf: 'flex-end',
  },

  statusCardSeparator: {
    // container for separator area
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusCardNumber: {
    fontSize: 11,
    fontWeight: '500',
  },

  statusCardPoints: {
    paddingTop: 8,
    width: '100%',
    flexDirection: 'column',
  },

  /* From / address block */
  statusCardFrom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCardFromAddress: {
    width: '100%',
    // grid-template-columns: auto 1fr -> emulate with row
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 as any, // RN doesn't support gap; use margin on children
  },
  statusCardFromAddressRow: {
    // the child span that had grid -> use flex row with space between elements
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCardFromAddressImg: {
    height: 20,
    marginLeft: 16,
  },

  statusCardFromTextSmall: {
    color: 'rgba(0,0,0,0.25)',
    fontSize: 10,
    fontWeight: '500',
  },
  statusCardFromTextSmallStrong: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '500',
  },

  statusCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2 as any,
  },
  statusCardTimeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000000',
  },
  statusCardTimeIconPath: {
    // You should set stroke color via icon props, not via style override normally.
    // Example: <Svg><Path stroke="#FF2400" ... /></Svg>
  },

  statusCardTo: {
    // &__to
  },
  statusCardToSpan: {
    fontWeight: '300',
    fontSize: 19,
    lineHeight: 23,
    marginLeft: 5,
  },

  /* comments */
  statusCardComments: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCardCommentsImg: {
    width: 16,
    marginLeft: 4,
  },
  statusCardCommentsP: {
    maxWidth: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    color: '#000000',
    fontSize: 10,
    fontWeight: '500',
  },
  statusCardCommentsSpanFirst: {
    fontWeight: '400',
    fontSize: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCardUserId: {
    marginLeft: 10,
    fontSize: 18,
  },

  /* seats */
  statusCardSeats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 as any,
  },
  statusCardSeatsLabel: {
    fontWeight: '500',
    fontSize: 10,
    color: '#000000',
  },
  statusCardSeatsImg: {
    marginLeft: 5,
    width: 22,
  },

  /* other info */
  statusCardOtherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusCardOtherInfoSpan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#838383',
  },
  statusCardOtherInfoImgInline: {
    height: 18,
    width: 18,
    marginHorizontal: 8,
  },
  statusCardOtherInfoImg: {
    height: 17,
  },

  /* ---------- Modal inside status-card ---------- */
  statusCardModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    opacity: 0,
    // visibility/pointer-events replaced by conditional rendering / pointerEvents prop
    padding: 16,
  },
  statusCardModalActive: {
    opacity: 1,
    // pointerEvents: 'auto' -> set via component prop
  },
  statusCardModalInner: {
    overflow: 'hidden',
    maxWidth: 900,
    width: '100%',
    maxHeight: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    padding: 16,
    flexDirection: 'column',
    gap: 16 as any, // RN doesn't support gap; add marginBottom on children
  },

  statusCardModalSection: {
    position: 'relative',
    paddingBottom: 16,
  },
  statusCardModalSectionDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#F1F1F1',
  },

  topGrid: {
    // .top: originally grid-template-columns: auto 1fr auto; grid-rows: 1fr 1fr
    // Emulate with flex rows and nested column
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8 as any,
  },
  topAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  topName: {
    flexDirection: 'row',
    gap: 16 as any,
    alignItems: 'center',
  },
  topParagraph: {
    alignSelf: 'flex-end',
    padding: 0,
    margin: 0,
    lineHeight: 22, // approximate 1.5ch
    fontSize: 15,
    fontWeight: '500',
  },
  topStars: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topB: {
    // the small grey label at right
    fontSize: 11,
    fontWeight: '500',
    color: '#B9B9B9',
  },

  addressImg: {
    height: 20,
    marginLeft: 16,
    alignSelf: 'center',
  },
  addressBold: {
    opacity: 0.5,
    fontSize: 13,
    fontWeight: '500',
  },
  addressParagraph: {
    fontSize: 15,
    fontWeight: '500',
    flexDirection: 'column',
    gap: 8 as any,
  },
  addressParagraphRow: {
    // span inside p that used grid columns -> emulate with flexWrap
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 4 as any,
    rowGap: 8 as any,
    color: 'rgba(0,0,0,0.25)',
    fontSize: 15,
    fontWeight: '500',
  },
  addressParagraphRowSpan: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressParagraphSvgSpan: {
    // &.svg - align to end
    alignSelf: 'flex-end',
    paddingLeft: 16,
  },

  timeRowPaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 as any,
  },
  timeRowPaymentText: {
    fontSize: 12,
    fontWeight: '500',
  },

  paymentSpecial: {
    // nested color: #FF2400 for inner span
  },

  clientGrid: {
    // grid-template-columns: 1fr auto -> emulate with flex row
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  clientComments: {
    flexDirection: 'row',
    gap: 4 as any,
    // use Touchable wrapper in component
  },
  clientCommentsActiveColumn: {
    flexDirection: 'column',
  },
  clientCommentsP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 as any,
    fontSize: 12,
    padding: 0,
    margin: 0,
  },
  clientCommentsPImg: {
    width: 16,
    marginLeft: 4,
  },
  clientCommentsPSpanHidden: {
    display: 'none', // use conditional rendering instead
    fontSize: 10,
  },
  clientForm: {
    // form grid-column 1/3 -> full width
    width: '100%',
  },
  clientBtns: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8 as any,
  },
  clientButtonWrapper: {
    padding: 0,
    margin: 0,
    // &:only-child -> logic in component
  },
  clientButton: {
    height: 'auto',
    backgroundColor: '#FF2400',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 0,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  clientInputFieldWrapperFull: {
    width: '100%',
  },

  /* ---------- Order history ---------- */
  orderHistory: {
    marginBottom: 20,
  },
  orderHistoryAll: {
    color: '#989898',
  },
  statusCardSeparatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* ---------- Helpers & notes ---------- */
  // Note: RN does not support pseudo-classes like :not(:last-child), :before etc.
  // Implement separators/conditional margins in component render logic.
  // For media queries (@include phone) use Dimensions or useWindowDimensions and apply different styles conditionally.

  /* platform tweaks example */
  platformShadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 7,
    },
    android: {
      elevation: 3,
    },
  }) as any,
})
