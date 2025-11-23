import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { CURRENCY } from '../../../siteConstants'
import { getPayment } from '../../../tools/utils'
import { EPaymentWays, IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const Payment: React.FC<IProps> = ({ order }) => {
  const _type = order.b_payment_way === EPaymentWays.Credit ? TRANSLATION.CARD : TRANSLATION.CASH
  const _value = (order && order.b_options && order.b_options.customer_price) ?
    t(_type) + '. ' + t(TRANSLATION.WHAT_WE_DELIVERING) + ` ${order.b_options.customer_price} ${CURRENCY.SIGN}` :
    t(_type) + '. ' + t(TRANSLATION.FIXED) + ` ${getPayment(order).text} ${CURRENCY.SIGN}`

  return <View style={[styles.payment]}>
    <OrderField image={images.cash} alt={t(TRANSLATION.CARD)} title={t(TRANSLATION.PAYMENT_WAY)} value={_value}/>
  </View>
}

export default Payment

const styles = StyleSheet.create({
  payment: {

    
    marginTop: 10,
  },
})
