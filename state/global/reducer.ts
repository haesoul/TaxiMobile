import { IBookingComment, IBookingLocationClass } from '@/types/types';
import Immutable, { Record as ImmutableRecord } from 'immutable';
import { TAction } from '../../types';
// Типы состояния
interface ILangItem {
  iso: string;
  logo: string;
  native: string;
  ru?: string;
  en?: string;
  es?: string;
}

export interface IGlobalsState {

  data: {
    langs: { [key: number]: ILangItem };
    site_constants: { [key: string]: any };
    car_classes: Record<string, any>;
    currencies: Record<string, { abbr: string; name: string }>
    booking_comments: Record<number, IBookingComment>;
    booking_location_classes: IBookingLocationClass[] | Immutable.List<IBookingLocationClass>

    lang_vls: Record<string, any>
    [key: string]: any;
  };
  preloader: { [key: string]: any };
  config: { [key: string]: any };

  location : Record<string, any>;

  
  version: string;
  default_lang: number;
  default_currency: string;
  default_country: string;
  default_profile: string
}


export const GlobalsRecord = ImmutableRecord<IGlobalsState>({
  data: {
    langs: {
      1: { iso: 'ru', logo: 'ru', native: 'Русский' },
      2: { iso: 'en', logo: 'gb', native: 'English' },
      3: { iso: 'ar', logo: 'ma', native: 'العربية' },
      4: { iso: 'fr', logo: 'fr', native: 'Français' },
    },
    site_constants: {},

    car_classes: {},
    currencies: {},
    booking_comments: {},
    booking_location_classes: [],
    lang_vls: {}
  },
  preloader: {},
  config: {},
  location: {},
  version: "1763307004.992621898651123046875_1498c51b583f5b6d8184ec47f9f36e47_908d2bbb_413254",
  default_lang: 2,
  default_currency: "GHS",
  default_country: "ma",
  default_profile: "",
  
});




export const ActionTypes = {
  SET_CONFIG: 'GLOBALS/SET_CONFIG',
  SET_SITE_CONSTANTS: 'GLOBALS/SET_SITE_CONSTANTS',
  SET_LANGS: 'GLOBALS/SET_LANGS',
  SET_PRELOADER: 'GLOBALS/SET_PRELOADER',
  SET_GLOBAL_DATA: 'GLOBALS/SET_GLOBAL_DATA',
};


export default function reducer(state = new GlobalsRecord(), action: TAction) {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.SET_CONFIG:
      return state.set('config', payload);

    case ActionTypes.SET_SITE_CONSTANTS:
      return state.setIn(['data', 'site_constants'], payload);

    case ActionTypes.SET_LANGS:
      return state.setIn(['data', 'langs'], payload);

    case ActionTypes.SET_PRELOADER:
      return state.set('preloader', payload);
      

    case ActionTypes.SET_GLOBAL_DATA:
      return state.update('data', (data: any) => ({ ...data, ...payload }));
    
   

    default:
      return state;
  }
}


export const setConfig = (payload: { [key: string]: any }) => ({
  type: ActionTypes.SET_CONFIG,
  payload,
});

export const setSiteConstants = (payload: { [key: string]: any }) => ({
  type: ActionTypes.SET_SITE_CONSTANTS,
  payload,
});

export const setLangs = (payload: { [key: number]: ILangItem }) => ({
  type: ActionTypes.SET_LANGS,
  payload,
});

export const setPreloader = (payload: { [key: string]: any }) => ({
  type: ActionTypes.SET_PRELOADER,
  payload,
});
export const setGlobalData = (payload: Record<string, any>) => ({
  type: ActionTypes.SET_GLOBAL_DATA,
  payload,
});


