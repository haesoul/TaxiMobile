import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface IProps {
  hints: string[]
  onClick: (hint: string) => any
}

const Component: React.FC<IProps> = ({ hints, onClick }) => {
  return (
    <View style={styles.hints}>
      {hints.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onClick(item)}>
          <Text style={styles.colored}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Component

const styles = StyleSheet.create({
  hints: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colored: {
    fontSize: 16,
    fontWeight: '300',
    textDecorationLine: 'underline',
    marginRight: 10,
  },
})
