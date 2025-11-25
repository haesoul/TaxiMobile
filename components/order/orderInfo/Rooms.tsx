import SmartImage from '@/components/SmartImage'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import furniture, { IFurnitureItem } from '../../../constants/furniture'
import images from '../../../constants/images'
import rooms from '../../../constants/rooms'
import { t, TRANSLATION } from '../../../localization'
import { IFurniture, IOrder, IRoom, TRoomFurniture } from '../../../types/types'
import { EMoveTypes } from '../../passenger-order/move/MoveTypeTabs'
import OrderField from './OrderField'

interface IProps {
  order: IOrder
}

const Rooms: React.FC<IProps> = ({ order }) => {
  if (!order.b_options?.furniture) return null

  const furnitureData = order.b_options.furniture

  return (
    <View style={styles.orderInfoFurniture}>
      {order.b_options.moveType === EMoveTypes.Apartament ? (
        Object.entries<TRoomFurniture>(furnitureData as IFurniture['house']).map(([roomID, room]) => {
          const foundRoom = rooms?.find(r => r.id === +roomID) as IRoom

          const roomValue = (
            <Text style={styles.furnitureText}>
              {order.b_options?.elevator?.steps?.[roomID]
                ? `${order.b_options.elevator.steps[roomID]} ${t(TRANSLATION.STEPS)}, `
                : ''}
              {Object.entries<number>(room)
                .filter(([_, value]) => !!value)
                .map(([key, value], index) => {
                  const foundFurniture = furniture?.find(i => i.id === +key) as IFurnitureItem
                  return (
                    <Text key={key} style={styles.furnitureItem}>
                      {index !== 0 && ', '}
                      <SmartImage
                        source={foundFurniture.image}
                        style={styles.furnitureImage}
                        accessibilityLabel={t(foundFurniture.label)}
                      />
                      {t(foundFurniture.label, { toLower: true })}({value})
                    </Text>
                  )
                })}
            </Text>
          )

          return (
            <OrderField
              key={roomID}
              image={images.furniture}
              alt={t(foundRoom.label)}
              title={t(foundRoom.label)}
              value={roomValue}
            />
          )
        })
      ) : (
        <OrderField
          image={images.furniture}
          alt={t(TRANSLATION.FURNITURE_LIST)}
          title={t(TRANSLATION.FURNITURE_LIST)}
          value={
            <Text style={styles.furnitureText}>
              {Object.entries(furnitureData)
                .filter(([_, value]) => !!value)
                .map(([key, value], index) => {
                  const foundFurniture = furniture?.find(i => i.id === +key) as IFurnitureItem
                  return (
                    <Text key={key} style={styles.furnitureItem}>
                      {index !== 0 && ', '}
                      <SmartImage
                        source={foundFurniture.image}
                        style={styles.furnitureImage}
                        accessibilityLabel={t(foundFurniture.label)}
                      />
                      {t(foundFurniture.label, { toLower: true })}({value})
                    </Text>
                  )
                })}
            </Text>
          }
        />
      )}
    </View>
  )
}

export default Rooms

const styles = StyleSheet.create({
  orderInfoFurniture: {
    marginVertical: 10,
  },

  furnitureText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  furnitureImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
})
