import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import Block from '../Block'

interface ISettings {
  blocks?: Array<Record<string, any>>
}

interface IProps {
  form: UseFormReturn<any>
  values: Record<string, any>
  settings: ISettings
  [key: string]: any;
}

const ConstructorTab: React.FC<IProps> = ({ form, values, settings }) => {
  return (
    <View style={styles.container}>
      {settings.blocks?.map((item, idx) => (
        <Block
          key={item.id ?? item.name ?? idx}
          form={form}
          values={values}
          {...item}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    paddingVertical: 8,
  },
})

export default ConstructorTab
