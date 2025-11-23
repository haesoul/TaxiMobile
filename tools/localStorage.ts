

import AsyncStorage from "@react-native-async-storage/async-storage"


export async function getItem<T>(
  key: string,
  defaultValue?: T,
  allowableValues?: T[],
): Promise<T> {
  defaultValue = (
    defaultValue === undefined ?
      allowableValues && allowableValues[0] :
      defaultValue
  ) as T
  let value
  try {
    value = await AsyncStorage.getItem(key)
    value = value !== null ? JSON.parse(value) : defaultValue
  } catch (error) {
    console.error(`Error occured at getItem(${key})`, error)
    value = defaultValue
  }
  return allowableValues ?
    allowableValues.includes(value) ?
      value :
      defaultValue :
    value ?? defaultValue
}

export async function setItem<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error occured at setItem(${key}, ${value})`, error)
  }
}

export async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Error occured at removeItem(${key})`, error)
  }
}