
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Record } from 'immutable';
import SITE_CONSTANTS from '../../defaultValues';
import { TAction } from '../../types';
import { EStatuses, ILanguage } from '../../types/types';
import { ActionTypes, IConfigState } from './constants';




// export const record = Record<IConfigState>({
//   status: EStatuses.Loading,
//   language: SITE_CONSTANTS.LANGUAGES?.find(
//     (i: any) => i.id.toString() === SITE_CONSTANTS.THE_LANGUAGE_OF_THE_SERVICE,
//   ) as ILanguage,
// })

export const record = Record<IConfigState>({
  status: EStatuses.Loading,

  language: Object.values(SITE_CONSTANTS.LANGUAGES).find(
    (i: ILanguage) => i.id?.toString() === SITE_CONSTANTS.THE_LANGUAGE_OF_THE_SERVICE,
  ) as ILanguage,
});
export default function reducer(state = new record(), action: TAction) {
  const { type, payload } = action

  switch (type) {
    case ActionTypes.CHECK_CONFIG_START:
      return state
        .set('status', EStatuses.Loading)
    case ActionTypes.CHECK_CONFIG_SUCCESS:
      return state
        .set('status', EStatuses.Success)
    case ActionTypes.CHECK_CONFIG_FAIL:
      return state
        .set('status', EStatuses.Fail)

    case ActionTypes.SET_CONFIG_SUCCESS:
      return state
        .set('status', EStatuses.Success)
    case ActionTypes.SET_CONFIG_FAIL:
      return state
        .set('status', EStatuses.Fail)

    // case ActionTypes.SET_LANGUAGE:
    //   console.log('Setting language in reducer:', payload)
    //   return state
    //     .set('language', payload)
    case ActionTypes.SET_LANGUAGE:
      AsyncStorage.setItem('user_lang', JSON.stringify(payload))
      return state.set('language', payload);
    

    default:
      return state
  }
}