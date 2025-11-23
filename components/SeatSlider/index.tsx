import React, { useMemo, useRef, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import images from '../../constants/images'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'

const mapStateToProps = (state: IRootState) => ({
  maxSeats: clientOrderSelectors.maxAvailableSeats(state),
  seats: clientOrderSelectors.seats(state),
})

const mapDispatchToProps = {
  setSeats: clientOrderActionCreators.setSeats,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const ITEM_WIDTH = 28
const ITEM_GAP = 8
const PER_VIEW = 5

function SeatSlider({ maxSeats, seats, setSeats }: IProps) {
  const disabled = maxSeats === null
  const prevMaxSeats = useRef(maxSeats ?? 0)
  if (maxSeats === null) maxSeats = prevMaxSeats.current
  else prevMaxSeats.current = maxSeats

  const items = useMemo(
    () => new Array(maxSeats).fill(0).map((_, idx) => idx + 1),
    [maxSeats],
  )

  const [position, setPosition] = useState(0)
  const flatListRef = useRef<FlatList<number>>(null)

  const scrollToPosition = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
    setPosition(index)
  }

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isActive = seats === item
    return (
      <TouchableOpacity
        key={item}
        style={[styles.slide, isActive && styles.slideActive, disabled && styles.slideDisabled]}
        onPress={() => setSeats(item)}
        disabled={disabled}
      >
        <Text style={[styles.slideText, isActive && styles.slideTextActive]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      {position > 0 && (
        <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={() => scrollToPosition(position - 1)}>
          <Image source={images.seatSliderArrowRight} style={[styles.arrowIcon, { transform: [{ rotate: '180deg' }] }]} />
        </TouchableOpacity>
      )}
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{ paddingHorizontal: 1 }}
      />
      {position + PER_VIEW < items.length && (
        <TouchableOpacity style={[styles.button, styles.buttonRight]} onPress={() => scrollToPosition(position + 1)}>
          <Image source={images.seatSliderArrowRight} style={styles.arrowIcon} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default connector(SeatSlider)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ITEM_WIDTH * PER_VIEW + ITEM_GAP * (PER_VIEW - 1),
    position: 'relative',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  slide: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: ITEM_GAP,
    backgroundColor: '#FFF',
  },
  slideActive: {
    borderColor: '#FF5722',
  },
  slideDisabled: {
    opacity: 0.2,
  },
  slideText: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
  },
  slideTextActive: {
    color: '#FF5722',
    fontWeight: '700',
  },
  button: {
    position: 'absolute',
    top: 0,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  buttonLeft: {
    left: -ITEM_WIDTH - 5,
  },
  buttonRight: {
    right: -ITEM_WIDTH - 5,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    opacity: 0.25,
  },
})
