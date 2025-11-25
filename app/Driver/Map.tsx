import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Callout, Marker, Polyline, UrlTile } from 'react-native-maps'
import { connect, ConnectedProps } from 'react-redux'

import SmartImage from '@/components/SmartImage'
import { EDriverTabs } from '.'
import * as API from '../../API'
import Button from '../../components/Button'
import PageSection from '../../components/PageSection'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import { modalsActionCreators } from '../../state/modals'
import { orderActionCreators } from '../../state/order'
import { useCachedState, useInterval } from '../../tools/hooks'
import {
  dateFormatTime,
  formatCurrency,
  getAngle,
  getTileServerUrl
} from '../../tools/utils'
import {
  EBookingDriverState,
  EOrderProfitRank,
  EStatuses,
  IOrder,
  IUser,
} from '../../types/types'
import styles from './STYLES'

const cachedDriverMapStateKey = 'cachedDriverMapState'

const mapDispatchToProps = {
  getOrder: orderActionCreators.getOrder,
  setRatingModal: modalsActionCreators.setRatingModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  setOrderCardModal: modalsActionCreators.setOrderCardModal,
}

const connector = connect(null, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  user: IUser,
  activeOrders: IOrder[] | null,
  readyOrders: IOrder[] | null,
}

function DriverOrderMapMode(props: IProps) {
  const [position, setPosition] = useCachedState<[number, number] | undefined>(
    `${cachedDriverMapStateKey}.position`,
  )
  const [zoom, setZoom] = useCachedState<number>(
    `${cachedDriverMapStateKey}.zoom`,
    15,
  )

  const initialRegion = position ? {
    latitude: position[0],
    longitude: position[1],
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: SITE_CONSTANTS.DEFAULT_POSITION[0],
    longitude: SITE_CONSTANTS.DEFAULT_POSITION[1],
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  return (
    <PageSection style={styles.driverOrderMapMode}>
      <DriverOrderMapModeContent
        {...props}
        locate={!position}
        {...{ setPosition: (p: [number, number]) => setPosition(p), setZoom: (_z: number) => setZoom(_z) }}
        initialRegion={initialRegion}
      />
    </PageSection>
  )
}

interface IContentProps extends IProps {
  locate: boolean,
  setZoom: (zoom: number) => void
  setPosition: (position: [number, number]) => void
  initialRegion: any,
}

function DriverOrderMapModeContent({
  user,
  activeOrders,
  readyOrders,
  locate,
  setPosition,
  setZoom,
  getOrder,
  setRatingModal,
  setMessageModal,
  setOrderCardModal,
  initialRegion,
}: IContentProps) {

  const router = useRouter()
  const mapRef = useRef<MapView | null>(null)

  const [lastPositions, setLastPositions] = useState<[number, number][]>([])
  const [arrowAngle, setArrowAngle] = useState<number>(0)

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') return

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
        if (!mounted) return

        const coords: [number, number] = [loc.coords.latitude, loc.coords.longitude]
        setLastPositions([coords])
        if (locate && mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: coords[0],
            longitude: coords[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })
        }
      } catch (e) {
        console.error(e)
      }
    })()

    return () => { mounted = false }
  }, [])


  useInterval(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLastPositions(prev => {
          if (prev.length) {
            const newPositions = [...prev.reverse().slice(0, 2).reverse(), [coords.latitude, coords.longitude]]
            const p1 = newPositions[newPositions.length - 2]
            const p2 = newPositions[newPositions.length - 1]
            const angle = getAngle(
              { latitude: p1[0], longitude: p1[1] },
              { latitude: p2[0], longitude: p2[1] },
            )
            // setArrowAngle(angle)
            if (angle !== undefined) {
              setArrowAngle(angle)
            }
            return newPositions as typeof prev
          }
          return [[coords.latitude, coords.longitude]] as typeof prev
        })
      },
      error => console.error(error),
      { enableHighAccuracy: true },
    )
  }, 2000)

  const performingOrder = activeOrders
    ?.find(item => ([
      EBookingDriverState.Performer, EBookingDriverState.Arrived,
    ] as any[]).includes(
      item.drivers?.find(d => d.u_id === user?.u_id)?.c_state),
    )

  const currentOrder = activeOrders
    ?.find(item =>
      item.drivers?.find(d => d.u_id === user?.u_id)?.c_state === EBookingDriverState.Started,
    )

  const onCompleteOrderClick = () => {
    if (!currentOrder) return

    API.setOrderState(currentOrder.b_id, EBookingDriverState.Finished)
      .then(() => {
        getOrder(currentOrder.b_id)
        // navigate to lite tab using expo-router
        try {

          router.push({ pathname: '/(tab)', params: { id: currentOrder.b_id, tab: EDriverTabs.Lite } } as any)
        } catch (e) {

        }
        setRatingModal({ isOpen: true })
      })
      .catch(error => {
        console.error(error)
        setMessageModal({ isOpen: true, status: EStatuses.Fail, message: t(TRANSLATION.ERROR) })
      })
  }

  const handleMapPress = (e: any) => {
    const { coordinate } = e.nativeEvent
    if (user) {
      Alert.alert(
        t(TRANSLATION.CONFIRM_LOCATION),
        '?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => API.notifyPosition({ latitude: coordinate.latitude, longitude: coordinate.longitude }) },
        ],
      )
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region) => {
          // estimate zoom from latitudeDelta
          const estimatedZoom = Math.round(Math.log2(360 / region.longitudeDelta))
          setZoom(estimatedZoom)
          setPosition([region.latitude, region.longitude])
        }}
        onPress={handleMapPress}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Tile layer */}
        <UrlTile
          urlTemplate={getTileServerUrl()}
          maximumZ={19}
          flipY={false}
        />

        {/* Last position (arrow) */}
        {lastPositions.length > 0 && (
          <Marker
            coordinate={{ latitude: lastPositions[lastPositions.length - 1][0], longitude: lastPositions[lastPositions.length - 1][1] }}
            rotation={arrowAngle}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <SmartImage
              source={typeof images.mapArrow === 'string' ? { uri: images.mapArrow } : images.mapArrow}
              style={{ width: 40, height: 40, transform: [{ rotate: `${arrowAngle}deg` }] }}
            />
          </Marker>
        )}

        {/* polyline of last positions */}
        {lastPositions.length > 0 && (
          <Polyline
            coordinates={lastPositions.map(p => ({ latitude: p[0], longitude: p[1] }))}
          />
        )}

        {/* Orders markers (ready + performing) */}
        {[...(readyOrders || []), ...(performingOrder ? [performingOrder] : [])]
          .filter(item => item.b_start_latitude && item.b_start_longitude)
          .map(item => {
            const coord = { latitude: item.b_start_latitude as number, longitude: item.b_start_longitude as number }
            const profitClassMap: Record<EOrderProfitRank, string> = {
              [EOrderProfitRank.Low]: 'low',
              [EOrderProfitRank.Medium]: 'medium',
              [EOrderProfitRank.High]: 'high',
            };
            
            const profitClass =
              item.profitRank !== undefined
                ? profitClassMap[item.profitRank]
                : undefined;
            

            // Choose marker image depending on state
            const markerImage = item === performingOrder ? images.mapOrderPerforming : (item.b_voting ? images.mapOrderVoting : images.mapOrderWating)

            return (
              <Marker
                key={item.b_id}
                coordinate={coord}
                onPress={() => setOrderCardModal({ isOpen: true, orderId: item.b_id })}
              >
                <SmartImage
                  source={typeof markerImage === 'string' ? { uri: markerImage } : markerImage}
                  style={styles.markerImg}
                />
                <Callout tooltip>
                  <View style={styles.orderMarker}>
                    <View style={styles.orderMarkerHint}>
                      <View style={styles.rowInfo}>
                        <Text>{item.b_destination_address}</Text>
                      </View>
                      <View style={styles.rowInfo}>
                        <Text>{item.b_start_datetime.format(dateFormatTime)}</Text>
                        <Text style={styles.competitorsNum}>{item.drivers?.length || 0}</Text>
                      </View>
                      <View style={styles.rowInfo}>
                        <Text style={styles.pricePill}>{item.b_price_estimate || 0}</Text>
                        <Text style={styles.tipsPill}>{item.b_tips || 0}</Text>
                        <SmartImage source={typeof images.mapMarkerProfit === 'string' ? { uri: images.mapMarkerProfit } : images.mapMarkerProfit} style={{ width: 16, height: 16 }} />
                        <Text>{item.b_passengers_count || 0}</Text>
                      </View>
                      <View style={styles.rowInfo}>
                        <SmartImage source={typeof images.mapMarkerProfit === 'string' ? { uri: images.mapMarkerProfit } : images.mapMarkerProfit} style={{ width: 16, height: 16 }} />
                        <Text style={styles.orderProfitEstimation}>
                          {item.profit !== undefined ? formatCurrency(item.profit, { signDisplay: 'always', currencyDisplay: 'none' }) : '+?'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Callout>
              </Marker>
            )
          })
        }

      </MapView>

      {/* Floating button for orders without coords */}
      <TouchableOpacity
        style={styles.noCoordsOrders}
        onPress={() => router.push(`/Driver/Orders?tab=${EDriverTabs.Detailed}`)}
      >
        <Text>
          {(
            !!readyOrders && readyOrders.filter(item => !item.b_start_latitude || !item.b_start_longitude).length
          ) || 0}
        </Text>
      </TouchableOpacity>

      {currentOrder && (
        <Button
          text={t(TRANSLATION.CLOSE_DRIVE)}
          style={styles.finishDriveButton}
          textStyle={styles.finishDriveButtonText}
          onPress={onCompleteOrderClick}
        />
      )}

    </View>
  )
}

export default connector(DriverOrderMapMode)
