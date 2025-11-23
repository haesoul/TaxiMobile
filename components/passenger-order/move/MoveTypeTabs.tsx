import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import images from '../../../constants/images'
import { t, TRANSLATION } from '../../../localization'
import Tabs, { ITab } from '../../tabs/Tabs'

export enum EMoveTypes {
  Apartament,
  Handy,
  PickUp,
  SameDayPickUp,
}

interface IProps {
  tab: EMoveTypes
  onChange: (id: EMoveTypes) => any
  visible: boolean
}

const MoveTypeTabs: React.FC<IProps> = ({ tab, onChange, visible }) => {
  const TABS = {
    APARTAMENT: { id: EMoveTypes.Apartament, sid: 1, label: t(TRANSLATION.APARTAMENT_SHEDULE), image: 'apartamentShedule' },
    HANDY: { id: EMoveTypes.Handy, sid: 2, label: t(TRANSLATION.HANDY_MOVING), image: 'handyMoving' },
    PICK_UP: { id: EMoveTypes.PickUp, sid: 3, label: t(TRANSLATION.PICK_UP), image: 'pickUp' },
    SAME_DAY_PICK_UP: { id: EMoveTypes.SameDayPickUp, sid: 4, label: t(TRANSLATION.SAME_DAY_PICK_UP), image: 'sameDayPickUp' },
  }

  const availableMoveTypes = [1, 2, 3, 4]

  if (!visible || !availableMoveTypes) return null

  const _tabs: ITab[] = availableMoveTypes
    .map((key) => {
      const _entry = Object.entries(TABS)?.find(([_, tab]) => tab.sid === +key)
      const _tab = _entry ? TABS[_entry[0] as keyof typeof TABS] : null
      return _tab
        ? {
            id: _tab.id as EMoveTypes,
            label: _tab.label,
            img: images[_tab.image as keyof typeof images],
          }
        : null
    })
    .filter(Boolean) as ITab[]

  if (!_tabs.length) return null

  if (_tabs.length === 1) {
    if (onChange && _tabs[0]) onChange(_tabs[0].id as EMoveTypes)
    return null
  }

  function isMoveType(value: number): value is EMoveTypes {
    return Object.values(EMoveTypes).filter(v => typeof v === 'number').includes(value)
  }

  return (
    <View style={styles.moveType}>
      <Text style={styles.inputLabel}>{t(TRANSLATION.TYPE_RELOCATION)}</Text>

      <Tabs
        tabs={_tabs}
        activeTabID={tab}
        onChange={(id: string | number) => {
          const numericId = typeof id === 'string' ? parseInt(id, 10) : id
          if (typeof numericId === 'number' && isMoveType(numericId)) {
            onChange(numericId)
          }
        }}
        gradient={() => 'black'}
      />
    </View>
  )
}

export default React.memo(MoveTypeTabs)

const styles = StyleSheet.create({
  moveType: {
    marginVertical: 10,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },


  moveTypeTab: {
    width: 200,
    height: 120,
  },

  moveTypeTabSmall: {
    width: '48%',
    height: 120,
  },
})
