import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { EDriverTabs } from '.'
import * as API from '../../API'
import Button from '../../components/Button'
import StatusCard from '../../components/Card/OrderCard'
import MiniOrder from '../../components/MiniOrder'
import PageSection from '../../components/PageSection'
import { TABS } from '../../components/passenger-order/tabs-switcher'
import Separator from '../../components/separator/Separator'
import images from '../../constants/images'
import { statuses } from '../../constants/miniOrders'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import { modalsActionCreators } from '../../state/modals'
import { IOrdersState } from '../../state/orders/constants'
import { userActionCreators } from '../../state/user'
import { IUserState } from '../../state/user/constants'
import { EBookingDriverState, EColorTypes, IUser } from '../../types/types'
import styles from './STYLES'

const mapDispatchToProps = {
  setTakePassengerModal: modalsActionCreators.setTakePassengerModal,
  setUser: userActionCreators.setUser,
}

const connector = connect(null, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  user: IUserState['user'],
  activeOrders: IOrdersState['activeOrders'],
  historyOrders: IOrdersState['historyOrders'],
  readyOrders: IOrdersState['readyOrders'],
  type: Omit<EDriverTabs, EDriverTabs.Map>,
}

const DriverOrders: React.FC<IProps> = ({
  user,
  activeOrders = [],
  readyOrders = [],
  historyOrders = [],
  type,
  setTakePassengerModal,
  setUser,
}) => {
  const [showCandidateOrders, setShowCandidateOrders] = useState(true)
  const [showReadyOrders, setShowReadyOrders] = useState(true)
  const [showHistoryOrders, setShowHistoryOrders] = useState(false)
  const [statusID, setStatusID] = useState(statuses[0]?.id)

  const router = useRouter()

  // const handleOrderClick = (id: string) => {
  //   // @ts-expect-error
  //   router.push(`/Order/${id}`);
  // };
  const handleOrderClick = (id: string) => {
    router.push({
      pathname: "/Order/[id]",
      params: { id: id },
    });
  };

  const handleDrovePassengerClick = () => {
    API.setOutDrive(true)
      .then(API.getAuthorizedUser)
      .then((u) => setUser(u))
      .catch(() => { /* можно обработать ошибку */ })
  }

  const candidateOrders = activeOrders?.filter(item => {
    return (
      item.drivers?.length &&
      item.drivers.find((i: any) => i.u_id === user?.u_id && i.c_state === EBookingDriverState.Considering)
    )
  }) || []

  const activeOrdersWithoutCandidates = activeOrders?.filter(item => !candidateOrders?.includes(item)) || []

  return (
    <PageSection>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Верхняя кнопка Took / Drove */}
        {
          (
            SITE_CONSTANTS.LIST_OF_MODES_USED[TABS.WAITING.id] ||
            SITE_CONSTANTS.LIST_OF_MODES_USED[TABS.VOTING.id]
          ) && (
            user?.out_drive ?
              <View style={styles.finishDriveButton}>
                <Button
                  text={t(TRANSLATION.DROVE_PASSENGER)}
                  onPress={handleDrovePassengerClick}
                  imageProps={{
                    source: images.people,
                  }}
                  colorType={EColorTypes.Accent}
                />
              </View> :
              <View style={styles.finishDriveButton}>
                <Button
                  text={t(TRANSLATION.TOOK_PASSENGER)}
                  onPress={() => setTakePassengerModal({ isOpen: true })}
                  imageProps={{
                    source: images.people,
                  }}
                  colorType={EColorTypes.Accent}
                />
              </View>
          )
        }

        {/* Active orders (without candidates) */}
        <View style={[styles.driverOrders, styles.driverOrdersSeparatorBefore, styles.driverOrdersActive]}>
          {
            (activeOrdersWithoutCandidates?.length && activeOrdersWithoutCandidates.map((item: any) => (
              type === EDriverTabs.Lite ?
                <MiniOrder
                  user={user as IUser}
                  order={item}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                /> :
                <StatusCard
                  style={[styles.driverOrderWideModeStatusCard as StyleProp<ViewStyle>]}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                  order={item}
                  user={user as IUser}
                />
            ))) || (
              <View style={styles.driverOrdersEmpty as ViewStyle}>
                <Text>{t(TRANSLATION.NO_ACTUAL_DRIVE)}</Text>
              </View>
            )
          }
        </View>

        {/* Candidate orders */}
        {!!candidateOrders?.length && (
          <>
            <Separator
              onPress={() => setShowCandidateOrders(prev => !prev)}
              src={showCandidateOrders ? images.minusCircle : images.plusCircle}
              text={t(TRANSLATION.CANDIDATE)}
            />
            <View style={[styles.driverOrders, showCandidateOrders && styles.driverOrdersActive]}>
              {
                (candidateOrders.length && candidateOrders.map((item: any) => (
                  type === EDriverTabs.Lite ?
                    <MiniOrder
                      user={user as IUser}
                      order={item}
                      onClick={() => handleOrderClick(item.b_id)}
                      key={item.b_id}
                      isHistory={false}
                    /> :
                    <StatusCard
                      style={styles.driverOrderWideModeStatusCard}
                      onClick={() => handleOrderClick(item.b_id)}
                      key={item.b_id}
                      order={item}
                      user={user as IUser}
                    />
                ))) || (
                  <View><Text>{t(TRANSLATION.NO_ACTUAL_DRIVE)}</Text></View>
                )
              }
            </View>
          </>
        )}

        {/* Ready / Actual orders header */}
        <Separator
          onPress={() => setShowReadyOrders(prev => !prev)}
          active={showReadyOrders}
          text={t(TRANSLATION.ACTUAL)}
        />

        {/* Ready orders + statuses */}
        <View style={[styles.driverOrders, showReadyOrders && styles.driverOrdersActive]}>
          <View style={styles.driverStatuses}>
            {
              statuses.map((status) => {
                const isActive = status.id === statusID

                const badgeStyle = status.className && (styles as any)[status.className]
                return (
                  <TouchableOpacity
                    key={status.id}
                    onPress={() => setStatusID(status.id)}
                    style={[styles.statusItem]}
                  >
                    <View style={badgeStyle ?? styles.statusBadgeBase} />
                    <Text style={styles.statusLabel}>
                      {isActive ? t(status.label) : t(status.label)[0]}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>

          {
            readyOrders?.map((item: any) => (
              type === EDriverTabs.Lite ?
                <MiniOrder
                  user={user as IUser}
                  order={item}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                  isHistory={false}
                /> :
                <StatusCard
                  style={styles.driverOrderWideModeStatusCard}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                  order={item}
                  user={user as IUser}
                />
            ))
          }
        </View>

        <Separator
          text={t(TRANSLATION.ORDERS_HISTORY)}
          active={showHistoryOrders}
          onPress={() => setShowHistoryOrders(prev => !prev)}
        />


        <View style={[styles.driverOrders, showHistoryOrders && styles.driverOrdersActive]}>
          {
            historyOrders?.map((item: any) => (
              type === EDriverTabs.Lite ?
                <MiniOrder
                  user={user as IUser}
                  order={item}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                  isHistory={true}
                /> :
                <StatusCard
                  style={styles.driverOrderWideModeStatusCard}
                  onClick={() => handleOrderClick(item.b_id)}
                  key={item.b_id}
                  order={item}
                  user={user as IUser}
                />
            ))
          }
        </View>
      </ScrollView>
    </PageSection>
  )
}

export default connector(DriverOrders)
