import React from 'react'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { gradient } from '../../tools/theme'

export enum ECompareVariants {
  Greater,
  Equal,
  Less,
}

interface IProps {
  value: ECompareVariants;
  onChange: (value: ECompareVariants) => any
}

const resolveSelectedBackground = (): string => {
  try {
    const g = gradient?.()
    if (!g || typeof g !== 'string') return '#2b8cff'

    const simpleColorMatch = g.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/)
    if (simpleColorMatch) return simpleColorMatch[0]

    const firstColor = g.match(/linear-gradient\([^,]+,\s*([^,\)]+)/)
    if (firstColor && firstColor[1]) return firstColor[1].trim()

    return '#2b8cff'
  } catch {
    return '#2b8cff'
  }
}

const selectedBackground = resolveSelectedBackground()

const CompareVariants: React.FC<IProps> = ({ value, onChange }) => {
  const variants: ECompareVariants[] = [
    ECompareVariants.Greater,
    ECompareVariants.Equal,
    ECompareVariants.Less,
  ]

  const getImageComponent = (variant: ECompareVariants) => {
    switch (variant) {
      case ECompareVariants.Equal:
        return images.equal
      case ECompareVariants.Less:
        return images.less
      case ECompareVariants.Greater:
      default:
        return images.more
    }
  }

  const getAlt = (variant: ECompareVariants) => {
    switch (variant) {
      case ECompareVariants.Equal: return t(TRANSLATION.EQUAL)
      case ECompareVariants.Less: return t(TRANSLATION.LESS)
      case ECompareVariants.Greater: return t(TRANSLATION.MORE)
    }
  }

  return (
    <View style={styles.container}>
      {variants.map(variant => {
        const selected = value === variant
        const ImageComponent = getImageComponent(variant)

        return (
          <Pressable
            key={variant}
            onPress={() => onChange(variant)}
            style={[
              styles.item,
              selected && { backgroundColor: selectedBackground } as ViewStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel={getAlt(variant)}
          >
            <View>
              <ImageComponent width={24} height={24} />
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  item: {
    width: 34,
    height: 34,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
})

export default CompareVariants
