import React from 'react'
import { StyleSheet, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import { formatComment } from '../../../tools/utils'
import { IOrder } from '../../../types/types'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const Comment: React.FC<IProps> = ({ order }) => {
  return (
    <View style={[styles.orderInfoComment]}>
      <OrderField
        image={images.chatIconBr}
        alt={t(TRANSLATION.CHAT)}
        title={t(TRANSLATION.COMMENT)}
        value={formatComment(order.b_comments, order.b_custom_comment, order.u_id, order.b_options)}
      />
    </View>
  )
}

export default Comment


const styles = StyleSheet.create({
  orderInfoComment: {

    
    marginTop: 10,
  },
})
