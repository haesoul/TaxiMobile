// import shader from 'shader'
import Color from 'color';
import {
  parseAvailableModes,
  parseCalculationBenefits,
  parseCarClasses,
  parseEntries,
  parseLanguages,
  parseMoneyModes
} from './tools/parse';
import { PassengerOrderConfig } from './tools/siteConstants/formConfig';
import {
  EBookingCommentTypes,
  IBookingComment,
  IBookingLocationClass,
  ICarClass,
  ILanguage,
  IPaletteColor,
  IProfitEstimationConfig,
  TAvailableModes,
  TEntries,
  TMoneyModes,
} from './types/types';

import store, { IRootState } from './state';

import { List } from 'immutable';



const SITE_CONSTANTS_SECTION = 'site_constants'
const CURRENCIES_SECTION = 'currencies'
const ALL_TABS_AVAILABLE = '1;2;3=1,2,3,4,5,6;4;5;6;7;8;'

export enum EMapMode {
  OSM = 'OSM',
  GOOGLE = 'GOOGLE',
  YANDEX = 'YANDEX',
}

export enum EIconsPalettes {
  Default = 'default',
  GHA = 'GHA',
}

const defaultValues = {
  COURIER_CALL_RATE: 10,
  EXTRA_CHARGE_FOR_NIGHT_TIME: 2,
  COURIER_FARE_PER_1_KM: 2.5,
  START_OF_NIGHT_TIME: '20:00',
  END_OF_NIGHT_TIME: '5:00',
  ENABLE_CUSTOMER_PRICE: false,
  DEFAULT_PHONE_MASK: '+233(___)-___-___',
  MAP_MODE: EMapMode.OSM,
  OG_IMAGE: null,
  TW_IMAGE: null,
  WAITING_INTERVAL: 180,
  LIST_OF_CARGO_VALUATION_AMOUNTS: '50,-600,600',
  LIST_OF_MODES_USED: ALL_TABS_AVAILABLE,
  THE_LANGUAGE_OF_THE_SERVICE: '2',
  PASSENGER_ORDER_CONFIG: new PassengerOrderConfig(),
  DEFAULT_POSITION: '5.5560200,-0.1969000',
  SEARCH_RADIUS: 50,
  DEFAULT_COUNTRY: 'GHA',
  PALETTE: '#A90000;#ffc837',
  ICONS_PALETTE_FOLDER: EIconsPalettes.Default,
  MONEY_MODES: '',
  BIG_TRUCK_TRANSPORT_TYPES: '1-truck;2-wagon',
  BIG_TRUCK_CARGO_TYPES: '1-truck;2-wagon',
  CAR_CLASSES: {},
  BOOKING_COMMENTS: Object.fromEntries([
    ...new Array(7).fill(undefined).map((_, index) => [
      index + 1,
      { id: index + 1 },
    ]),
    [8, { id: 8, type: EBookingCommentTypes.Plane }],
  ]),
  // BOOKING_LOCATION_CLASSES: {},
  BOOKING_LOCATION_CLASSES: [] as IBookingLocationClass[] | List<IBookingLocationClass>,

  CALCULATION_BENEFITS: JSON.stringify({}),
  LANGUAGES: {
    1: { iso: 'ru', logo: 'ru', native: 'Русский' },
    2: { iso: 'en', logo: 'gb', native: 'English' },
    3: { iso: 'ar', logo: 'ma', native: 'العربية' },
    4: { iso: 'fr', logo: 'fr', native: 'Français' },
  },
} as const

class Constants {
  private globalData?: IRootState['global']['data'];

  init(globalData: any) {
    this.globalData = globalData;
    this.recalculate();
  }

  COURIER_CALL_RATE!: number
  EXTRA_CHARGE_FOR_NIGHT_TIME!: number
  COURIER_FARE_PER_1_KM!: number
  START_OF_NIGHT_TIME!: string
  END_OF_NIGHT_TIME!: string
  ENABLE_CUSTOMER_PRICE!: boolean
  DEFAULT_PHONE_MASK!: string
  MAP_MODE!: EMapMode
  OG_IMAGE!: string | null
  TW_IMAGE!: string | null
  WAITING_INTERVAL!: number
  LIST_OF_CARGO_VALUATION_AMOUNTS!: string
  LIST_OF_MODES_USED!: TAvailableModes
  THE_LANGUAGE_OF_THE_SERVICE!: string
  PASSENGER_ORDER_CONFIG!: PassengerOrderConfig
  DEFAULT_POSITION!: [number, number]
  SEARCH_RADIUS!: number
  DEFAULT_COUNTRY!: string
  PALETTE!: {
    primary: IPaletteColor,
    secondary: IPaletteColor,
  }
  ICONS_PALETTE_FOLDER!: EIconsPalettes
  MONEY_MODES!: TMoneyModes
  BIG_TRUCK_TRANSPORT_TYPES!: TEntries
  BIG_TRUCK_CARGO_TYPES!: TEntries
  CAR_CLASSES!: Record<ICarClass['id'], ICarClass>
  DEFAULT_CAR_CLASS!: ICarClass['id']
  BOOKING_COMMENTS!: Record<IBookingComment['id'], IBookingComment>
  BOOKING_LOCATION_CLASSES!: IBookingLocationClass[]
  DEFAULT_BOOKING_LOCATION_CLASS!: IBookingLocationClass['id']
  CALCULATION_BENEFITS!: Record<
    string, Record<
      ICarClass['id'], IProfitEstimationConfig
    >
  >
  LANGUAGES!: ILanguage[]

