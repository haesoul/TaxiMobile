import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import OrderField from './OrderField'

const Card: React.FC = () => {
  return (
    <View style={styles.orderInfoCard}>
      <OrderField
        image={images.cash}
        alt={t(TRANSLATION.CARD)}
        title={t(TRANSLATION.PAYMENT_WAY)}
        value={t(TRANSLATION.CASH)}
      />
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
  orderInfoCard: {

    
    marginTop: 10,
  },
})
