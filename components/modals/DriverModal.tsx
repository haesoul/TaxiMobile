import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { ordersSelectors } from '../../state/orders'
import { EBookingDriverState, EColorTypes, ICar, IUser } from '../../types/types'
import Button from '../Button'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  activeOrders: ordersSelectors.activeOrders(state),
  isOpen: modalsSelectors.isDriverModalOpen(state),
})

const mapDispatchToProps = {
  setDriverModal: modalsActionCreators.setDriverModal,
  setCancelModal: modalsActionCreators.setCancelModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const DriverModal: React.FC<IProps> = ({
  isOpen,
  selectedOrder,
  activeOrders,
  setDriverModal,
  setCancelModal,
}) => {

  const [car, setCar] = useState<ICar | null>(null)
  const [driverUser, setDriverUser] = useState<IUser | null>(null)

  const order = activeOrders?.find(item => item.b_id === selectedOrder)
  const driver = order?.drivers?.find(item => item.c_state > EBookingDriverState.Canceled)

  useEffect(() => {
    if (isOpen && selectedOrder && driver?.c_id) {
      API.getCar(driver.c_id)
        .then(setCar)
        .catch(console.error)
      API.getUser(driver.u_id)
        .then(setDriverUser)
        .catch(console.error)
    }
  }, [isOpen])

  const registrationPlate = car?.registration_plate.split(' ')

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setDriverModal(false)}
    >
      <ScrollView
        contentContainerStyle={[styles.driverModal, { padding: 20, borderRadius: 10 }]}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.driverModalFormFieldsetH3}>
            {!!driver?.c_state && t(TRANSLATION.BOOKING_DRIVER_STATES[driver?.c_state])} №{selectedOrder}
          </Text>

          <View style={styles.driverInfo}>
            <View style={styles.driverInfoDivChild}>

              <View style={styles.driverInfoImg} >
                <images.solidCar />
              </View>
              <Text style={styles.driverInfoDivChildSpan}>
                {!!car?.cm_id && t(TRANSLATION.CAR_MODELS[car.cm_id])}
              </Text>
              <Text style={styles.driverInfoDivChildSpanThird}>
                {!!car?.color && t(TRANSLATION.CAR_COLORS[car.color])}
              </Text>
            </View>
            <View style={styles.driverInfoImg} >
                <images.driverAvatar />
                <images.stars />
            </View>


            <View style={styles.driverInfoDivChild}>
              <View style={styles.driverInfoImg} >
                <images.subwayIdCard />
              </View>
              <Text style={[styles.driverInfoDivChildSpan, styles.driverModalRegistrationPlate]}>
                {registrationPlate?.[0]}
              </Text>
              <Text style={[styles.driverInfoDivChildSpan, styles.driverModalRegistrationPlate]}>
                {registrationPlate?.slice(1).join(' ')}
              </Text>
            </View>
          </View>

          <View style={styles.driverInfoDiv}>
            <Text style={styles.driverModalFormFieldsetH4}>
              {driverUser?.u_name} {driverUser?.u_family} {driverUser?.u_middle}
            </Text>

            {driver?.c_state && (driver.c_state > EBookingDriverState.Canceled) && (
              <Button
                text={t(TRANSLATION.CANCEL)}
                onPress={() => setCancelModal(true)}
                colorType={EColorTypes.Accent}
                style={styles.cancellButtonBtn}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </Overlay>
  )
}

export default connector(DriverModal)
