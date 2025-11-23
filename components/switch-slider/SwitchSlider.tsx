import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface IButton {
  label: string;
}

interface IProps {
  value?: boolean;
  onValueChanged: (value: boolean) => any;
  isVertical?: boolean;
  startButton?: IButton;
  endButton?: IButton;
  primaryMain: string;
  primaryDark: string;

}

const SwitchSlider: React.FC<IProps> = ({
  value = false,
  onValueChanged,
  isVertical,
  startButton,
  endButton,
  primaryMain,
  primaryDark,
}) => {
  const animatedPos = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedPos, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedPos.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 30],
  });

  const translateY = animatedPos.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 30],
  });

  return (
    <View style={[styles.switcherWrapper, isVertical && styles.switcherWrapperVertical]}>
      {startButton && (
        <Pressable onPress={() => onValueChanged(false)} style={styles.switcherButton}>
          <Text>{startButton.label}</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => onValueChanged(!value)}
        style={styles.switcherSlider}
      >
        <View
          style={[
            styles.switcherSliderCircle,
            value && { backgroundColor: primaryMain },
            value && {
              shadowColor: primaryDark,
              shadowOpacity: 0.6,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          <Animated.View
            style={[
              styles.sliderKnob,
              isVertical ? { transform: [{ translateY }] } : { transform: [{ translateX }] },
            ]}
          />
        </View>
      </Pressable>

      {endButton && (
        <Pressable onPress={() => onValueChanged(true)} style={styles.switcherButton}>
          <Text>{endButton.label}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  switcherWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  switcherWrapperVertical: {
    flexDirection: 'column',
  },

  switcherSlider: {
    width: 60,
    height: 34,
    justifyContent: 'center',
  },

  switcherSliderCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    backgroundColor: '#ccc',
    justifyContent: 'center',
  },

  sliderKnob: {
    position: 'absolute',
    height: 26,
    width: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    left: 4,
    top: 4,
  },

  switcherButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
});

export default SwitchSlider;
