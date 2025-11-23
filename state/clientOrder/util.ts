import { Dispatch } from '@reduxjs/toolkit';
import SITE_CONSTANTS from '../../siteConstants';
import { getItem } from '../../tools/localStorage';
import { IPolygon } from '../../types/polygon';
import {
  EBookingLocationKinds, IBookingLocationClass,
  ICarClass,
} from '../../types/types';
import { ActionTypes } from './constants';


export function polygonsLocationClasses(
  fromPolygons: IPolygon['id'][],
  toPolygons: IPolygon['id'][],
): IBookingLocationClass[] {
  const fromPolygonsSet = new Set(fromPolygons)
  const isCity = toPolygons.some(id => fromPolygonsSet.has(id))
  return SITE_CONSTANTS.BOOKING_LOCATION_CLASSES.filter(({ kind }: any) =>
    isCity ?
      kind === EBookingLocationKinds.City :
      kind !== EBookingLocationKinds.City,
  )
}

export function availableCarClasses(
  availableLocationClasses: IBookingLocationClass[],
): ICarClass[] {
  const ids = new Set(availableLocationClasses.map(({ id }) => id))
  // return Object.values(SITE_CONSTANTS.CAR_CLASSES).filter(cc =>
  //   cc.booking_location_classes === null ||
  //   cc.booking_location_classes.some((id: any) => ids.has(id)),
  // ) as ICarClass[]

  return (Object.values(SITE_CONSTANTS.CAR_CLASSES) as ICarClass[]).filter(cc =>
    cc.booking_location_classes === null ||
    cc.booking_location_classes.some(id => ids.has(id)),
  )
  
}

export function maxAvailableSeats(
  availableCarClasses: ICarClass[],
): number {
  let value = 1
  for (const carClass of availableCarClasses)
    if (carClass.seats > value)
      value = carClass.seats
  return value
}




export const loadSavedState = () => async (dispatch: Dispatch) => {
  // 1. Загрузка данных
  const from = await getItem('state.clientOrder.from', null);
  const to = await getItem('state.clientOrder.to', null);
  const time = await getItem('state.clientOrder.time', 'now');
  const phone = await getItem('state.clientOrder.phone', null);
  const customerPrice = await getItem('state.clientOrder.customerPrice', null);
  
  // 2. Отправка синхронных действий для обновления состояния
  if (from !== null) {
    dispatch({ type: ActionTypes.SET_FROM, payload: from });
  }
  if (to !== null) {
    dispatch({ type: ActionTypes.SET_TO, payload: to });
  }
  dispatch({ type: ActionTypes.SET_TIME, payload: time });
  dispatch({ type: ActionTypes.SET_PHONE, payload: phone });
  if (customerPrice !== null) {
    dispatch({ type: ActionTypes.SET_CUSTOMER_PRICE, payload: customerPrice });
  }
};