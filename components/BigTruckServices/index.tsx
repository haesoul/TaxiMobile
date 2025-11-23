import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import bigTruckServices, { IBigTruckService } from '../../constants/bigTruckServices'
import { t, TRANSLATION } from '../../localization'
import { gradient } from '../../tools/theme'
import { EColorTypes } from '../../types/types'
import Button from '../Button'

type TValue = IBigTruckService['id'][]

export interface IProps {
  value: TValue
  onChange: (ids: TValue) => void
}

const BigTruckServices: React.FC<IProps> = ({ value, onChange }) => {
  const [currentItemId, setCurrentItemId] = useState<IBigTruckService['id'] | null>(null)

  const handleCellClick = (id: IBigTruckService['id']) => setCurrentItemId(id)

  const handleOrderClick = () => {
    if (currentItemId !== null) onChange([...value, currentItemId])
    setCurrentItemId(null)
  }

  const handleCancelClick = () => {
    if (currentItemId !== null) onChange(value.filter(item => item !== currentItemId))
    setCurrentItemId(null)
  }

  const currentItem = currentItemId !== null ? bigTruckServices?.find(item => item.id === currentItemId) : null

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>{t(TRANSLATION.ADDITIONAL_SERVICES_P)}:</Text>

      <View style={styles.body}>
        {bigTruckServices.map(item => {
          const isSelected = value.includes(item.id)
          const isCurrent = currentItemId === item.id
          const bgColor = isCurrent || isSelected ? gradient() : '#EEEEEE'
          const textColor = isCurrent || isSelected ? 'white' : 'black'

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleCellClick(item.id)}
              style={[styles.cell, { backgroundColor: bgColor }]}
            >
              <Text style={[styles.cellText, { color: textColor }]}>{t(item.label)}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {currentItem?.description && (
        <Text style={styles.description}>{t(currentItem.description)}</Text>
      )}

      {currentItemId !== null && (
        <>
          {!value.includes(currentItemId) && (
            <Button
              text={t(TRANSLATION.TO_ORDER, { toUpper: true })}
              onPress={handleOrderClick}
            />
          )}
          {value.includes(currentItemId) && (
            <Button
              text={t(TRANSLATION.CANCEL, { toUpper: true })}
              colorType={EColorTypes.Accent}
              onPress={handleCancelClick}
            />
          )}
        </>
      )}
    </ScrollView>
  )
}

export default BigTruckServices

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  body: {
    marginVertical: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cell: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  cellText: {
    fontSize: 17,
    fontWeight: '400',
  },
  description: {
    fontSize: 20,
    lineHeight: 23,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 24,
  },
})
