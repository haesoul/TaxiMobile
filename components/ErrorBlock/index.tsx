import React from 'react'
import { Text, View } from 'react-native'

interface IProps {
  text: string
}

export default function Error({ text }: IProps) {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  )
}