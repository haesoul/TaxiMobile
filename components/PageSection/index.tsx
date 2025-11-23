import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

interface IProps {
  className?: string
  scrollable?: boolean
}

const PageSection: React.FC<React.PropsWithChildren<IProps>> = ({
  children,
  scrollable,
}) => {
  if (scrollable === true) {
    return (
      <ScrollView style={[styles.pageSection, styles.scrollEnabled]}>
        {children}
      </ScrollView>
    )
  }

  return (
    <View
      style={[
        styles.pageSection,
        scrollable === false && styles.scrollDisabled,
      ]}
    >
      {children}
    </View>
  )
}

export default PageSection

const styles = StyleSheet.create({
  pageSection: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  scrollEnabled: {

  },
  scrollDisabled: {

  },
})
