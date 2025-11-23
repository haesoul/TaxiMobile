import store from '@/state'
import React, { useEffect, useState } from 'react'
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import furniture, { IFurnitureItem } from '../../../constants/furniture'
import images from '../../../constants/images'
import { t } from '../../../localization'
import SITE_CONSTANTS from '../../../siteConstants'
import { gradient } from '../../../tools/theme'

interface IProps {
  id: IFurnitureItem['id']
  value: number | null
  onChange: (id: IFurnitureItem['id'], newValue: number) => any
  onChoose?: (id: IFurnitureItem['id']) => any
}

const FurnitureRow: React.FC<IProps> = ({ id, value, onChange, onChoose }) => {
  const [hoverActive, setHoverActive] = useState(false)
  const [clickActive, setClickActive] = useState(false)
  const [focusActive, setFocusActive] = useState(false)

  // В RN нет window.innerWidth, поэтому можно удалить проверку по ширине или передавать через props
  const active = clickActive || hoverActive || focusActive
  const item = furniture?.find(i => i.id === id)

  useEffect(() => {
    if ((clickActive || focusActive) && onChoose) onChoose(id)
  }, [clickActive, focusActive])

  if (!item) return null

  const handleIncrement = () => onChange(item.id, Math.min((value || 0) + 1, 99))
  const handleDecrement = () => onChange(item.id, Math.max((value || 0) - 1, 0))
  const handleChange = (text: string) => onChange(item.id, parseInt(text) || 0)
  SITE_CONSTANTS.init(store.getState().global.data);
  return (
    <Pressable
      onPress={() => {
        setClickActive(true)
        setTimeout(() => setClickActive(false), 5000)
      }}
      onPressIn={() => setHoverActive(true)}
      onPressOut={() => setHoverActive(false)}
      style={[
        styles.furnitureRow,
        (!onChoose || active) && styles.furnitureRowActive,
        value && !active
          ? { borderWidth: 2, borderColor: SITE_CONSTANTS.PALETTE.secondary.main }
          : undefined,
        !onChoose || active
          ? { backgroundColor: gradient(SITE_CONSTANTS.PALETTE.secondary.main, SITE_CONSTANTS.PALETTE.secondary.light) }
          : undefined,
      ]}
    >
      <View style={styles.furnitureView}>
        <Image source={item.image as any} style={styles.furnitureImage} />
        <Text style={[styles.furnitureName, !onChoose && styles.furnitureNameChosen]}>
          {t(item.label)}
        </Text>
      </View>

      <View style={styles.furnitureChangeWrapper}>
        {!onChoose && (
          <Pressable onPress={handleDecrement}>
            <Image source={images.minusIcon as any} style={styles.furnitureChangeButton} />
          </Pressable>
        )}

        <TextInput
          style={styles.furnitureInput}
          keyboardType="numeric"
          value={value !== null ? String(value) : ''}
          onChangeText={handleChange}
          onFocus={() => setFocusActive(true)}
          onBlur={() => setFocusActive(false)}
        />

        {!onChoose && (
          <Pressable onPress={handleIncrement}>
            <Image source={images.plusIcon as any} style={styles.furnitureChangeButton} />
          </Pressable>
        )}
      </View>
    </Pressable>
  )
}

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

  furnitureColumn: {
    padding: 0,
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

  furnitureView: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    overflow: 'hidden',
  },

  furnitureName: {
    marginLeft: 10,
    fontSize: 16,
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

  furnitureNameActive: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -10 }],
    display: 'flex',
    fontWeight: '500',
    fontSize: 21,
  },
})
export default FurnitureRow
