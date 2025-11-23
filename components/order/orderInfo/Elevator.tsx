import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const Elevator: React.FC<IProps> = ({ order }) => {
  return order.b_options?.elevator?.elevator ?
    <View style={[styles.orderInfoElevator]}>
      <OrderField
        image={images.elevator}
        alt={t(TRANSLATION.ELEVATOR)}
        title={t(TRANSLATION.ELEVATOR)}
        value={
          `${
            t(TRANSLATION.YES, { toLower: true })
          }
          `
        }
      />
    </View> :
    null
}

export default Elevator


const styles = StyleSheet.create({
  orderInfoElevator: {

    
    marginTop: 10,
  },
})
