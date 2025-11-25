import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IOrder } from '../../../types/types'
import Attachments from './Attachments'
import BigSize from './BigSize'
import BigTruckCargo from './BigTruckCargo'
import BigTruckCargoWeight from './BigTruckCargoWeight'
import BigTruckCars from './BigTruckCars'
import BigTruckServices from './BigTruckServices'
import Boxing from './Boxing'
import Comment from './Comment'
import DateTimeInterval from './DateTimeInterval'
import Delivery from './Delivery'
import Elevator from './Elevator'
import Payment from './Payment'
import OrderPhone from './Phone'
import Rooms from './Rooms'
import Size from './Size'
import StartTime from './StartTime'

interface IProps {
  order?: IOrder | null
}

const OrderInfo: React.FC<IProps> = ({ order }) => {
  if (!order) return <View style={[styles.orderInfo]}></View>

  return <View style={[styles.orderInfo]}>
    <OrderPhone order={order} />
    <Rooms order={order} />
    <Attachments order={order} />
    <Elevator order={order} />
    <StartTime order={order} />
    <Delivery order={order} />
    <BigSize order={order} />
    <Boxing order={order} />
    <Payment order={order} />
    <Comment order={order} />
    <BigTruckCars order={order} />
    <DateTimeInterval order={order} />
    <BigTruckCargo order={order} />
    <Size order={order} />
    <BigTruckCargoWeight order={order} />
    <BigTruckServices order={order} />
  </View>
}

export default OrderInfo



const styles = StyleSheet.create({
  orderInfo: {

    
    marginTop: 10,
  },
})
