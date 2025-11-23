import { ResizeMode, Video } from 'expo-av'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import images from '../../constants/images'
import SITE_CONSTANTS from '../../siteConstants'
import { modalsActionCreators } from '../../state/modals'
import { EFileType, IFile } from '../../types/types'



const mapDispatchToProps = {
  setDeleteFilesModal: modalsActionCreators.setDeleteFilesModal,
}

const connector = connect(null, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface IProps extends PropsFromRedux {
  files?: IFile[]
  slides?: React.ReactNode[]
  options?: any
  controls?: boolean
  bullets?: boolean
  className?: string
  mobileFriendly?: boolean
  headerLabel?: string
  handleDelete?: (src: IFile['src']) => any
  handleDeleteAll?: () => any
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Slider: React.FC<IProps> = ({
  files = [],
  slides = [],
  controls,
  bullets,
  headerLabel,
  handleDelete,
  handleDeleteAll,
  setDeleteFilesModal,
}) => {
  const flatListRef = useRef<FlatList<any> | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [fullScreenIndex, setFullScreenIndex] = useState<number | null>(null)

  const data = [...(files || []), ...(slides || [])]
  const total = data.length

  useEffect(() => {
    if (currentIndex >= total && total > 0) setCurrentIndex(total - 1)
  }, [total])

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0)

      setFullScreenIndex(null)
    }
  }).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  const renderFileItem = useCallback(({ item, index }: { item: any; index: number }) => {

    if (!item || (typeof item !== 'object' && typeof item !== 'string')) return null

    // basic check to detect IFile
    const isFile = !!(item && (item as IFile).type)

    if (!isFile) {
      return (
        <View style={styles.glideSlide} key={`slide-${index}`}>
          {item}
        </View>
      )
    }

    const file = item as IFile

    const onPress = () => setFullScreenIndex(prev => (prev === index ? null : index))

    if (file.type === EFileType.Image) {
      return (
        <View style={[styles.glideSlide, styles.glideSlideFile]} key={`file-${index}`}>
          <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <Image
              source={{ uri: file.src }}
              style={{ width: Math.min(300, SCREEN_WIDTH * 0.9), height: 250, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View>
      )
    }

    if (file.type === EFileType.Video) {
      return (
        <View style={[styles.glideSlide, styles.glideSlideFile]} key={`file-${index}`}>
          <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <Video
              source={{ uri: file.src }}
              useNativeControls
              style={{ width: Math.min(300, SCREEN_WIDTH * 0.9), height: 250 }}
              resizeMode={"contain" as ResizeMode}
            />
          </TouchableOpacity>
        </View>
      )
    }

    return null
  }, [])

  const goTo = (index: number) => {
    if (!flatListRef.current) return
    const target = Math.max(0, Math.min(index, total - 1))
    flatListRef.current.scrollToIndex({ index: target, animated: true })
  }

  const onPrev = () => goTo(currentIndex - 1)
  const onNext = () => goTo(currentIndex + 1)

  return (
    <View style={styles.slider}>
      {handleDelete && handleDeleteAll && (
        <TouchableOpacity
          style={styles.sliderDelete}
          onPress={() => setDeleteFilesModal({ isOpen: true })}
        >
          <Image source={images.trash} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      )}

      <Modal visible={fullScreenIndex !== null} animationType="fade" transparent={false} onRequestClose={() => setFullScreenIndex(null)}>
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
          {fullScreenIndex !== null && files[fullScreenIndex] && files[fullScreenIndex].type === EFileType.Image && (
            <TouchableOpacity style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => setFullScreenIndex(null)}>
              <Image source={{ uri: files[fullScreenIndex].src }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
            </TouchableOpacity>
          )}

          {fullScreenIndex !== null && files[fullScreenIndex] && files[fullScreenIndex].type === EFileType.Video && (
            <View style={{ flex: 1, width: '100%' }}>
              <Video
                source={{ uri: files[fullScreenIndex].src }}
                useNativeControls
                style={{ width: '100%', height: '100%' }}
                resizeMode={"contain" as ResizeMode}
                onPlaybackStatusUpdate={() => {}}
              />
              <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20 }} onPress={() => setFullScreenIndex(null)}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Закрыть</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {headerLabel && (
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{headerLabel}</Text>
          <Text style={styles.sliderCount}>
            <Text style={{ color: SITE_CONSTANTS.PALETTE.secondary.main }}>{currentIndex + 1}</Text>
            {'/'}{total}
          </Text>
          <View style={{ flex: 1 }} />
        </View>
      )}

      <View style={styles.glideArrowLeft} pointerEvents="box-none">
        <TouchableOpacity onPress={onPrev} disabled={!controls || currentIndex === 0}>
          {controls && currentIndex !== 0 && (
            <Image source={images.sliderArrow} style={{ width: 24, height: 24 }} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderFileItem}
        keyExtractor={(_, idx) => String(idx)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={styles.glideSlides}
      />

      <View style={styles.glideArrowRight} pointerEvents="box-none">
        <TouchableOpacity onPress={onNext} disabled={!controls || currentIndex === total - 1}>
          {controls && currentIndex !== total - 1 && (
            <Image source={images.sliderArrow} style={{ width: 24, height: 24, transform: [{ rotate: '180deg' }] }} />
          )}
        </TouchableOpacity>
      </View>

      {bullets && (
        <View style={styles.glideBullets}>
          {Array(total).fill(null).map((_, index) => {
            const isCurrent = index === currentIndex
            return (
              <TouchableOpacity
                key={`bullet-${index}`}
                style={[
                  styles.glideBullet,
                  // isCurrent && styles.glideBulletCurrent as any,
                  index === 0 && styles.glideBulletFirst,
                  index === total - 1 && styles.glideBulletLast,
                ]}
                onPress={() => goTo(index)}
              >
                <View style={[styles.glideBulletHr, { backgroundColor: isCurrent ? SITE_CONSTANTS.PALETTE.primary.main : SITE_CONSTANTS.PALETTE.primary.light }]} />
              </TouchableOpacity>
            )
          })}
        </View>
      )}

    </View>
  )
}

export default connector(Slider)



const styles = StyleSheet.create({
  slider: {
    width: '100%',
    backgroundColor: '#ccc5b8',
    position: 'relative',
    marginTop: 20,
  },

  sliderHeader: {
    padding: 10,
    flexDirection: 'row',
    color: 'white',
  },

  sliderLabel: {
    flex: 1,
    fontSize: 21,
    fontWeight: '500',
    color: 'white',
  },

  sliderCount: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },

  glideSlides: {
    marginTop: 45,
    marginBottom: 90,
    alignItems: 'center',
  },

  glideSlide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  glideSlideFile: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  glideBullets: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 10,
  },

  glideBullet: {
    width: 15,
    margin: 0,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 5,
  },

  glideBulletFirst: {
    marginRight: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  glideBulletLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  glideBulletHr: {
    width: '100%',
    height: 10,
    borderRadius: 10,
  },

  glideArrowLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
  },

  glideArrowRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
  },

  sliderDelete: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'transparent',
  },
})
