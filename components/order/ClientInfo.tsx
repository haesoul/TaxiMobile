import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IOrder, IUser } from '../../types/types'

interface IProps {
  order: IOrder
  client: IUser | null
  user: IUser | null
}

const ClientInfo: React.FC<IProps> = ({
  order,
  client,
  user,
}) => {

  const _userName = client
    ? `${client.u_name} ${client.u_family} ${client.u_middle}`
    : ''

  const _driver = !!user && order?.drivers?.find(item => item.u_id === user.u_id)

  const _extInfo =
    order.b_canceled
      ? `(${t(TRANSLATION.CANCELED)})`
      : order.b_completed
        ? `(${t(TRANSLATION.FINISHED)})`
        : _driver
          ? `(${t(TRANSLATION.BOOKING_DRIVER_STATES[_driver.c_state])})`
          : ''

  return (
    <View style={styles.orderPassengerInfo}>
      <View style={styles.orderPassengerInfoInner}>

        <View style={styles.avatar}>
          <images.passengerAvatar width={40} height={40}/>
        </View>

        <View>
          <Text style={styles.colored}>
            {_userName} {_extInfo}
          </Text>

          <View>

            <View style={styles.stars}>
              <images.stars width={80} height={16}/>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.orderSeparator} />
    </View>
  )
}

export default ClientInfo

const styles = StyleSheet.create({
  orderPassengerInfo: {
    flexDirection: 'column',
  },

  orderPassengerInfoInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },

  colored: {
    fontWeight: 'bold',
    color: '#333',
  },

  stars: {
    width: 80,
    height: 16,
    resizeMode: 'contain',
    marginTop: 4,
  },

  orderSeparator: {
    marginTop: 10,
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
  },
})
