import React, { ReactElement, useCallback, useMemo } from 'react'
import {
  GestureResponderEvent,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { IRootState } from '../../state'
import { modalsActionCreators } from '../../state/modals'
import { userSelectors } from '../../state/user'
import { gradient } from '../../tools/theme'
import { getStatusClassName } from '../../tools/utils'
import { EColorTypes, EStatuses } from '../../types/types'
import SmartImage from '../SmartImage'


const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  setLoginModal: modalsActionCreators.setLoginModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export enum EButtonShapes {
  Default,
  Flat,
}

export enum EButtonStyles {
  Default,
  RedDesign,
}

interface IProps extends Omit<TouchableOpacityProps, 'style' | 'onPress'>, ConnectedProps<typeof connector> {
  wrapperProps?: ViewProps,
  imageProps?: Omit<ImageProps, 'source'> & { source: any },
  fixedSize?: boolean,
  shape?: EButtonShapes,
  buttonStyle?: any,
  skipHandler?: boolean,
  text?: string,
  svg?: ReactElement,
  label?: string,
  status?: EStatuses,
  colorType?: EColorTypes,
  checkLogin?: boolean,
  onPress?: (event: GestureResponderEvent) => void,
  style?: any;
  type?: string;
  textStyle?: any;
}

function Button({
  wrapperProps = {},
  imageProps,
  fixedSize = true,
  shape = EButtonShapes.Default,
  buttonStyle = EButtonStyles.Default,
  skipHandler,
  text,
  svg,
  label,
  status = EStatuses.Default,
  user,
  setLoginModal,
  colorType = EColorTypes.Default,
  checkLogin = true,
  style,
  disabled,
  type,
  onPress,
  textStyle,
  ...restProps
}: IProps) {

  const getButtonStyle = useMemo(() => {
    let styleArray: any[] = [styles.button];

    if (fixedSize) styleArray.push(styles['button--size--fixed']);
    if (shape === EButtonShapes.Flat) styleArray.push(styles['button--shape--flat']);
    if (buttonStyle === EButtonStyles.RedDesign) styleArray.push(styles['button--style--red-design']);
    if (colorType === EColorTypes.Accent) styleArray.push(styles['button--accent']);
    if (disabled) styleArray.push(styles.disabled);

    const baseStyle = buttonStyle === EButtonStyles.Default ?
      { backgroundColor: gradient() } : 
      undefined;

    return [...styleArray, baseStyle, style];
  }, [fixedSize, shape, buttonStyle, colorType, disabled, style]);

  const getTextStyle = useMemo(() => {
    return textStyle;
  }, []);

  const handleButtonPress = useCallback((
    e: GestureResponderEvent,
  ): void => {
    if (skipHandler) return onPress && onPress(e);


    const loggedIn = !checkLogin || user;

    if (loggedIn) {
      if (onPress) onPress(e);
    } else {
      setLoginModal(true);
    }
  }, [
    onPress,
    skipHandler, checkLogin, user, setLoginModal,
  ]);

  const labelStyle = useMemo(() => {
      let styleArray: any[] = [styles.button__label];
      const statusClass = getStatusClassName(status);
      if (statusClass === 'fail') styleArray.push(styles['button__label--fail']);
      if (statusClass === 'success') styleArray.push(styles['button__label--success']);
      return styleArray;
  }, [status]);


  return (
    <View style={wrapperProps.style ? [styles.button__wrapper, wrapperProps.style] : styles.button__wrapper} {...wrapperProps}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        style={getButtonStyle}
        onPress={handleButtonPress}
        {...restProps}
      >
        {imageProps && imageProps.source && (
          <SmartImage
            alt={text}
            {...imageProps}
            style={imageProps.style ? [styles.button__icon, imageProps.style] : styles.button__icon}
          />
        )}
        {text && <Text style={getTextStyle}>{text}</Text>}
        {svg}
      </TouchableOpacity>
    </View>
  )
}

export default connector(Button)




const Theme = {
  accent: '#ff8008',
  white: '#ffffff',
}

const styles = StyleSheet.create({

  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: '100%',
    fontSize: 13,
    color: Theme.white,
    backgroundColor: 'grey',
    fontWeight: '600',

    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  disabled: {
    opacity: 0.5, 
  },

  'button--size--fixed': {
    height: 40,
  },

  'button--shape--flat': {
    borderRadius: 0,
  },

  'button--style--red-design': {
    backgroundColor: Theme.accent,
  },

  'button--accent': {

    backgroundColor: '#ff8008',
  },

  button__wrapper: {
    flexDirection: 'column',
    width: '100%',
  },

  button__label: {
    marginBottom: 4,
  },

  'button__label--fail': {
    color: 'red',
  },

  'button__label--success': {
    color: 'green',
  },

  button__icon: {
    width: 30,
    height: 30,
    marginRight: 5,
    resizeMode: 'contain',
  },
})