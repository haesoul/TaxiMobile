import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { formatCurrency, getPayment } from '../../tools/utils'
import { EInputStyles, EInputTypes } from '../Input'

const mapStateToProps = (state: IRootState) => ({
  from: clientOrderSelectors.from(state),
  to: clientOrderSelectors.to(state),
  time: clientOrderSelectors.time(state),
  carClass: clientOrderSelectors.carClass(state),
  customerPrice: clientOrderSelectors.customerPrice(state),
})

const mapDispatchToProps = {
  setCustomerPrice: clientOrderActionCreators.setCustomerPrice,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  className?: string
}

function PriceInput({
  from,
  to,
  time,
  carClass,
  customerPrice,
  setCustomerPrice,
}: IProps) {
  const { value: payment } = useMemo(
    () =>
      getPayment(
        null,
        [from ?? {}, to ?? {}],
        undefined,
        time === 'now' ? moment() : time,
        carClass
      ),
    [from, to, time, carClass]
  )

  const [active, setActive] = useState(0)

  return (
    <View style={styles.priceInput}>
      <PriceInputItem
        disabled
        active={active === 0}
        setActive={() => setActive(0)}
        inputProps={{
          value: `${
            t(TRANSLATION.COST)
          }: ${typeof payment === 'number' ? formatCurrency(payment) : payment}`,
        }}
        fieldWrapperStyle={[
          styles.priceInputSegment,
          active === 0 && styles.priceInputSegmentActive,
        ]}
        style={EInputStyles.RedDesign}
      />

      {new Array(3).fill(0).map((_, index) => (
        <PriceInputItem
          key={index + 1}
          active={active === index + 1}
          setActive={() => setActive(index + 1)}
          inputProps={{
            value: undefined,
            placeholder: t(TRANSLATION.CUSTOMER_PRICE),
            keyboardType: 'numeric',
          }}
          fieldWrapperStyle={[
            styles.priceInputSegment,
            active === index + 1 && styles.priceInputSegmentActive,
          ]}
          inputType={EInputTypes.Number}
          style={EInputStyles.RedDesign}
        />
      ))}
    </View>
  )
}

export default connector(PriceInput)

interface IItemProps {
  disabled?: boolean
  active: boolean
  setActive: () => void
  inputProps: any
  inputType?: EInputTypes
  style?: any
  fieldWrapperStyle?: any
}

function PriceInputItem({
  disabled = false,
  active,
  setActive,
  inputProps,
  fieldWrapperStyle,
}: IItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.priceInputContainer,
        disabled && styles.priceInputContainerDisabled,
        active && styles.priceInputContainerActive,
        fieldWrapperStyle,
      ]}
      onPress={setActive}
      activeOpacity={0.8}
    >
      <TextInput
        style={styles.input}
        editable={!disabled}
        {...inputProps}
      />

      <View style={styles.priceInputIcon}>
        <images.dollarIcon width={16} height={16}/>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  priceInputContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    columnGap: 12,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E7E7E7',
  },
  priceInputContainerDisabled: {
    backgroundColor: '#EFEFEF',
  },
  priceInputContainerActive: {
    flex: 1,
    width: '100%',
    paddingRight: 15,
  },
  priceInputSegment: {
    display: 'none',
  },
  priceInputSegmentActive: {
    display: 'flex',
    width: '100%',
  },
  priceInputIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
})
