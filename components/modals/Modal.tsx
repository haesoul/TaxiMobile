import React from 'react'
import { View } from 'react-native'
import Overlay from './Overlay'
import { styles } from './STYLES'

export enum EModalStyles {
  Default,
  RedDesign,
}

interface IProps {
  overlayProps: Omit<React.ComponentProps<typeof Overlay>, 'children'>
  style?: EModalStyles
  children?: React.ReactNode
}

export default function Modal({
  overlayProps,
  style = EModalStyles.Default,
  children,
}: IProps) {

  const modalStyle = [
    styles.modal,
    style === EModalStyles.RedDesign && { /* дополнительные стили для RedDesign */ },
  ]

  return (
    <Overlay {...overlayProps}>
      <View style={modalStyle}>
        {children}
      </View>
    </Overlay>
  )
}
