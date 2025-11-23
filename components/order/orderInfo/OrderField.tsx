import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

interface IProps {
  title: string
  value: string | React.ReactNode
  image: any
  alt: string
}

const OrderField: React.FC<IProps> = ({ title, value, image, alt }) => {
  return (
    <View>
      <View style={styles.orderFields}>
        <Image
          source={image}
          style={styles.image}
          accessibilityLabel={alt}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.colored}>
            <Text style={styles.orderFieldsTitle}>{title}:</Text> {value}
          </Text>
        </View>
      </View>

      <View style={styles.orderSeparator} />
    </View>
  )
}

export default OrderField

const styles = StyleSheet.create({
  orderFields: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },

  labelContainer: {
    flex: 1,
  },

  colored: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },

  orderFieldsTitle: {
    fontWeight: 'bold',
  },

  orderSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 5,
  },
})
