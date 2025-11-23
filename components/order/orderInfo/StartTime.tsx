import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { dateFormatDate, dateShowFormat } from '../../../tools/utils'
import { IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const StartTime: React.FC<IProps> = ({ order }) => {
  if (order.b_comments?.includes('95')) return null

  return <View style={[styles.orderInfoStartTime]}>
    <OrderField
      image={images.clockBlue}
      alt={t(TRANSLATION.CLOCK)}
      title={t(TRANSLATION.START_TIME)}
      value={order.b_start_datetime?.format(
        order.b_options?.time_is_not_important ? dateFormatDate : dateShowFormat,
      )}
    />
  </View>
}

export default StartTime


const styles = StyleSheet.create({
  orderInfoStartTime: {

    
    marginTop: 10,
  },
})
