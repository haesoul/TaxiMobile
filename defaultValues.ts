
// Это есть в siteConstants.ts, но если использовать defaultValues оттуда, то выходит цикл:
//Require cycle: state/index.ts -> state/rootReducer.ts -> state/clientOrder/reducer.ts -> siteConstants.ts -> state/index.ts




import { PassengerOrderConfig } from './tools/siteConstants/formConfig';
import {
  EBookingCommentTypes,
  IBookingLocationClass,
  ICarClass,
  ILanguage
} from './types/types';

export enum EMapMode {
  OSM = 'OSM',
  GOOGLE = 'GOOGLE',
  YANDEX = 'YANDEX',
}

export enum EIconsPalettes {
  Default = 'default',
  GHA = 'GHA',
}

const ALL_TABS_AVAILABLE = '1;2;3=1,2,3,4,5,6;4;5;6;7;8;';

const DEFAULTS = {
  COURIER_CALL_RATE: 10,
  EXTRA_CHARGE_FOR_NIGHT_TIME: 2,
  COURIER_FARE_PER_1_KM: 2.5,
  START_OF_NIGHT_TIME: '20:00',
  END_OF_NIGHT_TIME: '5:00',
  ENABLE_CUSTOMER_PRICE: false,
  DEFAULT_PHONE_MASK: '+233(___)-___-___',
  MAP_MODE: EMapMode.OSM,
  OG_IMAGE: null as string | null,
  TW_IMAGE: null as string | null,
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
  CAR_CLASSES: {} as Record<ICarClass['id'], ICarClass>,
  BOOKING_COMMENTS: Object.fromEntries([
    ...new Array(7).fill(undefined).map((_, index) => [
      index + 1,
      { id: index + 1 },
    ]),
    [8, { id: 8, type: EBookingCommentTypes.Plane }],
  ]),
  BOOKING_LOCATION_CLASSES: [] as IBookingLocationClass[],

  CALCULATION_BENEFITS: JSON.stringify({}),
  LANGUAGES: {
    1: { iso: 'ru', logo: 'ru', native: 'Русский' } as ILanguage,
    2: { iso: 'en', logo: 'gb', native: 'English' } as ILanguage,
    3: { iso: 'ar', logo: 'ma', native: 'العربية' } as ILanguage,
    4: { iso: 'fr', logo: 'fr', native: 'Français' } as ILanguage,
  },
  DEFAULT_CAR_CLASS: '-1',
  DEFAULT_BOOKING_LOCATION_CLASS: '-1',
};
export default DEFAULTS

