import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ColorValue,
  GestureResponderEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { gradient } from '../../tools/theme'

/**
 * Компонент API максимально совпадает с веб-версией:
 * - checked?: boolean  (контролируемый)
 * - defaultChecked?: boolean (неконтролируемый)
 * - onChange?: (e) => void  (симулируем объект { target: { checked } })
 * - onClick?: (e) => void
 * - onPress?: (e) => void
 * - textLabel?: string
 * - id?, className?, disabled?, name?, value? – просто пропсы, не используются внутри, но принимаются
 *
 * Также добавлен index сигнатура, чтобы можно было передать другие веб-like пропсы без ошибок типов.
 */
interface IProps {
  textLabel?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (e: { target: { checked: boolean } }) => void
  onClick?: (e: GestureResponderEvent) => void
  onPress?: (e: GestureResponderEvent) => void
  disabled?: boolean
  id?: string
  className?: string
  style?: StyleProp<ViewStyle>
  // allow other web-like props without TS error
  [key: string]: any
}

const RadioCheckbox: React.FC<IProps> = ({
  textLabel,
  checked,
  defaultChecked = false,
  onChange,
  onClick,
  onPress,
  disabled = false,
  style,
  ...rest
}) => {

  const isControlled = typeof checked !== 'undefined'
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked)

  useEffect(() => {
    if (isControlled) {

      setInternalChecked(Boolean(checked))
    }
  }, [checked, isControlled])

  const isChecked = isControlled ? Boolean(checked) : internalChecked


  const id = useMemo(() => Math.random().toString().slice(2), [])


  const colors = useMemo(() => {
    const parts = gradient().split(',').map(c => c.trim())

    if (parts.length === 1) return [parts[0], parts[0]] as [ColorValue, ColorValue]
    return parts as [ColorValue, ColorValue, ...ColorValue[]]
  }, [])
  
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return

    const newChecked = !isChecked

    if (!isControlled) {
      setInternalChecked(newChecked)
    }

 
    if (onChange) {
      try {
        onChange({ target: { checked: newChecked } })
      } catch {

      }
    }

    if (onClick) {
      try {
        onClick(e)
      } catch {}
    }
    if (onPress) {
      try {
        onPress(e)
      } catch {}
    }
  }

  return (
    <TouchableOpacity
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.radioWrapper, style]}

      testID={rest.testID || `radio-${id}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore allow passing extra props without explicit typing in RN
      {...rest}
    >
      <View style={[styles.radioInputWrapper, disabled && styles.radioDisabled]}>
        {isChecked ? (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.radioLabelChecked}
          />
        ) : (
          <View style={styles.radioLabel} />
        )}
      </View>

      {textLabel ? (
        <Text

          style={[styles.radioTextLabel, disabled && styles.textDisabled]}
        >
          {textLabel}
        </Text>
      ) : null}
    </TouchableOpacity>
  )
}

export default RadioCheckbox

const styles = StyleSheet.create({
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  radioInputWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#828282',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: 6,
  },
  radioLabel: {
    width: 0,
    height: 0,
  },
  radioLabelChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioTextLabel: {
    marginLeft: 0,

    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : ({} as any)),
  },
  radioDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    opacity: 0.6,
  },
})
