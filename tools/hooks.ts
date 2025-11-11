import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { DeepPartial, FieldValues, Path, PathValue, useWatch, UseWatchProps } from 'react-hook-form';

const cacheValue = async (value: any, parentObjectKey: string, valueKey: string, callback: Function) => {
  try {
    if (parentObjectKey) {
      // const localStorageObject = localStorage.getItem(parentObjectKey)
      const localStorageObject = await AsyncStorage.getItem(parentObjectKey)
      const object = localStorageObject ? JSON.parse(localStorageObject) : {}
      await AsyncStorage.setItem(parentObjectKey, JSON.stringify({ ...object, [valueKey]: value }))
    } else {
      await AsyncStorage.setItem(valueKey, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Error occured at cacheValue(${value}, ${parentObjectKey}, ${valueKey})`, error)

  }

  callback(value)
}

interface IAdditionalDataFlags {
  dirty?: boolean,
  previousValue?: boolean
}
interface IAdditionalData {
  dirty?: boolean,
  previousValue?: any
}
/**
 * Works like useState, but also caches value at localStorage
 * @param key localStorage access key. It should follow the format ${objectKey}.${valueKey} or just ${valueKey}
 * @param defaultValue default value will be used if cached value is not found or some error occured
 * @param allowableValues list of allowable values for cached value.
 * @param additionalData object containing data about additional field data passed to return. Do not change at runtime!
 *  If allowableValues does not includes cached value, defaultValue is used
 */
export const useCachedState = <T>(
  key: string,
  defaultValue?: T,
  allowableValues?: T[],
  additionalData: IAdditionalDataFlags = {},
): [T, React.Dispatch<React.SetStateAction<T>>, IAdditionalData] => {
  
  const _defaultValue = (defaultValue || (allowableValues && allowableValues[0])) as T

  const [dirty, setDirty] = useState<boolean>(false)
  const [value, setValue] = useState(_defaultValue)
  const previousValue = usePrevious<T>(value)
  const splittedKey = key.split('.')
  let valueKey: string, parentObjectKey: string

  

  if (splittedKey.length === 1) valueKey = splittedKey[0]
  else {
    parentObjectKey = splittedKey[0]
    valueKey = splittedKey[1]
  }



  useEffect(() => {
    const loadValue = async () => {
      let value
      try {
        if (parentObjectKey) {
          const item = await AsyncStorage.getItem(parentObjectKey)
          const obj = item ? JSON.parse(item) : {}
          value = obj[valueKey] ?? _defaultValue
        } else {
          const item = await AsyncStorage.getItem(valueKey)
          value = item ? JSON.parse(item) : _defaultValue
        }
      } catch {
        value = _defaultValue
      }
      setValue(value)
    }
    loadValue()
  }, [])
  

  useEffect(() => {
    if (additionalData.dirty && !dirty && previousValue !== null && !_.isEqual(value, previousValue)) {
      setDirty(true)
    }
  }, [value, dirty, previousValue, additionalData.dirty, setDirty])

  return [
    value,
    (v) => cacheValue(typeof v === 'function' ? (v as Function)(value) : v, parentObjectKey, valueKey, setValue),
    {
      dirty,
      previousValue,
    },
  ]
}

/** Returns value before update */
export const usePrevious = <T = any>(value: T) => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}




type WatchValuesType = Record<string, any>

export function useWatchWithEffect<TFieldValues extends FieldValues>(
  props: Partial<UseWatchProps<TFieldValues> & { name: undefined }>,
  callback: (values: WatchValuesType, previousValues: WatchValuesType | undefined) => void,
): TFieldValues;


export function useWatchWithEffect<TFieldValues extends FieldValues, TName extends ReadonlyArray<Path<TFieldValues>>>(
  props: Partial<UseWatchProps<TFieldValues>> & { name: TName },
  callback: (values: WatchValuesType, previousValues: WatchValuesType | undefined) => void,
): DeepPartial<TFieldValues>;


export function useWatchWithEffect<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
  props: Partial<UseWatchProps<TFieldValues>> & { name: TName },
  callback: (values: WatchValuesType, previousValues: WatchValuesType | undefined) => void,
): PathValue<TFieldValues, TName>;


export function useWatchWithEffect<TFieldValues extends FieldValues>(
  props: Partial<UseWatchProps<TFieldValues>>,
  callback: (values: WatchValuesType, previousValues: WatchValuesType | undefined) => void,
) {

  const values = useWatch(props as any);


  const previousValues = usePrevious<WatchValuesType>(values as WatchValuesType);

  const previousValuesAdapted = previousValues === null ? undefined : previousValues;
  useEffect(() => {
    if (previousValuesAdapted !== undefined && !_.isEqual(values, previousValuesAdapted)) {
      callback(values as WatchValuesType, previousValuesAdapted);
    }
  }, [values, previousValuesAdapted, callback, ]); 

  return values;
}
export const useInterval = (callback: Function, delay: number, immediately?: boolean) => {
  const savedCallback = useRef<Function>(null)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }
    if (delay !== null) {
      immediately && tick()
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

// export const useQuery = () => {
//   return Object.fromEntries(new URLSearchParams(useLocation().search).entries())
// }
type QueryParams = Record<string, string | string[] | undefined>;

export const useQuery = <T extends QueryParams = QueryParams>() => {
  const params = useLocalSearchParams() as T; 
  return params;
};
export const useVisibility = (defaultValue: boolean = false): [boolean, () => void] => {
  const [visible, setVisible] = React.useState(defaultValue)

  const toggleVisibility = () => setVisible(!visible)

  return [visible, toggleVisibility]
}