import { IBookingComment, IBookingLocationClass } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const moduleName = 'global' as const

export interface LangItem {
  iso: string;
  logo: string;
  native: string;
}

export interface GlobalsSlice {
  data: {
    langs: Record<number, LangItem>;
    site_constants: Record<string, any>;
    car_classes: Record<string, any>;
    currencies: Record<string, { abbr: string; name: string }>
    booking_comments: Record<number, IBookingComment>;
    booking_location_classes: IBookingLocationClass[];
    lang_vls: Record<string, any>
    [key: string]: any;
  };
 
  
  preloader: Record<string, any>;

  config: Record<string, any>;
  location : Record<string, any>;
  
}

const initialState: GlobalsSlice = {
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
  location: {}
 
};

export const globalsSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<Record<string, any>>) {
      state.config = action.payload;
    },

    setSiteConstants(state, action: PayloadAction<Record<string, any>>) {
      state.data.site_constants = action.payload;
    },

    setLangs(state, action: PayloadAction<Record<number, LangItem>>) {
      state.data.langs = action.payload;
    },

    setPreloader(state, action: PayloadAction<Record<string, any>>) {
      state.preloader = action.payload;
    },
    setLocation(state, action: PayloadAction<Record<string, any>>) {
      state.location = action.payload;
    },
    
  },
});

export const {
  setConfig,
  setSiteConstants,
  setLangs,
  setPreloader,
} = globalsSlice.actions;

export default globalsSlice.reducer;
