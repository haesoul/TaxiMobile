import React from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { IRootState } from '../../../state'
import { userSelectors } from '../../../state/user'
import { EBookingDriverState, IOrder } from '../../../types/types'

interface IProps extends ConnectedProps<typeof connector> {
  order: IOrder
}

const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
})

const connector = connect(mapStateToProps)

const OrderPhone: React.FC<IProps> = ({ user, order }) => {
  if (
    !order.b_contact ||
    (
      order.b_comments?.includes('96') &&
      !order.drivers?.find(item => item.c_state > EBookingDriverState.Canceled && item.u_id === user?.u_id)
    )
  ) return null

  const handleCall = () => {
    Linking.openURL(`tel:${order.b_contact}`)
  }

  return (
    <View style={styles.orderInfoPhone}>
      <View style={styles.orderFields}>

        <View style={styles.image}>
          <images.phone width={40} height={40}/>
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.colored}>
            <Text style={styles.orderFieldsTitle}>{t(TRANSLATION.CLIENT_TEL_MAIN)}: </Text>
          </Text>

          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.phoneLink}>{order.b_contact}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.orderSeparator} />
    </View>
  )
}

export default connector(OrderPhone)

const styles = StyleSheet.create({
  orderInfoPhone: {
    marginVertical: 5,
  },

  orderFields: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },

  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  colored: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },

  orderFieldsTitle: {
    fontWeight: 'bold',
  },

  phoneLink: {
    color: '#007AFF',
    fontSize: 16,
  },

  orderSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: 5,
  },
})
