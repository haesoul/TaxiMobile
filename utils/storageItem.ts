import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (name: string, value: string) => {
  await AsyncStorage.setItem(name, value);
};

export const getItem = async (name: string) => {
    return await AsyncStorage.getItem(name);
  };

export const removeItem = async (name: string) => {
    await AsyncStorage.removeItem(name);
};
    