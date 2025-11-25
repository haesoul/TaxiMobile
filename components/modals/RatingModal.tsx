import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Rating } from 'react-native-ratings'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import { t, TRANSLATION } from '../../localization'
import { CURRENCY } from '../../siteConstants'
import { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { IOrder } from '../../types/types'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isRatingModalOpen(state),
  orderID: modalsSelectors.ratingModalOrderID(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
})

const mapDispatchToProps = {
  setRatingModal: modalsActionCreators.setRatingModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
interface IProps extends ConnectedProps<typeof connector> {}

export const calculateFinalPriceFormula = (order: IOrder | null) => {
  if (!order || !order?.b_options?.pricingModel?.formula) return 'err';

  let formula = order.b_options?.pricingModel?.formula;
  let options = { ...(order.b_options?.pricingModel?.options || {}), submit_price: order.b_options?.submitPrice };

  Object.entries(options).forEach(([key, value]) => {
    formula = formula.replace(
      new RegExp(key, 'g'),
      value === '?' ? '?' : Math.trunc(Number(value ?? 0)).toString()
    );
  });

  return formula;
};


export const calculateFinalPrice = (order: IOrder | null) => {
  if (!order || !order?.b_options?.pricingModel?.formula) return 'err'
  let formula = order.b_options?.pricingModel?.formula
  let options = { ...(order.b_options?.pricingModel?.options || {}), submit_price: order.b_options?.submitPrice }
  try {
    return formula === '-' ? '-' : Math.trunc(eval(formula)).toString()
  } catch {
    return 'err'
  }
}

const RatingModal: React.FC<IProps> = ({ isOpen, orderID, selectedOrder, setRatingModal }) => {
  const [stars, setStars] = useState(0)
  const [tips, setTips] = useState('')
  const [comment, setComment] = useState('')
  const _orderID = orderID || selectedOrder
  const navigation = useNavigation()

  useEffect(() => {
    if (isOpen) {
      setStars(0)
      setTips('')
      setComment('')
    }
  }, [isOpen, _orderID])

  const onRating = () => {
    if (!_orderID) return
    API.setOrderRating(_orderID, stars)
    navigation.navigate('DriverOrder' as never)
    setRatingModal({ isOpen: false })
  }

  // TODO: сюда подгружать полный order, чтобы показывать finalPrice
  let finalPriceFormula = 'err'
  let finalPrice: string | number = 0

  return (
    <Overlay isOpen={isOpen} onClick={() => setRatingModal({ isOpen: false })}>
      <View style={[styles.modal, styles.ratingModal]}>
        <ScrollView>
          {finalPriceFormula !== 'err' && (
            <View>
              <Text>
                {t(TRANSLATION.PRICE_P)}: {CURRENCY.SIGN} {finalPrice}
              </Text>
              <Text>
                {t(TRANSLATION.ESTIMATE)}: {finalPriceFormula}
              </Text>
            </View>
          )}
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 5 }}>
            {t(TRANSLATION.RATING_HEADER)}!
          </Text>
          <Text style={{ marginBottom: 10 }}>{t(TRANSLATION.YOUR_RATING)}</Text>
          <View style={styles.rating}>
            <Rating
              startingValue={stars}
              onFinishRating={setStars}
              imageSize={40}
              style={styles.ratingStars}
            />
            <Text style={styles.ratingP}>({t(TRANSLATION.ONLY_ONE_TIME)})</Text>

            <TextInput
              placeholder={t(TRANSLATION.ADD_TAXES)}
              value={tips}
              onChangeText={setTips}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 5, padding: 8 }}
            />
            <TextInput
              placeholder={t(TRANSLATION.WRITE_COMMENT)}
              value={comment}
              onChangeText={setComment}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 5, padding: 8 }}
            />

            <TouchableOpacity
              style={styles.ratingModalRatingBtnButton}
              onPress={onRating}
              disabled={stars === 0}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                {t(TRANSLATION.RATE)}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Overlay>
  )
}

export default connector(RatingModal)
