import store from '@/state'
import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import SITE_CONSTANTS from '../../../siteConstants'
import Tabs, { ITab } from '../../tabs/Tabs'

export enum ECourierAutoTypes {
  Light,
  Truck,
  Wagon,
  Foot,
  Bicycle,
  Motorcycle,
}

interface IProps {
  tab: ECourierAutoTypes
  onChange: (id: ECourierAutoTypes) => any
  visible: boolean
}

const CouriersTransportTabs: React.FC<IProps> = ({ tab, onChange, visible }) => {
  const TABS = useMemo(() => ({
    FOOT: { id: ECourierAutoTypes.Foot, sid: 1, label: t(TRANSLATION.PEDESTRIAN), image: 'foot' },
    BICYCLE: { id: ECourierAutoTypes.Bicycle, sid: 2, label: t(TRANSLATION.BICYCLE), image: 'bicycle' },
    MOTORCYCLE: { id: ECourierAutoTypes.Motorcycle, sid: 3, label: t(TRANSLATION.MOTORCYCLE), image: 'motorcycle' },
    LIGHT: { id: ECourierAutoTypes.Light, sid: 4, label: t(TRANSLATION.LIGHT_AUTO), image: 'light' },
    TRUCK: { id: ECourierAutoTypes.Truck, sid: 5, label: t(TRANSLATION.TRUCK), image: 'truck' },
    WAGON: { id: ECourierAutoTypes.Wagon, sid: 6, label: t(TRANSLATION.WAGON), image: 'wagon' },
  }), [])
  SITE_CONSTANTS.init(store.getState().global.data);
  const _availableCourierTransport = SITE_CONSTANTS.LIST_OF_MODES_USED['3']
    ? SITE_CONSTANTS.LIST_OF_MODES_USED['3'].subs
    : null


  const _tabs: ITab[] = useMemo(() => {
    if (!_availableCourierTransport) return []

    return _availableCourierTransport
      .map((key: string | number) => {
        const _entry = Object.entries(TABS)?.find(([_, val]) => val.sid === +key)
        const _tabData = _entry ? TABS[_entry[0] as keyof typeof TABS] : null
        
        if (!_tabData) return null

        return {
          id: _tabData.id,
          label: _tabData.label,
          img: images[_tabData.image as keyof typeof images],
        }
      })
      // Используем Boolean для фильтрации и приводим тип к ITab[] явно
      .filter(Boolean) as ITab[]
  }, [_availableCourierTransport, TABS])

  function isCourierAutoType(value: number): value is ECourierAutoTypes {
    return Object.values(ECourierAutoTypes)
      .filter(v => typeof v === 'number')
      .includes(value)
  }

  useEffect(() => {
    if (visible && _tabs.length === 1 && _tabs[0]) {
      const targetId = _tabs[0].id as ECourierAutoTypes

      if (tab !== targetId) {
        onChange(targetId)
      }
    }
  }, [_tabs, visible, onChange, tab])

  if (!visible || !_availableCourierTransport || !_tabs.length) return null

  // Если таб один, мы его обрабатываем в useEffect, UI скрываем (согласно логике оригинала)
  if (_tabs.length === 1) return null

  return (
    <View style={styles.courierAuto}>
      <Text style={styles.inputLabel}>{t(TRANSLATION.COURIER_TRANSPORT)}</Text>
      <Tabs
        tabs={_tabs}
        activeTabID={tab}
        onChange={(id: string | number) => {
          const numericId = typeof id === 'string' ? parseInt(id, 10) : id
          if (isCourierAutoType(numericId)) {
            onChange(numericId)
          }
        }}
        gradient={() => "#FF0000"}
      />
    </View>
  )
}

export default React.memo(CouriersTransportTabs)

const styles = StyleSheet.create({
  courierAuto: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
})