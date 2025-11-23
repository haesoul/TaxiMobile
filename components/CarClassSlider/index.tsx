import React, { useMemo, useRef } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { clientOrderActionCreators, clientOrderSelectors } from '../../state/clientOrder'
import { formatCurrency } from '../../tools/utils'


const { width } = Dimensions.get('window')

const mapStateToProps = (state: IRootState) => ({
  carClasses: clientOrderSelectors.availableCarClasses(state),
  carClass: clientOrderSelectors.carClass(state),
})

const mapDispatchToProps = {
  setCarClass: clientOrderActionCreators.setCarClass,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
type IProps = ConnectedProps<typeof connector>

function CarClassSlider({ carClasses, carClass, setCarClass }: IProps) {
  const disabled = carClasses === null
  const prevCarClasses = useRef(carClasses ?? [])
  if (carClasses === null) carClasses = prevCarClasses.current
  else prevCarClasses.current = carClasses

  const slides = useMemo(
    () =>
      carClasses.map(cc => (
        <TouchableOpacity
          key={cc.id}
          style={[
            styles.slide,
            cc.id === carClass && styles.slideActive,
          ]}
          onPress={() => setCarClass(cc.id)}
          disabled={disabled}
        >
          <View style={[styles.icon, cc.id === carClass && styles.iconActive]}>
            <Car active={cc.id === carClass} />
          </View>
          <Text style={[styles.title, cc.id === carClass && styles.titleActive]}>
            {t(TRANSLATION.CAR_CLASSES[cc.id])}
          </Text>
          <Text style={[styles.value, cc.id === carClass && styles.valueActive]}>
            {formatCurrency(cc.courier_call_rate)}
          </Text>
        </TouchableOpacity>
      )),
    [carClasses, carClass, setCarClass, disabled]
  )

  return (
    <FlatList
      horizontal
      data={slides}
      renderItem={({ item }) => item}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={!disabled}
    />
  )
}

export default connector(CarClassSlider)

type CarProps = {
  active: boolean
}

export function Car({ active }: CarProps) {
  const strokeColor = active ? '#FF2400' : 'rgba(0, 0, 0, 0.5)'

  return (
    <Svg width={61} height={20} viewBox="0 0 61 20" fill="none">
      <Path
        d="M42.8539 15.247H46.0226L45.6798 11.904L44.1228 10.0805L32.5555 8.97866M32.5555 8.97866L27.3084 0.925781H15.5525M32.5555 8.97866L8.29608 8.59985M15.5525 0.925781L8.29608 8.59985M15.5525 0.925781L14.429 8.67043M8.29608 8.59985L1.91542 10.1943L1.04114 14.3727L1.95287 15.247H7.04299M14.7156 15.247H35.2576M24.9578 0.925781L23.83 8.81878"
        stroke={strokeColor}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M25.7603 0.925781H35.8642L46.6998 8.97866M46.6998 8.97866L58.267 10.0805L59.824 11.904M46.6998 8.97866H32.5557M59.824 11.904L60.0948 15.247H46.0228M59.824 11.904H45.68"
        stroke={strokeColor}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M39.017 18.21C41.0518 18.21 42.7014 16.5605 42.7014 14.5257C42.7014 12.4909 41.0518 10.8413 39.017 10.8413C36.9822 10.8413 35.3326 12.4909 35.3326 14.5257C35.3326 16.5605 36.9822 18.21 39.017 18.21Z"
        stroke={strokeColor}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.7273 18.21C12.7621 18.21 14.4117 16.5605 14.4117 14.5257C14.4117 12.4909 12.7621 10.8413 10.7273 10.8413C8.69251 10.8413 7.04297 12.4909 7.04297 14.5257C7.04297 16.5605 8.69251 18.21 10.7273 18.21Z"
        stroke={strokeColor}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.2144 15.2456C18.3804 16.0811 18.831 16.8333 19.4894 17.3738C20.1479 17.9143 20.9734 18.2097 21.8253 18.2097C22.6771 18.2097 23.5026 17.9143 24.1611 17.3738C24.8195 16.8333 25.2702 16.0811 25.4362 15.2456M46.1755 15.2456C46.3415 16.0811 46.7921 16.8333 47.4505 17.3738C48.109 17.9143 48.9345 18.2097 49.7864 18.2097C50.6382 18.2097 51.4638 17.9143 52.1222 17.3738C52.7806 16.8333 53.2313 16.0811 53.3973 15.2456"
        stroke={strokeColor}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  slide: {
    width: 70,
    height: 64,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  slideActive: {
    borderWidth: 1,
    borderColor: 'rgba(255,36,0,0.2)',
    borderRadius: 16,
  },
  icon: {
    marginLeft: -18,
    marginBottom: 4,
  },
  iconActive: {
    marginLeft: 0,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.5)',
  },
  titleActive: {
    color: '#000',
  },
  value: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.5)',
  },
  valueActive: {
    color: '#000',
  },
})
