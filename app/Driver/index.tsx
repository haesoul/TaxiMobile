// Driver.tsx
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { createContext, useEffect, useRef } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect, ConnectedProps } from 'react-redux'
import ErrorFrame from '../../components/ErrorFrame'
import images from '../../constants/images'
import { withLayout } from '../../HOCs/withLayout'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators } from '../../state/modals'
import { ordersActionCreators, ordersSelectors } from '../../state/orders'
import { userSelectors } from '../../state/user'
import { useInterval } from '../../tools/hooks'
import { EUserRoles, IAddressPoint } from '../../types/types'
import DriverMap from './Map'
import DriverOrders from './Orders'
import styles from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  activeOrders: ordersSelectors.activeOrders(state),
  readyOrders: ordersSelectors.readyOrders(state),
  historyOrders: ordersSelectors.historyOrders(state),
  user: userSelectors.user(state),
})

const mapDispatchToProps = {
  ...ordersActionCreators,
  setLoginModal: modalsActionCreators.setLoginModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export const OrderAddressContext = createContext<{
  ordersAddressRef: React.RefObject<{ [orderId: string]: IAddressPoint }>
} | null>(null)

export enum EDriverTabs {
  Map = 'map',
  Lite = 'lite',
  Detailed = 'detailed',
}

interface IProps extends ConnectedProps<typeof connector> {}

const Driver: React.FC<IProps> = ({
  activeOrders,
  readyOrders,
  historyOrders,
  user,
  getActiveOrders,
  getHistoryOrders,
  getReadyOrders,
  setLoginModal,
}) => {
  const params = useLocalSearchParams()
  const router = useRouter()

  // default tab if not provided
  const tab = (params.tab as EDriverTabs) ?? EDriverTabs.Lite

  const ordersAddressRef = useRef<{ [orderId: string]: IAddressPoint }>({})

  useInterval(() => {
    if (user) getActiveOrders({ estimate: true })
  }, 2000)

  useInterval(() => {
    if (user) getReadyOrders({ estimate: true })
  }, 3000)

  useInterval(() => {
    if (user) getHistoryOrders()
  }, 10000)

  useEffect(() => {
    if (user) {
      getActiveOrders({ estimate: true })
      getReadyOrders({ estimate: true })
      getHistoryOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (user?.u_role !== EUserRoles.Driver) {
    const avatarSource =
      typeof images.avatar === 'number' ? images.avatar : { uri: images.avatar }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ErrorFrame
          renderImage={() => (
            <TouchableOpacity
              style={styles.errorIcon}
              onPress={() => setLoginModal(true)}
            >
              <Image
                source={avatarSource as any}
                style={{ marginTop: 50, width: 80, height: 80, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          )}
          title={t(TRANSLATION.UNAUTHORIZED_ACCESS)}
        />
      </SafeAreaView>
    )
  }

  const goToTab = (selected: EDriverTabs) => {

    // @ts-ignore
    router.push(`/(tab)/${selected}`)
  }

  const avatarSource =
    typeof images.avatar === 'number' ? images.avatar : { uri: images.avatar }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tabs */}
        <View style={styles.driverTabs}>
          <TouchableOpacity
            onPress={() => goToTab(EDriverTabs.Lite)}
            style={[
              styles.driverTabsTab,
              tab === EDriverTabs.Lite && styles.driverTabsTabActive,
            ]}
          >
            <Text
              style={[
                styles.driverTabsTabText,
                tab === EDriverTabs.Lite && styles.driverTabsTabActiveText,
              ]}
            >
              {t(TRANSLATION.LIGHT)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goToTab(EDriverTabs.Detailed)}
            style={[
              styles.driverTabsTab,
              tab === EDriverTabs.Detailed && styles.driverTabsTabActive,
            ]}
          >
            <Text
              style={[
                styles.driverTabsTabText,
                tab === EDriverTabs.Detailed && styles.driverTabsTabActiveText,
              ]}
            >
              {t(TRANSLATION.ALL)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => goToTab(EDriverTabs.Map)}
            style={[
              styles.driverTabsTab,
              tab === EDriverTabs.Map && styles.driverTabsTabActive,
            ]}
          >
            <Text
              style={[
                styles.driverTabsTabText,
                tab === EDriverTabs.Map && styles.driverTabsTabActiveText,
              ]}
            >
              {t(TRANSLATION.MAP)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {(tab === EDriverTabs.Lite || tab === EDriverTabs.Detailed) && (
          <OrderAddressContext.Provider value={{ ordersAddressRef }}>
            <View style={styles.driverOrders}>
              <DriverOrders
                user={user}
                type={tab}
                activeOrders={activeOrders}
                readyOrders={readyOrders}
                historyOrders={historyOrders}
              />
            </View>
          </OrderAddressContext.Provider>
        )}

        {tab === EDriverTabs.Map && (
          <OrderAddressContext.Provider value={{ ordersAddressRef }}>
            <View style={[styles.driverOrderMapMode, { flex: 1 }]}>
              <DriverMap
                user={user}
                activeOrders={activeOrders}
                readyOrders={readyOrders}
              />
            </View>
          </OrderAddressContext.Provider>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default withLayout(connector(Driver))
