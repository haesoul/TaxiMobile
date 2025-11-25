import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import images from '../constants/images'

interface IProps {
  title?: string
  image?: any
  renderImage?: () => any
}

const LoadFrame: React.FC<IProps> = ({
  title,
  image = images.error,
  renderImage
}) => {
  return (
    <View style={styles.loadingFrame}>
      {!!title && <Text style={styles.loadingFrameTitle}>{title}</Text>}

      {renderImage
        ? renderImage()
        : (
          // <Image
          //   source={image}
          //   style={styles.loadingFrameImage}
          //   accessibilityLabel={t(TRANSLATION.ERROR)}
          //   resizeMode="contain"
          // />
          <View style={styles.loadingFrameImage}>
            <images.error width={100} height={100}/>
          </View>
        )
      }
    </View>
  )
}

export default LoadFrame


const styles = StyleSheet.create({
  loadingFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  loadingFrameTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  loadingFrameImage: {
    marginTop: 20,
    width: 100,
    height: 100,
  }
})
