import moment from 'moment'
import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { ordersSelectors } from '../../state/orders'
import { useInterval } from '../../tools/hooks'
import { EBookingDriverState, EColorTypes, EStatuses } from '../../types/types'
import Button from '../Button'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isOnTheWayModalOpen(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  activeOrders: ordersSelectors.activeOrders(state),
})

const mapDispatchToProps = {
  setOnTheWayModal: modalsActionCreators.setOnTheWayModal,
  setRatingModal: modalsActionCreators.setRatingModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  setAlarmModal: modalsActionCreators.setAlarmModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const OnTheWayModal: React.FC<IProps> = ({
  isOpen,
  selectedOrder,
  activeOrders,
  setOnTheWayModal,
  setRatingModal,
  setMessageModal,
  setAlarmModal,
}) => {
  const [seconds, setSeconds] = useState(0)
  const order = activeOrders?.find(item => item.b_id === selectedOrder)

  const duration = moment.duration(seconds * 1000)

  useInterval(() => {
    setSeconds(
      order?.b_start_datetime
        ? moment().diff(order?.b_start_datetime, 'seconds')
        : 0,
    )
  }, 1000)

  const handleCloseDriveClick = () => {
    if (selectedOrder) {
      API.setOrderState(selectedOrder, EBookingDriverState.Finished)
        .then(() => {
          setOnTheWayModal(false)
          setRatingModal({ isOpen: true, orderID: selectedOrder })
        })
        .catch(error => {
          console.error(error)
          setMessageModal({ isOpen: true, message: t(TRANSLATION.ERROR), status: EStatuses.Fail })
        })
    }
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setOnTheWayModal(false)}
    >
      <ScrollView contentContainerStyle={[styles.modal, { display: isOpen ? 'flex' : 'none' }]}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {t(TRANSLATION.DRIVING_HEADER)}
        </Text>

        <Text style={{ fontSize: 20, marginBottom: 8 }}>
          {t(TRANSLATION.DRIVING_TIME)}
        </Text>

        <Text style={styles.onthewayModalTime}>
          {`${duration.days() ? `${duration.days()} ${t(TRANSLATION.DAYS_SHORT)}` : ''} ${duration.minutes()}:${duration.seconds()}`}
        </Text>

        <Button
          text={t(TRANSLATION.CLOSE_DRIVE)}
          onPress={handleCloseDriveClick}
          style={styles.onthewayModalCloseButton}
        />

        <Button
          text={t(TRANSLATION.ALARM)}
          colorType={EColorTypes.Accent}
          onPress={() => setAlarmModal({ isOpen: true })}
        />
      </ScrollView>
    </Overlay>
  )
}

export default connector(OnTheWayModal)
