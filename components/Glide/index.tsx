import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle
} from 'react-native'

export interface IButtonProps extends ViewProps {
  dir: '<' | '>'
  onPress?: () => void
  key?: string | number
}

export interface IProps extends ViewProps {
  perView: number
  gap?: number
  focused?: number
  focusPaddingLeft?: number
  focusPaddingRight?: number
  slides: React.ReactNode[]
  buttons?: (IButtonProps & { key: string | number })[]
  onPositionChange?: (position: number) => void
}

export default function Glide({
  perView,
  gap = 0,
  focused = -1,
  focusPaddingLeft = 0,
  focusPaddingRight = 0,
  slides,
  buttons,
  onPositionChange = () => {},
  style,
  ...props
}: IProps) {
  const listRef = useRef<FlatList<any> | null>(null)
  const positionRef = useRef<number>(0)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const itemWidth = containerWidth
    ? (containerWidth - gap * Math.max(0, perView - 1)) / perView
    : 0
  const totalItemSize = itemWidth + gap

  const onLayoutContainer = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (w !== containerWidth) setContainerWidth(w)
  }

  const clamp = (v: number, a = 0, b = Infinity) => Math.max(a, Math.min(b, v))

  const goToIndex = (index: number) => {
    if (!listRef.current || containerWidth === 0) return
    const maxStart = Math.max(0, slides.length - perView)
    const clamped = clamp(Math.round(index), 0, maxStart)
    const offset = clamped * totalItemSize
    listRef.current.scrollToOffset({ offset, animated: true })
    positionRef.current = clamped
    onPositionChange(clamped)
  }

  const handleArrowPress = (btn: IButtonProps) => {
    if (btn.onPress) {
      btn.onPress()
      return
    }
    if (btn.dir === '<') goToIndex(positionRef.current - 1)
    else goToIndex(positionRef.current + 1)
  }

  const scrollEnabled = slides.length > perView

  useEffect(() => {
    if (containerWidth === 0) return
    goToIndex(positionRef.current)
  }, [containerWidth, perView, gap])

  useEffect(() => {
    if (focused < 0 || !containerWidth) return
    const leftIndex = focused - perView + 1 + focusPaddingLeft
    const rightIndex = focused - focusPaddingRight
    let goTo = positionRef.current
    if (positionRef.current < leftIndex) goTo = leftIndex
    else if (positionRef.current > rightIndex) goTo = rightIndex
    goTo = clamp(goTo, 0, Math.max(0, slides.length - perView))
    if (goTo !== positionRef.current) goToIndex(goTo)
  }, [focused, focusPaddingLeft, focusPaddingRight])

  useEffect(() => {

    if (slides.length <= perView) {
      positionRef.current = 0
      onPositionChange(0)
      if (listRef.current && containerWidth) listRef.current.scrollToOffset({ offset: 0, animated: false })
    }
  }, [slides, perView])

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!itemWidth) return
    const offset = e.nativeEvent.contentOffset.x
    const idx = Math.round(offset / totalItemSize)
    positionRef.current = clamp(idx, 0, Math.max(0, slides.length - perView))
    onPositionChange(positionRef.current)
  }

  const renderItem = ({ item, index }: { item: React.ReactNode; index: number }) => {
    const isLast = index === slides.length - 1
    const itemStyle: ViewStyle = {
      width: itemWidth || undefined,
      marginRight: isLast ? 0 : gap,
    }

    return (
      <View style={[styles.glideSlide, itemStyle]}>
        {React.isValidElement(item) ? item : <View>{item as any}</View>}
      </View>
    )
  }

  return (
    <View onLayout={onLayoutContainer} style={[styles.glide, style]} {...props}>
      <View style={styles.glideTrack}>
        <FlatList
          ref={ref => {listRef.current = ref;}}
          data={slides}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String((slides[i] as any)?.key ?? i)}
          renderItem={renderItem}
          scrollEnabled={scrollEnabled}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, index) => ({ length: totalItemSize, offset: totalItemSize * index, index })}
          contentContainerStyle={[styles.glideSlides, { paddingRight: 0 }]}
        />
      </View>

      {buttons && (
        <View style={styles.glideArrows}>
          {buttons.map(btn => (
            <TouchableOpacity
              key={String(btn.key)}
              onPress={() => handleArrowPress(btn)}
              {...(btn as any)}
            >
              {btn.children ?? <Text>{btn.dir}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({

  glide: {
    margin: 0
  },
  glideTrack: {

  },
  glideSlides: {

    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  glideSlide: {

  },
  glideArrows: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
})
