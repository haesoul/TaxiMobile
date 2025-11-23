import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const Boxing: React.FC<IProps> = ({ order }) => {
  if (!order.b_comments?.includes('98')) return null

  return (
    <View style={styles.orderInfoBoxing}>
      <OrderField
        image={images.boxing}
        alt={t(TRANSLATION.BOXING)}
        title={t(TRANSLATION.BOXING)}
        value={t(
          order.b_options?.is_loading_needs
            ? TRANSLATION.REQUIRED
            : TRANSLATION.NOT_REQUIRED,
          { toLower: true }
        )}
      />
    </View>
  )
}

export default Boxing

const styles = StyleSheet.create({
  orderInfoBoxing: {

    
    
    marginTop: 10,
  },
})
