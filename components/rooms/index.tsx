import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import rooms from '../../constants/rooms'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import { gradient } from '../../tools/theme'
import { IFurniture, IRoom } from '../../types/types'

interface IProps {
  furnitureState: IFurniture['house']
  value: IRoom['id'] | null
  onChange: (value: IRoom['id']) => any
}

const Rooms: React.FC<IProps> = ({ furnitureState, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{t(TRANSLATION.ROOM_LIST)}</Text>
      <View style={styles.rooms}>
        {rooms.map(item => {
          const isActive = value === item.id
          const hasFurniture =
            furnitureState &&
            furnitureState[item.id] &&
            Object.values(furnitureState[item.id]).filter(Boolean).length > 0

          return (
            <Pressable
              key={item.id}
              onPress={() => onChange(item.id)}
              style={[
                styles.roomItem,
                isActive && styles.roomItemActive,
                hasFurniture && styles.roomItemFurniture,
              ]}
            >
              {isActive ? (
                <LinearGradient
                  colors={gradient().split(',').map(c => c.trim()) as [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text style={[styles.roomText, isActive && styles.roomTextActive]}>
                {t(item.label)}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

export default Rooms

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  rooms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomItem: {
    width: '32%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#EEEEEE',
    position: 'relative',
  },
  roomItemActive: {
    borderColor: SITE_CONSTANTS.PALETTE.primary.main,
  },
  roomItemFurniture: {
    borderColor: SITE_CONSTANTS.PALETTE.primary.main,
  },
  roomText: {
    textAlign: 'center',
    color: '#000',
    zIndex: 1,
  },
  roomTextActive: {
    color: '#fff',
  },
})