  constructor(globalData?: IRootState['global']['data']) {
    this.globalData = globalData;
    this.PASSENGER_ORDER_CONFIG = new PassengerOrderConfig();
  }
  

  recalculate() {
    this.CAR_CLASSES = parseCarClasses(
      this.globalData?.car_classes ?? defaultValues.CAR_CLASSES
    );

    this.LANGUAGES = parseLanguages(
      this.globalData?.langs || defaultValues.LANGUAGES
    );
    this.COURIER_CALL_RATE = getConstantValue('courier_call_rate', defaultValues.COURIER_CALL_RATE)
    this.EXTRA_CHARGE_FOR_NIGHT_TIME = getConstantValue('extra_charge_for_night_time', defaultValues.EXTRA_CHARGE_FOR_NIGHT_TIME)
    this.COURIER_FARE_PER_1_KM = getConstantValue('courier_fare_per_1_km', defaultValues.COURIER_CALL_RATE)
    this.START_OF_NIGHT_TIME = getConstantValue('start_of_night_time', defaultValues.START_OF_NIGHT_TIME)
    this.END_OF_NIGHT_TIME = getConstantValue('the_end_of_the_night_time', defaultValues.END_OF_NIGHT_TIME)
    this.ENABLE_CUSTOMER_PRICE = this.calc_ENABLE_CUSTOMER_PRICE()
    this.DEFAULT_PHONE_MASK = this.calc_DEFAULT_PHONE_MASK()
    this.MAP_MODE = getConstantValue('map_mode', defaultValues.MAP_MODE)
    this.OG_IMAGE = getConstantValue('og_image', defaultValues.OG_IMAGE)
    this.TW_IMAGE = getConstantValue('tw_image', defaultValues.TW_IMAGE)
    this.WAITING_INTERVAL = getConstantValue('waiting_interval', defaultValues.WAITING_INTERVAL)
    this.LIST_OF_CARGO_VALUATION_AMOUNTS = getConstantValue('list_of_cargo_valuation_amounts', defaultValues.LIST_OF_CARGO_VALUATION_AMOUNTS)
    this.LIST_OF_MODES_USED = getConstantValue(
      'list_of_modes_used',
      defaultValues.LIST_OF_MODES_USED,
      (value) => parseAvailableModes(value),
    )
    this.THE_LANGUAGE_OF_THE_SERVICE = getConstantValue('the_language_of_the_service', defaultValues.THE_LANGUAGE_OF_THE_SERVICE)
    this.DEFAULT_COUNTRY = getConstantValue('Country_service', defaultValues.DEFAULT_COUNTRY)
    this.PALETTE = getConstantValue(
      'palette',
      defaultValues.PALETTE,
      (value) => {
        const mainColors: [string, string] = value.split(';')

        return {
          primary: {
            main: mainColors[0],
            light: Color(mainColors[0]).lighten(0.5).hex(),
            dark: Color(mainColors[0]).darken(0.5).hex(),
          },
          secondary: {
            main: mainColors[1],
            light: Color(mainColors[1]).lighten(0.5).hex(),
            dark: Color(mainColors[1]).darken(0.5).hex(),
          },
        };
      },
    )
    this.DEFAULT_POSITION = getConstantValue(
      'geo_default',
      defaultValues.DEFAULT_POSITION,
      (value) => value.split(',').map(parseFloat),
    )
    this.SEARCH_RADIUS = getConstantValue(
      'radius_geo_name',
      defaultValues.SEARCH_RADIUS,
      parseInt,
    )
    this.PASSENGER_ORDER_CONFIG.apply(getConstantValue('passenger_order_config', ''))
    const countryService = getConstantValue('Country_service', undefined)
    this.ICONS_PALETTE_FOLDER =
      Object.values(EIconsPalettes).includes(countryService) ?
        countryService :
        defaultValues.ICONS_PALETTE_FOLDER
    this.MONEY_MODES = getConstantValue(
      'mode_money',
      defaultValues.MONEY_MODES,
      (value) => parseMoneyModes(value),
    )
    this.BIG_TRUCK_TRANSPORT_TYPES = getConstantValue(
      'type_of_transport',
      defaultValues.BIG_TRUCK_TRANSPORT_TYPES,
      parseEntries,
    )
    this.BIG_TRUCK_CARGO_TYPES = getConstantValue(
      'type_of_cargo',
      defaultValues.BIG_TRUCK_CARGO_TYPES,
      parseEntries,
    )

    this.DEFAULT_CAR_CLASS = Object.keys(this.CAR_CLASSES)?.[0] ?? '-1'
    // this.BOOKING_COMMENTS =
    // this.globalData.booking_comments ?? defaultValues.BOOKING_COMMENTS;
    // 
    // this.BOOKING_LOCATION_CLASSES =

    // this.globalData.booking_location_classes ?? defaultValues.BOOKING_LOCATION_CLASSES;
  
  
    this.globalData?.booking_comments ?? defaultValues.BOOKING_COMMENTS
    
    // this.globalData?.booking_location_classes ?? defaultValues.BOOKING_LOCATION_CLASSES

    // this.BOOKING_COMMENTS = globals.data?.booking_comments ?
    //   Object.fromEntries(
    //     Object.entries(defaultValues.BOOKING_COMMENTS)
    //       .filter(([id]) => id in globals.data.booking_comments),
    //   ) :
    //   defaultValues.BOOKING_COMMENTS
    // this.BOOKING_LOCATION_CLASSES = parseBookingLocationClasses(
    //   globals.data?.booking_location_classes ??
    //     defaultValues.BOOKING_LOCATION_CLASSES,
    // )
    // this.DEFAULT_BOOKING_LOCATION_CLASS =
    //   this.BOOKING_LOCATION_CLASSES[0]?.id ?? '-1'
    this.CALCULATION_BENEFITS = getConstantValue(
      'calculation_benefits',
      defaultValues.CALCULATION_BENEFITS,
      parseCalculationBenefits,
    )

    this.BOOKING_COMMENTS = this.globalData?.booking_comments ?? defaultValues.BOOKING_COMMENTS;




    this.BOOKING_LOCATION_CLASSES = List.isList(this.globalData?.booking_location_classes)
    ? (this.globalData.booking_location_classes.toArray() as IBookingLocationClass[])
    : (this.globalData?.booking_location_classes ?? []) as IBookingLocationClass[];

          
    this.DEFAULT_BOOKING_LOCATION_CLASS = this.BOOKING_LOCATION_CLASSES[0]?.id ?? '-1';

    // this.LANGUAGES = parseLanguages((globals.data?.langs || defaultValues.LANGUAGES))
    console.log('CONSTANTS LANGUAGES', this.LANGUAGES)
  }

