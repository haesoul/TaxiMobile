import React, { useEffect, useRef, useState } from 'react'
// import cn from 'classnames'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { EBookingLocationKinds } from '../../types/types'


const mapStateToProps = (state: IRootState) => ({
  locationClasses: clientOrderSelectors.availableLocationClasses(state),
  locationClass: clientOrderSelectors.locationClass(state),
})

const mapDispatchToProps = {
  setLocationClass: clientOrderActionCreators.setLocationClass,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

export default function BoundaryButtons({
  locationClasses,
  locationClass,
  setLocationClass,
}: IProps) {
  const disabled = locationClasses === null;
  const prevLocationClasses = useRef(locationClasses ?? []);
  if (locationClasses === null) locationClasses = prevLocationClasses.current;
  else prevLocationClasses.current = locationClasses;

  const widthAnimations = useRef<Record<string, Animated.Value>>({}).current;
  const [textWidths, setTextWidths] = useState<Record<string, number>>({});

  locationClasses?.forEach(({ id }) => {
    if (!widthAnimations[id]) {
      widthAnimations[id] = new Animated.Value(id === locationClass ? 40 : 40);
    }
  });

  useEffect(() => {
    locationClasses?.forEach(({ id }) => {
      const targetWidth = id === locationClass ? (textWidths[id] ?? 0) + 40 : 40;
      Animated.timing(widthAnimations[id], {
        toValue: targetWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [locationClass, textWidths]);

  const handleTextLayout = (id: string, width: number) => {
    setTextWidths(prev => ({ ...prev, [id]: width }));
  };

  return (
    <View style={[styles.boundaryButtons, disabled && styles.boundaryButtonsDisabled]}>
      {locationClasses?.map(({ id, kind }) => {
        const selected = id === locationClass;
        return (
          <Animated.View
            key={id}
            style={[
              styles.item,
              { width: widthAnimations[id], maxWidth: 200 },
              selected && styles.itemActive,
              disabled && styles.itemDisabled,
            ]}
          >
            <TouchableOpacity
              disabled={disabled}
              style={styles.touchableContent}
              onPress={() => setLocationClass(id)}
            >
              <View style={styles.icon}>
                {{
                  [EBookingLocationKinds.City]: <CityIcon active={selected} />,
                  [EBookingLocationKinds.Intercity]: <IntercityIcon active={selected} />,
                  [EBookingLocationKinds.Location]: <LocationIcon active={selected} />,
                }[kind]}
              </View>

              {selected && (
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  onLayout={e => handleTextLayout(id, e.nativeEvent.layout.width)}
                >
                  {t(TRANSLATION.BOOKING_LOCATION_CLASSES[id])}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}


// export default connector(BoundaryButtons)

export function CityIcon({ active }: { active: boolean }) {
  const color = active ? 'white' : '#BDBDBD';

  return (
    <Svg width={18} height={22} viewBox="0 0 18 22" fill="none">
      <Path
        d="M15.222 16C16.617 17.988 17.284 19.047 16.887 19.9C16.847 19.9853 16.8003 20.0677 16.747 20.147C16.172 21 14.687 21 11.717 21H6.28299C3.31299 21 1.82899 21 1.25399 20.147C1.20153 20.0681 1.15475 19.9855 1.11399 19.9C0.716991 19.048 1.38399 17.988 2.77899 16M11.5 8C11.5 8.66304 11.2366 9.29893 10.7678 9.76777C10.2989 10.2366 9.66303 10.5 8.99999 10.5C8.33695 10.5 7.70107 10.2366 7.23222 9.76777C6.76338 9.29893 6.49999 8.66304 6.49999 8C6.49999 7.33696 6.76338 6.70107 7.23222 6.23223C7.70107 5.76339 8.33695 5.5 8.99999 5.5C9.66303 5.5 10.2989 5.76339 10.7678 6.23223C11.2366 6.70107 11.5 7.33696 11.5 8Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.257 16.494C9.91922 16.819 9.46871 17.0005 8.99999 17.0005C8.53127 17.0005 8.08076 16.819 7.74299 16.494C4.65399 13.501 0.514992 10.158 2.53299 5.304C3.62599 2.679 6.24599 1 8.99999 1C11.754 1 14.375 2.68 15.467 5.304C17.483 10.151 13.354 13.511 10.257 16.494Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IntercityIcon({ active }: { active: boolean }) {
  const color = active ? 'white' : '#BDBDBD';

  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M2 21V11C2 9.114 2 8.172 2.586 7.586C3.172 7 4.114 7 6 7C7.886 7 8.828 7 9.414 7.586C10 8.172 10 9.114 10 11"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M16 21V15C16 13.114 16 12.172 15.414 11.586C14.828 11 13.886 11 12 11H10C8.114 11 7.172 11 6.586 11.586C6 12.172 6 13.114 6 15V21"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M20 20.9999V6.77193C20 5.43193 20 4.76093 19.644 4.24693C19.288 3.73293 18.66 3.49693 17.404 3.02693C14.949 2.10593 13.722 1.64593 12.861 2.24193C12 2.83993 12 4.14993 12 6.77193V10.9999"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M3 7V5.5C3 4.557 3 4.086 3.293 3.793C3.586 3.5 4.057 3.5 5 3.5H7C7.943 3.5 8.414 3.5 8.707 3.793C9 4.086 9 4.557 9 5.5V7M6 3V1M21 21H1M9 14H13M9 17H13"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function LocationIcon({ active }: { active: boolean }) {
  const color = active ? 'white' : '#BDBDBD';

  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M20.121 20.121C21 19.243 21 17.828 21 15C21 12.172 21 10.757 20.121 9.879M20.121 20.121C19.243 21 17.828 21 15 21H7C4.172 21 2.757 21 1.879 20.121M20.121 9.879C19.243 9 17.828 9 15 9H7C4.172 9 2.757 9 1.879 9.879M1.879 9.879C1 10.757 1 12.172 1 15C1 17.828 1 19.243 1.879 20.121"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M20 20L2 10M2.5 20L11 15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16 7C17.6569 7 19 5.65685 19 4C19 2.34315 17.6569 1 16 1C14.3431 1 13 2.34315 13 4C13 5.65685 14.3431 7 16 7Z"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M16 12V7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}


export const RED = '#FF2400';

const styles = StyleSheet.create({
  boundaryButtons: {
    height: 40,
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
    marginLeft: 16,
  },
  boundaryButtonsDisabled: {
    opacity: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 40,
    borderRadius: 16,
    backgroundColor: '#E7E7E7',
  },
  itemActive: {
    backgroundColor: RED,
  },
  itemDisabled: {
    backgroundColor: '#AAAAAA',
  },
  touchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    flex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});