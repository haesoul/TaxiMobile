import React, { useRef } from 'react';
import { Animated, PanResponder, StyleProp, ViewStyle } from 'react-native';

interface SwipeProps {
  swipeHeight: number; // Максимальная высота свайпа
  speed?: number;       // Длительность анимации в мс
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SwipeView: React.FC<SwipeProps> = ({
  swipeHeight,
  speed = 300,
  children,
  containerStyle,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const currentY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        let newY = currentY.current + gestureState.dy;
        // Ограничиваем движение между 0 и -swipeHeight
        if (newY > 0) newY = 0;
        if (newY < -swipeHeight) newY = -swipeHeight;
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        let toValue = currentY.current;

        // Решаем, вверх или вниз анимировать
        if (dy > swipeHeight / 2 || vy > 0.5) {
          toValue = 0; // Свайп вниз
        } else if (dy < -swipeHeight / 2 || vy < -0.5) {
          toValue = -swipeHeight; // Свайп вверх
        }

        Animated.timing(translateY, {
          toValue,
          duration: speed,
          useNativeDriver: true,
        }).start(() => {
          currentY.current = toValue;
        });
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        containerStyle,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