  calc_ENABLE_CUSTOMER_PRICE() {
    const _value = getConstantValue('customer_price', 'N')

    return _value === 'Y'
  }

  calc_DEFAULT_PHONE_MASK() {
    return getConstantValue('def_maska_tel', defaultValues.DEFAULT_PHONE_MASK)
  }
}

class Currency {
  NAME: string
  SIGN: string

  constructor() {
    this.NAME = 'RUB'
    this.SIGN = '₽'
  }



  recalculated() {
    const data = store.getState().global.data;
    this.NAME = getConstantValue('currency_of_the_service', 'RUB');
    const _currency = data?.[CURRENCIES_SECTION]?.[this.NAME];
    this.SIGN = _currency?.abbr ?? '₽';
  }
  getCurrency(key: string) {
    const data = store.getState().global.data;

  
    return data?.[CURRENCIES_SECTION]?.[key] ?? null;
  }
  
}

export const CURRENCY = new Currency()

export const getConstantValue = <T = any>(key: string | number, defaultValue: T, converter?: (value: any) => any) => {
  const _data = store.getState().global.data;

  const value = (
    _data &&
    _data[SITE_CONSTANTS_SECTION] &&
    _data[SITE_CONSTANTS_SECTION][key] &&
    _data[SITE_CONSTANTS_SECTION][key].value
  ) ?? defaultValue;

  return converter ? converter(value) : value;
}


const SITE_CONSTANTS: any = new Constants()


export default SITE_CONSTANTS


export function getApiConstants() {
  const state = store?.getState?.();
  return state?.global?.data ?? {};
}

