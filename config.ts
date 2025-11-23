import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getCacheVersion } from './API/cacheVersion';
import { DEFAULT_CONFIG_NAME } from './constants';
import store from './state';
import { setConfigError, setConfigLoaded } from './state/config/actionCreators';
import { setConfig, setGlobalData } from './state/global/reducer';

export function getCacheVersionLazy(url: string) {
  const { getCacheVersion } = require('./API/cacheVersion');
  return getCacheVersion(url);
}

let _configName: string = '';
interface ConfigData {
  version: string
  default_lang: number
  default_currency: string
  default_country: string
  default_profile: string
  data: any
}
export const applyConfigName = async (url: string, name?: string) => {
  
  const _name = name ? `data_${name}.json` : 'data.json'

  try {
    const ver = await getCacheVersionLazy(url)
    
    // const fullUrl = `https://ibronevik.ru/taxi/cache/${_name}?ver=${ver}`
    const fullUrl = `https://ibronevik.ru/taxi/cache/data.json`
    const response = await fetch(fullUrl)
    console.warn('ERROR')
    if (!response.ok) {
      console.warn(`Fetch failed with status ${response.status}, using cached config`);
      const cached = await AsyncStorage.getItem("config_cached");
      if (cached) return JSON.parse(cached);
      throw new Error(`Network error: ${response.status}`);
    }
    

    const json: ConfigData = await response.json()
    const config = json.data
    await AsyncStorage.setItem("config_cached", JSON.stringify(config));

    store.dispatch(setGlobalData(config))
    store.dispatch(setConfigLoaded())

    const state = await store.getState();
    const dataKeys = Object.keys(state.global.data);
    console.warn('Keys in globals.data after Redux update:', dataKeys);

  } catch (err) {
    console.error('Failed to load config', err)
    store.dispatch(setConfigError())

    const configString = await AsyncStorage.getItem("config_cached");

    if (configString !== null) {
      try {
        const config = JSON.parse(configString);
        store.dispatch(setConfig(config));
      } catch (e) {
        console.warn("Invalid JSON in config_cached", e);
      }
    }
    
    store.dispatch(setConfigLoaded())
  }
}

class Config {
  constructor() {

    // this.init();
  }

  public async init() {
    const savedConfig = await AsyncStorage.getItem('config');
    if (savedConfig) {
      _configName = savedConfig;
      await applyConfigName(this.API_URL, savedConfig);
    } else {
      this.setDefaultName();
    }
  }

  async setConfig(name: string) {
    await AsyncStorage.setItem('config', name)
    _configName = name
    await applyConfigName(this.API_URL, name)
  }

  async clearConfig() {
    await AsyncStorage?.removeItem('config')
    _configName = ''
    await applyConfigName(this.API_URL)
  }

  setDefaultName() {
    applyConfigName(this.API_URL)
  }

  get API_URL() {
    return `${this.SERVER_URL}/api/v1`
  }

  get SERVER_URL() {
    return `https://ibronevik.ru/taxi/c/${_configName || DEFAULT_CONFIG_NAME}`
  }

  async getSavedConfig(): Promise<string | null> {
    return await AsyncStorage.getItem('config');
  }
  
}

const config = new Config()

export default config