import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import images from '../constants/images'
import { t, TRANSLATION } from '../localization'

interface IProps {
  title?: string
}

const LoadFrame: React.FC<IProps> = ({ title }) => {
  return (
    <View style={styles.loadingFrame}>

      <View style={styles.loadingFrameImage}>
        <images.fetching width={90} height={90}/>
      </View>
      <Text style={[styles.loadingFrameTitle, styles.colored]}>
        {title || t(TRANSLATION.LOADING, { toLower: true })}
      </Text>
    </View>
  )
}

export default LoadFrame


const styles = StyleSheet.create({
  loadingFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  loadingFrameTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  colored: {
    color: '#FF2400',
  },

  loadingFrameImage: {
    width: 90,
    height: 90,
  },
})
