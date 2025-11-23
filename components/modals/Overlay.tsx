import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { styles } from './STYLES'

interface IProps {
  isOpen: boolean
  onClick?: () => any
  children: React.ReactNode
}

const Overlay: React.FC<IProps> = ({ isOpen, onClick, children }) => {
  if (!isOpen) return null

  return (
    <View style={[styles.overlayWrapper, styles.overlayWrapperActive]}>
      <TouchableWithoutFeedback onPress={onClick}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {children}
    </View>
  )
}

export default Overlay
