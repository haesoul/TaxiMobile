import store from '@/state'
import _ from 'lodash'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { IFurnitureItem, roomsFurniture } from '../../constants/furniture'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import FurnitureRow from './furnitureRow'

interface IProps {
  value: Record<number, number> | null
  room: number | null
  total: number
  listAll: boolean
  handleChange: (roomId: number, value: Record<number, number>) => void
}

const Furniture: React.FC<IProps> = ({
  value,
  room,
  total,
  listAll,
  handleChange,
}) => {
  const [chosenFurniture, setChosenFurniture] = useState<IFurnitureItem['id'] | null>(null)

  if (room === null) return null

  const onChange = (id: IFurnitureItem['id'], newValue: number) => {
    handleChange(room, { ...(value || {}), [id]: newValue })
  }

  const furnitureList = listAll
    ? (roomsFurniture.all as number[])
    : roomsFurniture[room] || []

  const furnitureChunks = _.chunk(furnitureList, 4)
  SITE_CONSTANTS.init(store.getState().global.data);
  return (
    <View style={styles.furniture}>
      <Text style={styles.inputLabel}>{t(TRANSLATION.FURNITURE_LIST)}</Text>

      {chosenFurniture !== null && (
        <View style={styles.furnitureChosen}>
          <FurnitureRow
            id={chosenFurniture}
            value={value ? value[chosenFurniture] : 0}
            onChange={onChange}
          />
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.furnitureSlider}
        contentContainerStyle={styles.furnitureSliderContent}
      >
        {furnitureChunks.map((chunk, index) => (
          <View key={index} style={styles.furnitureColumn}>
            {chunk.map(i => (
              <View key={i} style={{ marginRight: 10 }}>
                <FurnitureRow
                  id={i}
                  value={value ? value[i] : 0}
                  onChange={onChange}
                  onChoose={setChosenFurniture}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.furnitureTotal}>
        <Text>
          {t(TRANSLATION.CHOSEN)}{' '}
          <Text style={{ color: SITE_CONSTANTS.PALETTE.primary.dark }}>
            {value ? _.sum(Object.values(value)) : 0}
          </Text>{' '}
          {t(TRANSLATION.TOTAL_ITEMS)}{' '}
          <Text style={{ color: SITE_CONSTANTS.PALETTE.primary.dark }}>
            {total}
          </Text>
        </Text>
      </View>
    </View>
  )
}

const responsiveStyles = StyleSheet.create({
  furnitureRowSmall: {
    paddingHorizontal: 10,
    height: 70,
  },
  furnitureImageSmall: {
    width: 50,
    height: 30,
    maxWidth: 50,
    maxHeight: 30,
  },
  furnitureInputSmall: {
    width: 40,
  },
  furnitureNameSmallHidden: {
    display: 'none',
  },
  furnitureChangeButtonSmall: {
    width: 20,
    height: 20,
  },
  furnitureNameSmallFont: {
    fontSize: 16,
  },
})

export const styles = StyleSheet.create({
  furniture: {
    marginTop: 30,
  },
  inputLabel: {
    marginBottom: 0,
  },
  furnitureSlider: {
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  furnitureSliderContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  furnitureColumn: {
    padding: 0,
    flexDirection: 'column',
  },
  furnitureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#858585',
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 20,
    height: 70,
    borderRadius: 15,
    position: 'relative',
    marginBottom: 10,
  },
  furnitureRowActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  furnitureNameActive: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -10 }],
    fontWeight: '500',
    fontSize: 21,
  },
  furnitureView: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    overflow: 'hidden',
  },
  furnitureName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    flexShrink: 1,
  },
  furnitureNameChosen: {
    fontWeight: '700',
  },
  furnitureImage: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
  },
  furnitureInput: {
    width: 50,
    height: 40,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 10,
    textAlign: 'center',
  },
  furnitureChangeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  furnitureChangeButton: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#b00000',
    borderRadius: 999,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  furnitureChosen: {
    marginTop: 20,
  },
  glideSlides: {
    margin: 0,
    marginBottom: 60,
  },
  furnitureTotal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  furnitureTotalText: {
    fontWeight: '500',
    fontSize: 32,
  },
})

export default Furniture
