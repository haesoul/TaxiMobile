
import * as Location from 'expo-location'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native'
import MapView, {
  Circle as MapCircle,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  UrlTile,
} from 'react-native-maps'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import store, { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { modalsSelectors } from '../../state/modals'
import { EMapModalTypes } from '../../state/modals/constants'
import { orderSelectors } from '../../state/order'
// import { getTileServerUrl } from '../../tools/utils'
import { TouchableOpacity } from 'react-native'
import { IAddressPoint, IRouteInfo, IStaticMarker } from '../../types/types'
import { Attribution } from '../Attribution'


// import styles from './STYLES' // <-- предполагается default export объекта с camelCase стилями

const defaultZoomDelta = { latitudeDelta: 0.01, longitudeDelta: 0.01 }

const mapStateToProps = (state: IRootState) => ({
  type: modalsSelectors.mapModalType(state),
  defaultCenter: modalsSelectors.mapModalDefaultCenter(state),
  clientFrom: clientOrderSelectors.from(state),
  clientTo: clientOrderSelectors.to(state),
  detailedOrderStart: orderSelectors.start(state),
  detailedOrderDestination: orderSelectors.destination(state),
  takePassengerFrom: modalsSelectors.takePassengerModalFrom(state),
  takePassengerTo: modalsSelectors.takePassengerModalTo(state),
})

const connector = connect(mapStateToProps)
type ReduxProps = ConnectedProps<typeof connector>

interface IProps extends ReduxProps {
  isOpen?: boolean
  disableButtons?: boolean
  isModal?: boolean
  onClose?: () => void
  containerClassName?: string
  setCenter?: (coordinates: [number, number]) => void
  mapRef?: any
}


function Map({
  isOpen = true,
  defaultCenter,
  isModal,
  containerClassName,
  ...props
}: IProps) {
  const mapRef = useRef<MapView | null>(null)
  SITE_CONSTANTS.init(store.getState().global.data);
  const centerLat = defaultCenter?.[0] ?? SITE_CONSTANTS.DEFAULT_POSITION[0]
  const centerLng = defaultCenter?.[1] ?? SITE_CONSTANTS.DEFAULT_POSITION[1]

  const initialRegion = {
    latitude: centerLat,
    longitude: centerLng,
    ...defaultZoomDelta,
  }

  return (
    <View

      style={[
        (styles as any).mapContainer,
        isModal ? (styles as any).mapContainerModal : null,
      ]}

      key={SITE_CONSTANTS.MAP_MODE}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={(styles as any).map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true} 
        showsCompass={false}
        toolbarEnabled={false}
        ref={mapRef}

      >
        {/* <MapContent
          {...{ isOpen, defaultCenter, isModal, containerClassName }}
          {...props}
          mapRef={mapRef} 
        /> */}
      </MapView>
    </View>
  )
}


function MapContent({
  isOpen = true,
  type,
  defaultCenter,
  clientFrom,
  clientTo,
  detailedOrderStart,
  detailedOrderDestination,
  takePassengerFrom,
  takePassengerTo,
  mapRef,
  disableButtons,
  isModal,
  onClose,
  containerClassName,

  setCenter = () => {},
}: IProps) {
  // const mapRef = useRef<MapView | null>(null)

  const [staticMarkers, setStaticMarkers] = useState<IStaticMarker[]>([])
  const [userCoordinates, setUserCoordinates] = useState<IAddressPoint | null>(null)
  const [userCoordinatesAccuracy, setUserCoordinatesAccuracy] = useState<number | null>(null)
  const [routeInfo, setRouteInfo] = useState<IRouteInfo | null>(null)
  const [showRouteInfo, setShowRouteInfo] = useState(false)


  const API_KEY = "QLkO5SNOn90ffWtzmtQ5"
  const tileUrl = `https://api.maptiler.com/maps/base-v4/?key=${API_KEY}`;

  let from: IAddressPoint | null = null
  let to: IAddressPoint | null = null
  switch (type) {
    case EMapModalTypes.Client:
      from = clientFrom ?? null
      to = clientTo ?? null
      break
    case EMapModalTypes.OrderDetails:
      from = detailedOrderStart ?? null
      to = detailedOrderDestination ?? null
      break
    case EMapModalTypes.TakePassenger:
      from = takePassengerFrom ?? null
      to = takePassengerTo ?? null
      break
    default:
      break
  }


  useEffect(() => {
    let mounted = true
    if (!isOpen) return
    API.getWashTrips?.()
      .then((items: any[]) =>
        items.filter(item =>

          item.t_start_latitude && item.t_destination_latitude &&
          item.t_start_datetime && item.t_complete_datetime &&

          (typeof item.t_complete_datetime.isAfter === 'function'
            ? item.t_complete_datetime.isAfter(Date.now())
            : true)
        )
      )
      .then(items => {
        if (!mounted) return
        const markers = items.map((item: any) => ({
          latitude: Number(item.t_start_latitude),
          longitude: Number(item.t_start_longitude),
          popup: `from ${item.t_start_datetime?.format?.('HH:mm MM-DD') || ''} to ${item.t_complete_datetime?.format?.('HH:mm MM-DD') || ''}`,
          tooltip: `until ${item.t_complete_datetime?.format?.('HH:mm MM-DD') || ''}`,
        }))
        setStaticMarkers(markers)
      })
      .catch(err => {

        console.warn('getWashTrips error', err)
      })
    return () => { mounted = false }
  }, [isOpen])


  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.warn('Location permission not granted')
          return
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
        if (!mounted) return
        setUserCoordinates({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setUserCoordinatesAccuracy(pos.coords.accuracy)

        if (!defaultCenter && mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            ...defaultZoomDelta,
          }, 600)
        }
      } catch (err) {
        console.warn('Location error', err)
      }
    })()
    return () => { mounted = false }
  }, [defaultCenter])

  useEffect(() => {
    let mounted = true
    let id: NodeJS.Timeout | null = null
    const start = async () => {
      try {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
        if (!mounted) return
        setUserCoordinates({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setUserCoordinatesAccuracy(pos.coords.accuracy)
      } catch (err) {
        console.warn('periodic location error', err)
      }
      id = setInterval(async () => {
        try {
          const pos2 = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
          if (!mounted) return
          setUserCoordinates({ latitude: pos2.coords.latitude, longitude: pos2.coords.longitude })
          setUserCoordinatesAccuracy(pos2.coords.accuracy)
        } catch (err) {
          console.warn('periodic location error', err)
        }
      }, 20000)
    }
    start()
    return () => {
      mounted = false
      if (id) clearInterval(id)
    }
  }, [])


  useEffect(() => {
    if (defaultCenter && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: defaultCenter[0],
        longitude: defaultCenter[1],
        ...defaultZoomDelta,
      }, 400)
    }
  }, [defaultCenter])


  useEffect(() => {
    let mounted = true
    setShowRouteInfo(false)
    setRouteInfo(null)
    if (!from?.latitude || !from?.longitude || !to?.latitude || !to?.longitude) return

    ;(async () => {
      try {
        const info: IRouteInfo = await API.makeRoutePoints(from, to)
        if (!mounted) return
        setRouteInfo(info)
        setShowRouteInfo(true)

        setTimeout(() => setShowRouteInfo(false), 5000)

        if (mapRef.current && info.points && info.points.length > 0) {
          const coordsForFit = info.points.map((p: [number, number]) => ({
            latitude: p[0], longitude: p[1],
          }))

          try {
            // @ts-ignore
            mapRef.current.fitToCoordinates(coordsForFit, { edgePadding: { top: 60, right: 60, bottom: 120, left: 60 }, animated: true })
          } catch (e) {

            mapRef.current.animateToRegion({
              latitude: coordsForFit[0].latitude,
              longitude: coordsForFit[0].longitude,
              ...defaultZoomDelta,
            }, 400)
          }
        }
      } catch (err) {
        console.error('makeRoutePoints error', err)
      }
    })()

    return () => { mounted = false }
  }, [from?.latitude, from?.longitude, to?.latitude, to?.longitude])

  const goToUserLocation = useCallback(async () => {
    try {
      let coords = userCoordinates

      if (!coords) {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.warn('Location permission not granted')
          return
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
        coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
        setUserCoordinates(coords)
        setUserCoordinatesAccuracy(pos.coords.accuracy)
      }

      if (mapRef?.current && coords) {

        mapRef.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          ...defaultZoomDelta,
        }, 600)
      }
    } catch (err) {
      console.warn('goToUserLocation error', err)
    }
  }, [mapRef, userCoordinates])
  const routeCoordinates = routeInfo?.points?.map((p: [number, number]) => ({ latitude: p[0], longitude: p[1] })) ?? []


  const duration = routeInfo ? [
    !!routeInfo.time?.hours && `${routeInfo.time.hours} h`,
    !!routeInfo.time?.minutes && `${routeInfo.time.minutes} min`,
  ].filter(Boolean).join(' ') : ''


  const onRegionChangeComplete = useCallback((region: any) => {
    if (setCenter) {
      setCenter([region.latitude, region.longitude])
    }
  }, [setCenter])

  // const tileUrl = getTileServerUrl?.()

  return (
    <>

      {tileUrl ? (

        <UrlTile

          urlTemplate={tileUrl}
          maximumZ={19}
          flipY={false}
          zIndex={0}
        />
      ) : null}

      <TouchableOpacity
        onPress={goToUserLocation}
        style={(styles as any).locateButton}
      >
        <Text style={{ fontWeight: '700' }}>{'Моё местоположение'}</Text>
      </TouchableOpacity>


      {showRouteInfo && routeInfo && (
        <View style={(styles as any).mapModalRoute}>
          <Text style={{ fontWeight: '700' }}>{t(TRANSLATION.DISTANCE)}</Text>
          <Text>{routeInfo.distance} km</Text>
          <Text style={{ marginTop: 6, fontWeight: '700' }}>{t(TRANSLATION.EXPECTED_DURATION)}</Text>
          <Text>{duration}</Text>
        </View>
      )}

      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF9900"
          strokeWidth={4}
        />
      )}


      {userCoordinates?.latitude && userCoordinates?.longitude && (
        <>
          <Marker
            coordinate={{ latitude: userCoordinates.latitude, longitude: userCoordinates.longitude }}
            title={t(TRANSLATION.NAME)}

            image={images.activeMarkerPng ? (typeof images.activeMarkerPng === 'string' ? { uri: images.activeMarkerPng } : images.activeMarkerPng) : undefined}
          />
          {userCoordinatesAccuracy ? (
            <MapCircle
              center={{ latitude: userCoordinates.latitude, longitude: userCoordinates.longitude }}
              radius={userCoordinatesAccuracy}
              strokeColor={'rgba(0,0,0,0.12)'}
              fillColor={'rgba(0,0,0,0.06)'}
            />
          ) : null}
        </>
      )}


      {staticMarkers.map((marker, idx) => (
        <Marker
          key={`static-${idx}`}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.popup}
          description={marker.tooltip}
          image={images.activeMarkerPng ? (typeof images.activeMarkerPng === 'string' ? { uri: images.activeMarkerPng } : images.activeMarkerPng) : undefined}
        />
      ))}


      {from?.latitude && from?.longitude && (
        <Marker
          coordinate={{ latitude: from.latitude, longitude: from.longitude }}
          title={t(TRANSLATION.FROM)}
          description={from.address ?? undefined}
          image={images.markerFromPng ? (typeof images.markerFromPng === 'string' ? { uri: images.markerFromPng } : images.markerFromPng) : undefined}
        />
      )}
      {to?.latitude && to?.longitude && (
        <Marker
          coordinate={{ latitude: to.latitude, longitude: to.longitude }}
          title={t(TRANSLATION.TO)}
          description={to.address ?? undefined}
          image={images.markerToPng ? (typeof images.markerToPng === 'string' ? { uri: images.markerToPng } : images.markerToPng) : undefined}
        />
      )}

      {/* <MapView
        style={{ height: 0, width: 0 }}
      /> */}

      <View style={{ position: 'absolute', bottom: 4, left: 0, right: 0 }}>
        <Attribution />
      </View>

    </>
  )
}

