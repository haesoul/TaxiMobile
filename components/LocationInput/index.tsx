import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import store, { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { useCachedState } from '../../tools/hooks'
import { cachedOrderDataStateKey } from '../../tools/utils'
import {
  EBookingLocationKinds,
  EPointType,
  ISuggestion,
} from '../../types/types'
import Input, { EInputStyles } from '../Input'

const mapStateToProps = (state: IRootState) => ({
  from: clientOrderSelectors.from(state),
  to: clientOrderSelectors.to(state),
  locationClass: clientOrderSelectors.locationClass(state),
})

const mapDispatchToProps = {
  setFrom: clientOrderActionCreators.setFrom,
  setTo: clientOrderActionCreators.setTo,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  className?: string
  type: EPointType
  onOpenMap: () => void
  extended?: boolean
  error?: string
}

const debouncedGetPointSuggestion = _.debounce((callback, ...args) => {
  API.getPointSuggestions(
    ...args,
  ).then(callback)
}, 500)

function LocationInput({
  from,
  to,
  locationClass,
  setFrom,
  setTo,
  className,
  type,
  onOpenMap,
  extended = false,
  error,
}: IProps) {
  const point = type === EPointType.From ? from : to
  const setPoint = type === EPointType.From ? setFrom : setTo

  const [isAddressShort, setIsAddressShort] = useCachedState(
    `${cachedOrderDataStateKey}.is${EPointType[type]}AddressShort`,
    true,
  )
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([])
  SITE_CONSTANTS.init(store.getState().global.data);

  const locationClassData = SITE_CONSTANTS.BOOKING_LOCATION_CLASSES
    ?.find(({ id }: any) => id === locationClass)!
  const isIntercity = locationClassData?.kind === EBookingLocationKinds.Intercity

  useEffect(() => {
    debouncedGetPointSuggestion(setSuggestions, point?.address, isIntercity)
  }, [point, isIntercity])

  const buttons = [
    {
      src: isAddressShort ? images.minusIcon : images.plusIcon,
      onPress: () => setIsAddressShort(prev => !prev),
    },
    {
      src: images.pointOnMap,
      onPress: onOpenMap,
    },
  ]

  return (
    <Input
      fieldWrapperClassName={className}
      inputProps={{
        placeholder: t(type === EPointType.From ?
          TRANSLATION.START_POINT :
          TRANSLATION.DESTINATION_POINT
        ),
        value: (isAddressShort && point?.shortAddress ?
          point?.shortAddress :
          point?.address
        ) || '',
        onChangeText: (text: string) => setPoint({ address: text }),
      }}
      style={EInputStyles.RedDesign}
      error={error}
      buttons={
        point?.shortAddress ?
          buttons.map((btn, i) => (
            <TouchableOpacity key={i} onPress={btn.onPress}>
              {/* <Image source={btn.src} /> */}
              <btn.src />
            </TouchableOpacity>
          )) :
          buttons.slice(1).map((btn, i) => (
            <TouchableOpacity key={i} onPress={btn.onPress}>
              {/* <Image source={btn.src} /> */}
              <btn.src />
            </TouchableOpacity>
          ))
      }
      suggestions={suggestions}
      onSuggestionClick={(suggestion) => setPoint(suggestion.point || null)}
    />
  )
}

export default connector(LocationInput)
