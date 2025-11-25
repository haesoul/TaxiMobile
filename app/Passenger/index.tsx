import Map from '@/components/Map/index'
import MiniOrders from '@/components/MiniOrders'
import { SwipeView } from '@/components/Swipe'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import Layout from '../../components/Layout'
import PageSection from '../../components/PageSection'
import VotingForm from '../../components/VotingForm'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { modalsActionCreators } from '../../state/modals'
import { ordersActionCreators, ordersSelectors } from '../../state/orders'
import { userSelectors } from '../../state/user'
import { useInterval } from '../../tools/hooks'
import { EBookingDriverState, IOrder } from '../../types/types'
import styles from './STYLES'


const mapStateToProps = (state: IRootState) => ({
  activeOrders: ordersSelectors.activeOrders(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  setVoteModal: modalsActionCreators.setVoteModal,
  setDriverModal: modalsActionCreators.setDriverModal,
  setMessageModal: modalsActionCreators.setMessageModal,
  setOnTheWayModal: modalsActionCreators.setOnTheWayModal,
  setRatingModal: modalsActionCreators.setRatingModal,
  setCandidatesModal: modalsActionCreators.setCandidatesModal,
  getActiveOrders: ordersActionCreators.getActiveOrders,
  setFrom: clientOrderActionCreators.setFrom,
  setTo: clientOrderActionCreators.setTo,
  setSelectedOrder: clientOrderActionCreators.setSelectedOrder,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> { }

const Passenger: React.FC<IProps> = ({
  activeOrders,
  selectedOrder: selectedOrderID,
  user,
  setVoteModal,
  setDriverModal,
  setMessageModal,
  setOnTheWayModal,
  setRatingModal,
  setCandidatesModal,
  getActiveOrders,
  setFrom,
  setTo,
  setSelectedOrder,
}: IProps) => {

  // map center (latitude, longitude)
  const mapCenter = useRef<[number, number] | null>(null)
  const setMapCenter = useCallback((value: [number, number]) => {
    mapCenter.current = value
  }, [])

  // simplified swipe handling using components/Swipe.tsx
  const [isExpanded, setIsExpanded] = useState(false)

  const setFromAsMapCenter = useCallback(() => {
    if (isExpanded) setIsExpanded(false)
    else if (mapCenter.current) {
      const [latitude, longitude] = mapCenter.current
      setFrom({ latitude, longitude })
    }
  }, [isExpanded, setFrom])

  const setToAsMapCenter = useCallback(() => {
    if (isExpanded) setIsExpanded(false)
    else if (mapCenter.current) {
      const [latitude, longitude] = mapCenter.current
      setTo({ latitude, longitude })
    }
  }, [isExpanded, setTo])

  const selectedOrder = useMemo(() =>
    activeOrders?.find((item) => item.b_id === selectedOrderID) ?? null
  , [activeOrders, selectedOrderID])

  const selectedOrderDriver = useMemo(() =>
    selectedOrder?.drivers &&
    selectedOrder?.drivers?.find(
      (item) => item.c_state > EBookingDriverState.Canceled,
    )
  , [selectedOrder])

  useEffect(() => {
    if (user) getActiveOrders()
  }, [user, getActiveOrders])

  useInterval(() => {
    if (user) getActiveOrders()
  }, 5000)

  const openCurrentModal = useCallback(() => {
    if (!selectedOrder) {
      setVoteModal(false)
      setDriverModal(false)
      setOnTheWayModal(false)
      return
    }

    if (selectedOrder.b_voting && !selectedOrderDriver) {
      setVoteModal(true)
      return
    }

    onDriverStateChange()
  }, [selectedOrder, selectedOrderDriver, setVoteModal, setDriverModal, setOnTheWayModal])

  useEffect(() => {
    onDriverStateChange()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrderDriver?.c_state])

  const onDriverStateChange = useCallback(() => {
    if (!selectedOrderDriver || selectedOrderDriver.c_state === EBookingDriverState.Finished) {
      setVoteModal(false)
      setDriverModal(false)
      setOnTheWayModal(false)
      return
    }

    if ([EBookingDriverState.Performer, EBookingDriverState.Arrived].includes(selectedOrderDriver.c_state)) {
      setVoteModal(false)
      setDriverModal(true)
    } else if (selectedOrderDriver?.c_state === EBookingDriverState.Started) {
      setDriverModal(false)
      setOnTheWayModal(true)
    }
  }, [selectedOrderDriver, setVoteModal, setDriverModal, setOnTheWayModal])

  const [orderReselected, setOrderReselected] = useState(false)
  useEffect(() => {
    if (orderReselected) {
      openCurrentModal()
      setOrderReselected(false)
    }
  }, [orderReselected, openCurrentModal])

  const prevActiveOrders = useRef<IOrder[]>([])
  useEffect(() => {
    (async () => {
      const activeOrdersIds = new Set(activeOrders?.map(order => order.b_id) ?? [])
      for (const order of prevActiveOrders.current) {
        if (activeOrdersIds.has(order.b_id)) continue

        const driver = order.drivers?.find(item => item.c_state !== EBookingDriverState.Canceled)
        if (!driver) return

        if (driver.c_state <= EBookingDriverState.Started) {
          try {
            const res = await API.getOrder(order.b_id)
            const resDriver = res?.drivers?.find(item => item.c_state !== EBookingDriverState.Canceled)
            if (resDriver?.c_state === EBookingDriverState.Finished) {
              setRatingModal({ isOpen: true, orderID: order.b_id })
              break
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
          }
        }
      }
    })()
    prevActiveOrders.current = activeOrders ?? []
  }, [activeOrders, setRatingModal])

  const handleOrderClick = useCallback((order: IOrder) => {
    setSelectedOrder(order.b_id)
    setOrderReselected(true)
  }, [setSelectedOrder])

  const submittedOrderId = useRef<IOrder['b_id'] | null>(null)
  const onSubmit = useCallback((data: { b_id: IOrder['b_id'] }) => {
    submittedOrderId.current = data.b_id
    setSelectedOrder(data.b_id)
    setIsExpanded(false)
  }, [setSelectedOrder])

  useEffect(() => {
    if (submittedOrderId.current === null) return
    for (const order of activeOrders ?? []) {
      if (order.b_id === submittedOrderId.current) {
        if (order.b_id === selectedOrderID) openCurrentModal()
        submittedOrderId.current = null
      }
    }
  }, [activeOrders, selectedOrderID, openCurrentModal])
  // style={styles.formContainer}
  return (
    <Layout>
      <PageSection scrollable={false} >


          <MiniOrders

            handleOrderClick={handleOrderClick}
          />


          <Map

            setCenter={setMapCenter}
          />

        <View style={styles.passengerFormPlaceholder} />
        
        <SwipeView swipeHeight={300} speed={250} containerStyle={styles.passengerFormContainer}>
          {/* <BoundaryButtons /> */}
          <View style={styles.passengerDraggable}>
            <View style={styles.passengerSwipeLine} />


            <VotingForm
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              syncFrom={setFromAsMapCenter}
              syncTo={setToAsMapCenter}
              onSubmit={onSubmit}

            />


          </View>
        </SwipeView>

      </PageSection>
    </Layout>
  )
}

// export const PassengerConnected = connector(Passenger)

export default connector(Passenger)

