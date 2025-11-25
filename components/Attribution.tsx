import { JSX } from 'react'
import { Text } from 'react-native'

interface AttributionProps {
  tileProvider?: 'OSM' | 'MapTiler' | 'Google'
}

export const Attribution = ({ tileProvider = 'MapTiler' }: AttributionProps) => {
  let content: JSX.Element | string = ''

  switch (tileProvider) {
    case 'OSM':
      content = (
        <>
          Map data ©{' '}
          <Text
            style={{ color: 'blue' }}
          >
            OpenStreetMap
          </Text>{' '}
          contributors
        </>
      )
      break
    case 'MapTiler':
      content = (
        <>
          Map data ©{' '}
          <Text
            style={{ color: 'blue' }}
          >
            MapTiler
          </Text>
        </>
      )
      break
    case 'Google':
      content = 'Map data © Google'
      break
  }

  return (
    <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
      {content}
    </Text>
  )
}
