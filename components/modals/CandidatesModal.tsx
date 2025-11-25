import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { CURRENCY } from '../../siteConstants'
import { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { userSelectors } from '../../state/user'
import { useInterval } from '../../tools/hooks'
import { dateFormatDate } from '../../tools/utils'
import { ICar, IOrder, IReply, IUser } from '../../types/types'
import Button from '../Button'
import ChatToggler from '../Chat/Toggler'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isCandidatesModalOpen(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  setCandidatesModal: modalsActionCreators.setCandidatesModal,
  setMessageModal: modalsActionCreators.setMessageModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const CandidatesModal: React.FC<IProps> = ({
  isOpen,
  selectedOrder,
  user,
  setCandidatesModal,
  setMessageModal,
}) => {
  const [activeCandidate, setActiveCandidate] = useState<IUser['u_id'] | null>(null)
  const [order, setOrder] = useState<IOrder | null>(null)
  const [users, setUsers] = useState<IUser[]>([])
  const [cars, setCars] = useState<ICar[]>([])

  useEffect(() => {
    if (user && isOpen && selectedOrder) {
      API.getOrder(selectedOrder).then(setOrder)
    }
  }, [selectedOrder, isOpen])

  useInterval(() => {
    if (user && isOpen && selectedOrder) {
      API.getOrder(selectedOrder).then(setOrder)
    }
  }, 3000)

  useEffect(() => {
    if (user && selectedOrder) {
      API.getUsers(order?.drivers?.map(i => i.u_id) || []).then(setUsers)
      API.getCars(order?.drivers?.map(i => i.c_id) || []).then(setCars)
    }
  }, [order?.drivers?.map(i => `${i.u_id}_${i.c_id}`).sort().join('.')])

  const handleCandidateClick = (candidate: IUser['u_id']) => {
    setActiveCandidate(prev => (prev === candidate ? null : candidate))
  }

  const handleChoseClick = () => {
    if (!selectedOrder || !activeCandidate) return
    API.chooseCandidate(selectedOrder, activeCandidate).then(() => {
      setCandidatesModal(false)
      setMessageModal({ isOpen: true, message: 'Candidate was chosen' })
    })
  }

  return (
    <Overlay isOpen={isOpen && !!order?.drivers?.length} onClick={() => setCandidatesModal(false)}>
      {isOpen && !!order?.drivers?.length && (
        <ScrollView contentContainerStyle={{ padding: 10 }}>
          <View style={styles.candidatesModalFieldset}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>{t(TRANSLATION.RESPONDING_PERFORMERS)}</Text>
            {order?.drivers?.map(item => {
              const userItem = users?.find(i => i.u_id === item.u_id)
              const car = cars?.find(i => i.c_id === item.c_id)
              const isActive = activeCandidate === item.u_id

              return (
                <View
                  key={item.u_id}
                  style={[
                    styles.candidatesModalCandidate,
                    isActive && styles.candidatesModalCandidateActive,
                  ]}
                >
                  <TouchableOpacity onPress={() => handleCandidateClick(item.u_id)}>
                    <View style={styles.candidatesModalCandidateHeader}>
                      <View style={styles.candidatesModalCandidateHeaderAvatar}>

                        <View style={styles.candidatesModalCandidateHeaderAvatarImg}>
                          <images.driverAvatar width={60} height={60}/>
                        </View>
                      </View>
                      <View style={styles.candidatesModalCandidateHeaderInfo}>
                        <Text style={styles.candidatesModalCandidateHeaderName}>
                          {userItem?.u_name} {userItem?.u_family ? ` ${userItem?.u_family}` : ''} (#
                          {userItem?.u_id}),{' '}
                          {!!car?.color && t(TRANSLATION.CAR_COLORS[car.color])} {!!car?.cm_id && t(TRANSLATION.CAR_MODELS[car.cm_id])}{' '}
                          {car?.registration_plate} (#{car?.c_id})
                        </Text>
                        <View style={styles.candidatesModalCandidateHeaderSubinfo}>
                          <Text style={styles.candidatesModalCandidateHeaderSubinfoItem}>
                            {t(TRANSLATION.COMMENTS)}: 0
                          </Text>
                          <Text style={styles.candidatesModalCandidateHeaderSubinfoItem}>
                            {t(TRANSLATION.CHOSEN)}: 0
                          </Text>
                          <Text style={styles.candidatesModalCandidateHeaderSubinfoItem}>
                            {t(TRANSLATION.PRICE_PERFORMER)}: {item.c_options?.performers_price} {CURRENCY.SIGN}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={[
                      styles.candidatesModalCandidateButtons,
                      isActive && styles.candidatesModalCandidateButtonsActive,
                    ]}
                  >
                    <Button text={t(TRANSLATION.CHOSE)} onPress={handleChoseClick} />
                    <ChatToggler anotherUserID={item.u_id} orderID={order.b_id} />
                  </View>

                  <View
                    style={[
                      styles.candidatesModalCandidateReplies,
                      isActive && styles.candidatesModalCandidateRepliesActive,
                    ]}
                  >
                    {/*item.u_replies?*/([] as IReply[]).map(reply => (
                      <View key={reply.date.toString()} style={styles.candidatesModalCandidateReply}>
                        <View style={styles.candidatesModalCandidateReplyRow}>

                          <View style={styles.candidatesModalCandidateReplyIconImg}>
                            <images.timer width={30} height={30}/>
                          </View>
                          <Text>
                            <Text style={{ fontWeight: 'bold' }}>{t(TRANSLATION.DATE_P)}: </Text>
                            {reply.date.format(dateFormatDate)}
                          </Text>
                        </View>
                        <View style={styles.candidatesModalCandidateReplyRow}>
                          <View style={styles.candidatesModalCandidateReplyIconImg}>
                            <images.uGroup width={30} height={30}/>
                          </View>
                          <Text>
                            <Text style={{ fontWeight: 'bold' }}>{t(TRANSLATION.CUSTOMER)}: </Text>
                            {reply.customerName}
                          </Text>
                        </View>
                        <View style={styles.candidatesModalCandidateReplyRow}>
                          <View style={styles.candidatesModalCandidateReplyIconImg}>
                            <images.cash width={30} height={30}/>
                          </View>
                          <Text>
                            <Text style={{ fontWeight: 'bold' }}>{t(TRANSLATION.COST)}: </Text>
                            {reply.payment}
                          </Text>
                        </View>
                        <View style={styles.candidatesModalCandidateReplyRow}>
                          <View style={styles.candidatesModalCandidateReplyIconImg}>
                            <images.chatIconBr width={30} height={30}/>
                          </View>
                          <Text>
                            <Text style={{ fontWeight: 'bold' }}>{t(TRANSLATION.COMMENT2)}: </Text>
                            {reply.content}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
    </Overlay>
  )
}

export default connector(CandidatesModal)
