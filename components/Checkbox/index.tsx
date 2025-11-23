import store from '@/state'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  AccessibilityState,
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import SITE_CONSTANTS from '../../siteConstants'

export enum ECheckboxStyles {
  Default,
  RedDesign,
}

export interface IWebLikeChangeEvent {
  target: {
    checked: boolean
    value?: any
    name?: string
  }
}

interface IProps {
  label: string
  wrapperClassName?: string
  wrapperAdditionalClassName?: string
  checkboxStyle?: ECheckboxStyles

  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  name?: string
  value?: any
  id?: string

  onChange?: (e: IWebLikeChangeEvent) => void
  onValueChange?: (checked: boolean) => void
  onPress?: (e?: GestureResponderEvent) => void

  style?: StyleProp<ViewStyle>
  boxStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>

}

const Checkbox = forwardRef((props: IProps, ref) => {
  const {
    label,
    checkboxStyle = ECheckboxStyles.Default,
    checked: controlledChecked,
    defaultChecked,
    disabled,
    name,
    value,
    id,
    onChange,
    onValueChange,
    onPress,
    style,
    boxStyle,
    labelStyle,
  } = props

  const innerIdRef = useRef(id ?? `rn-checkbox-${Math.random().toString(36).slice(2)}`)
  const idFinal = innerIdRef.current

  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState<boolean>(() => !!defaultChecked)
  const checked = isControlled ? !!controlledChecked : internalChecked

  // focus/pressed state to emulate :focus/:hover
  const [focused, setFocused] = useState(false)
  const [pressed, setPressed] = useState(false)

  useImperativeHandle(ref, () => ({
    toggle: () => {
      handleToggle()
    },
    getChecked: () => checked,
  }), [checked])

  const callOnChange = (nextChecked: boolean) => {
    if (typeof onValueChange === 'function') {
      onValueChange(nextChecked)
    }

    if (typeof onChange === 'function') {
      const syntheticEvent: IWebLikeChangeEvent = {
        target: {
          checked: nextChecked,
          value,
          name,
        },
      }
      try {
        onChange(syntheticEvent)
      } catch (err) {
        console.error('Checkbox onChange handler error:', err)
      }
    }
  }

  const handleToggle = (e?: GestureResponderEvent) => {
    if (disabled) return

    const next = !checked

    if (!isControlled) {
      setInternalChecked(next)
    }

    callOnChange(next)

    if (onPress) {
      try { onPress(e) } catch (err) { console.error(err) }
    }
  }

  useEffect(() => {
    if (!isControlled && defaultChecked !== undefined) {
      setInternalChecked(!!defaultChecked)
    }

  }, [defaultChecked])

  const accessibilityState: AccessibilityState = { disabled: !!disabled, checked: !!checked }

  SITE_CONSTANTS.init(store.getState().global.data);
  const BORDER_DEFAULT = '#1D2A50'
  const CHECK_BG = '#1fdc00'
  const CHECK_BORDER = '#1c8c00'
  const ACCENT = (SITE_CONSTANTS as any)?.PALETTE?.accent ?? '#c00'
  const PRIMARY_DARK = (SITE_CONSTANTS as any)?.PALETTE?.primary?.dark ?? BORDER_DEFAULT


  const isRed = checkboxStyle === ECheckboxStyles.RedDesign

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={accessibilityState}
      testID={idFinal}
      onPress={handleToggle}
      disabled={!!disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.wrapper,
        style,
        isRed && styles.redWrapper,
        disabled && styles.disabledWrapper,
      ]}
    >

      <View
        style={[
          styles.boxBase,
          isRed ? styles.boxRed : styles.boxDefault,
          isRed ? styles.boxRedBefore : styles.boxDefaultBefore,
          checked && (isRed ? { backgroundColor: ACCENT, borderColor: ACCENT } : { backgroundColor: CHECK_BG, borderColor: CHECK_BORDER }),
          disabled && styles.boxDisabled,
          (focused || pressed) && styles.boxFocused,
          boxStyle,
        ]}
      >
        {checked ? (
          isRed ? (

            <Text style={[styles.checkMark, isRed && styles.checkMarkRed]}>✓</Text>
          ) : (
            <Text style={styles.checkMark}>✓</Text>
          )
        ) : null}
      </View>


      <Pressable onPress={handleToggle} disabled={!!disabled} hitSlop={8} accessibilityRole="button">
        <Text
          style={[
            styles.label,
            isRed && styles.labelRed,
            checked && styles.labelChecked,
            disabled && styles.labelDisabled,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  boxBase: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  boxDefaultBefore: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#1D2A50',
  },
  boxDefault: {

  },

  redWrapper: {
    marginBottom: 0,
  },
  boxRedBefore: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: (SITE_CONSTANTS as any)?.PALETTE?.accent ?? '#c00',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  boxRed: {

  },



  checkMark: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  checkMarkRed: {

    color: '#ffffff',
  },

  label: {
    fontSize: 14,
    color: '#000',
  },
  labelRed: {
    fontSize: 13,
  },
  labelChecked: {
    fontWeight: '700',
  },
  labelDisabled: {
    color: '#999',
  },


  disabledWrapper: {
    opacity: 0.6,
  },
  boxDisabled: {
    opacity: 0.6,
  },


  boxFocused: {

    borderColor: 'rgb(59,153,252)',


    borderWidth: 3,
  },
})

export default Checkbox
