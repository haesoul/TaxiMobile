import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const BigSize: React.FC<IProps> = ({ order }) => {
  if (!order.b_options?.object) return null

  const _value = t(
    order.b_options.is_big_size
      ? TRANSLATION.YES
      : TRANSLATION.NO
  )

  return (
    <View style={styles.orderInfoBigSize}>
      <OrderField
        image={images.bigSize}
        alt="is big size"
        title={t(TRANSLATION.LARGE_PACKAGE)}
        value={_value}
      />
    </View>
  )
}

export default BigSize

const styles = StyleSheet.create({
  orderInfoBigSize: {


    
    marginTop: 10,
  },
})
