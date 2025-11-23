import store from '@/state'
import React, { useEffect, useState } from 'react'
import { t, TRANSLATION } from '../../../localization'
import SITE_CONSTANTS, { CURRENCY } from '../../../siteConstants'
import Tabs from '../../tabs/Tabs'

interface IProps {
  defaultValue?: number,
  onChange?: (value: number) => any
}

const CostTabs: React.FC<IProps> = ({ defaultValue, onChange }) => {
  const _availableCosts = getCosts()

  const TABS = _availableCosts.map((item: any) => ({
    label: `${t(
      item < 0 ?
        TRANSLATION.NUMBER_TILL :
        TRANSLATION.MORE_THAN,
    )} ${item < 0 ? -item : item}${CURRENCY.SIGN}`,
    id: item,
  }))

  const [tab, setTab] = useState(defaultValue || TABS[0].id)

  useEffect(() => {
    const _needSetFirstActive = !_availableCosts?.find((item: any) => (item === defaultValue) || (-item === defaultValue))

    if (_needSetFirstActive) {
      let _value = _availableCosts[0]
      setTab(_value)
      if (onChange) { onChange(_value) }
    }
  }, [_availableCosts, defaultValue, onChange])

  return Array.isArray(_availableCosts) ?
    (
      <Tabs
        tabs={TABS.map((item: any) => ({ ...item, id: item.id.toString() }))}
        activeTabID={tab.toString()}
        onChange={id => {
          setTab(+id)
          if (onChange) {onChange(+id)}
        }}
        gradient={() => "#FF0000"}
      />
    ) :
    null
}

export const getCosts = () => {
  SITE_CONSTANTS.init(store.getState().global.data);
  return SITE_CONSTANTS.LIST_OF_CARGO_VALUATION_AMOUNTS.split(',').map((item: any) => parseInt(item))
}

export default CostTabs