// export default Map
export default connector(Map)







// STYLES.ts


const { height: windowHeight } = Dimensions.get('window')
const computedHeight = windowHeight - 100

const styles =  StyleSheet.create({

  mapContainer: {
    height: computedHeight,
    width: '100%',
    backgroundColor: '#FFFFFF',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: 'column',

    overflow: 'hidden',
    margin: 0,
    boxSizing: 'border-box' as any,
  },


  mapContainerModal: {
    borderRadius: 9,
    height: '90%',
    width: '90%',
    zIndex: 1000,
    padding: 10,
    alignSelf: 'center',
  },


  modalLeafletMarkerIcon: {
    zIndex: 1100,
  },


  fieldset: {
    borderRadius: 13,
    width: '100%',
    boxSizing: 'border-box' as any,
    borderWidth: 2,
    borderColor: '#1E58EB',
    padding: 8,
  },


  legend: {
    marginVertical: 0,
    alignSelf: 'center',
    paddingHorizontal: 15,
    color: '#0f2c76',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
  },

  /* h3 / h4 */
  headingLight: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },

  /* .active */
  active: {
    backgroundColor: 'aliceblue',
  },

  /* .get-coords-map-modal modifier */
  getCoordsMapModal: {
    maxWidth: '100%', // "max-width: none" -> allow full width
  },

  /* .map (inner map element) */
  map: {
    height: '100%',
    width: '100%',
  },

  /* .map-modal__route */
  mapModalRoute: {
    position: 'absolute',
    top: 10,
    left: 50,
    // width: fit-content -> use alignSelf / padding; keep maxWidth
    maxWidth: 200,
    alignSelf: 'flex-start',
    // height: fit-content -> RN uses padding
    backgroundColor: 'yellow',
    color: 'black', // text color - set on Text component
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 7,
    zIndex: 10001,
    margin: 0,
    fontSize: 20, // apply on Text
    padding: 10,
  },

  /* .leaflet-marker-icon */
  leafletMarkerIcon: {
    width: 25,
    height: 41,
    zIndex: 400,
    position: 'absolute',
    // in web used transform: translate(-50%, -100%)
    // in RN we translate by pixel values: -width/2, -height
    transform: [{ translateX: -12.5 }, { translateY: -41 }],
    // center positioning should be handled by left/top values where this style is applied
  },

  /* .modal-buttons (container for buttons inside modal) */
  modalButtons: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    // display:flex + flex-wrap + justify-content:center
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    zIndex: 480,
  },
  /* .modal-buttons.z-indexed */
  modalButtonsZIndexed: {
    zIndex: 1100,
  },

  /* .button__wrapper inside modal-buttons */
  buttonWrapper: {
    marginRight: 10,
    marginBottom: 10,
    // width: fit-content -> use alignSelf to shrink to content
    alignSelf: 'flex-start',
  },
  /* button inside button__wrapper (padding) */
  buttonInner: {
    paddingHorizontal: 20,
    paddingVertical: 10, // give some vertical padding as RN buttons don't have default
  },

  /* .leaflet-top.leaflet-left */
  leafletTopLeft: {
    zIndex: 400,
    // Positioning to top-left should be applied where leaflet UI renders
  },


  leafletControl: {
    display: 'none',
    marginTop: 32,
  },

  leafletControlVisible: {
    display: 'flex',
    marginTop: 32,
  },
  locateButton: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    zIndex: 2000,
  },
  

  shadowLarge: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 30 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    
  }) as any,
})
