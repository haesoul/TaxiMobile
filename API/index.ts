import axios from 'axios'
import { Buffer } from 'buffer'
import * as FileSystem from 'expo-file-system/legacy'
import * as Location from 'expo-location'
import Mime from 'mime'
import Config from '../config'
import SITE_CONSTANTS from '../siteConstants'
import store from '../state'
import { configSelectors } from '../state/config'
import { userSelectors } from '../state/user'
import {
  addToFormData, apiMethod, IApiMethodArguments, IResponseFields,
} from '../tools/api'
import { convertTrip, reverseConvertTrip } from '../tools/convert'
import getCountryISO3 from '../tools/countryISO2To3'
import { getBase64, getHints } from '../tools/utils'
import { Stringify, ValueOf } from '../types'
import {
  EOrderTypes,
  ESuggestionType,
  IAddressPoint,
  IBookingCoordinatesLatitude,
  IBookingCoordinatesLongitude,
  IOrder,
  IPlaceResponse,
  IRouteInfo,
  ISuggestion,
  ITrip,
} from '../types/types'
import { getCacheVersion } from './cacheVersion'
import { EBookingActions } from './constants'

export {
  googleLogin, login, logout, register,
  remindPassword, whatsappSignUp
} from './auth'
export {
  createCar,
  createUserCar, driveCar, editCar, getCar,
  getCars, getUserCar, getUserCars, getUserDrivenCar
} from './car'
export {
  cancelDrive, chooseCandidate, editOrder, getOrder, getOrders, postDrive, setOrderRating, setOrderState, setWaitingTime, takeOrder
} from './order'
export {
  getPolygonsIdsOnPoint
} from './polygon'
export {
  editUser,
  editUserAfterRegister, getAuthorizedUser, getUser,
  getUsers
} from './user'
export {
  getArea, getAreasIdsBetweenPoints
} from './way'
export { EBookingActions, getCacheVersion }

const _uploadFile = async (
  { formData }: IApiMethodArguments,
  data: any,
): Promise<{
  dl_id: string
} | null> => {
  return getBase64(data.file)
    .then(base64 => {
      addToFormData(formData, {
        token: data.token,
        u_hash: data.u_hash,
        file: JSON.stringify({ base64, u_id: data.u_id }),
        private: 0,
      })
      return formData
    })
    .then(form => axios.post(`${Config.API_URL}/dropbox/file`, form))
    .then(res => ({ ...res, dl_id: res?.data?.data?.dl_id }))
}

export const uploadFile = apiMethod<typeof _uploadFile>(_uploadFile, { authRequired: false })

const _checkRefCode = (
  { formData }: IApiMethodArguments,
  ref_code: string,
): Promise<boolean> => {
  return axios.get(`${Config.API_URL}/referral/code/${ref_code}/check`)
    .then(res => {
      return res.data?.data?.ref_code_free || false
    })
}

export const checkRefCode = apiMethod<typeof _checkRefCode>(_checkRefCode, { authRequired: false })

const _checkConfig = (
  { formData }: IApiMethodArguments,
  config: string,
): Promise<any> => {
  return axios.get(`${Config.API_URL}`, { params: { config } })
}
export const checkConfig = apiMethod<typeof _checkConfig>(_checkConfig, { authRequired: false })

const _postTrip = (
  { formData }: IApiMethodArguments,
  data: ITrip,
): Promise<IResponseFields & {
    t_id: ITrip['t_id'],
}> => {
  addToFormData(formData, {
    data: JSON.stringify(reverseConvertTrip(data)),
  })

  return axios.post(`${Config.API_URL}/trip`, formData)
    .then(res => res.data)
}
export const postTrip = apiMethod<typeof _postTrip>(_postTrip)

const _getTrips = (
  { formData }: IApiMethodArguments,
  type: EOrderTypes = EOrderTypes.Active,
): Promise<IOrder[]> => {
  addToFormData(formData, {
    array_type: 'list',
  })

  return axios.post(`${Config.API_URL}/trip`, formData)
    .then(res => res.data)
    .then(res =>
      res.data.trip || [],
    )
    .then(res => res.map((item: any) => convertTrip(item)))
    .then(res =>
      res.sort(
        (a: IOrder, b: IOrder) => a.b_start_datetime < b.b_start_datetime ? 1 : -1,
      ),
    )
}
export const getTrips = apiMethod<typeof _getTrips>(_getTrips)

const _getWashTrips = (
  { formData }: IApiMethodArguments,
  type: EOrderTypes = EOrderTypes.Active,
): Promise<IOrder[]> => {
  addToFormData(formData, {
    array_type: 'list',
  })

  return axios.post(`${Config.API_URL}/trip/get`, formData)
    .then(res => res.data)
    .then(res =>
      res.data.trip || [],
    )
    .then(res => res.map((item: any) => convertTrip(item)))
    .then(res =>
      res.sort(
        (a: IOrder, b: IOrder) => a.b_start_datetime < b.b_start_datetime ? 1 : -1,
      ),
    )
}
export const getWashTrips = apiMethod<typeof _getWashTrips>(_getWashTrips, { authRequired: false })

const _getImageBlob = async (
  { formData }: IApiMethodArguments,
  id: number,
): Promise<[number, string]> => {
  const response = await axios.post(`${Config.API_URL}/dropbox/file/${id}`, formData, {
    responseType: 'arraybuffer',
  });

  const fileUri = `${FileSystem.cacheDirectory}file_${id}`;
  const base64 = Buffer.from(response.data, 'binary').toString('base64');

  await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

  return [id, fileUri];
};

export const getImageBlob = apiMethod<typeof _getImageBlob>(_getImageBlob);

const _getImageFile = async (
  { formData }: IApiMethodArguments,
  id: number,
): Promise<[number, { uri: string; name: string; type: string }]> => {
  const { data } = await axios.post(`${Config.API_URL}/dropbox/file/${id}`, formData, {
    responseType: 'arraybuffer',
  });

  const fileUri = `${FileSystem.cacheDirectory}${id}`;
  await FileSystem.writeAsStringAsync(fileUri, Buffer.from(data).toString('base64'), {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  const mimeType = Mime.getType(fileUri) || 'application/octet-stream';
  return [id, { uri: fileUri, name: `${id}`, type: mimeType }];
};

export const getImageFile = apiMethod<typeof _getImageFile>(_getImageFile)

const _setOutDrive = (
  { formData }: IApiMethodArguments,
  isFinished: boolean,
  addresses?: {
    fromAddress?: string,
    fromLatitude?: string,
    fromLongitude?: string,
    toAddress?: string,
    toLatitude?: string,
    toLongitude?: string,
  },
  passengers?: IOrder['b_passengers_count'],
): Promise<IResponseFields> => {
  addToFormData(formData, {
    'data': JSON.stringify(
      isFinished ?
        {
          out_drive: '0',
        } :
        {
          out_drive: '1',
          out_s_address: addresses?.fromAddress,
          out_s_latitude: addresses?.fromLatitude?.toString(),
          out_s_longitude: addresses?.fromLongitude?.toString(),
          out_address: addresses?.toAddress,
          out_latitude: addresses?.toLatitude?.toString(),
          out_longitude: addresses?.toLongitude?.toString(),
          out_passengers: passengers,
        },
    ),
  })

  return axios.post(`${Config.API_URL}/user`, formData)
    .then(res => res.data)
}
export const setOutDrive = apiMethod<typeof _setOutDrive>(_setOutDrive)

export const reverseGeocode = (
  lat: ValueOf<Stringify<IBookingCoordinatesLatitude>>,
  lng: ValueOf<Stringify<IBookingCoordinatesLongitude>>,
  { details = true }: {
    details?: boolean
  } = {},
): Promise<IPlaceResponse> => {
  const language = configSelectors.language(store.getState())

  return axios.get(
    'https://nominatim.openstreetmap.org/reverse',
    {
      params: {
        lat,
        lon: lng,
        addressdetails: +details,
        format: 'json',
        'accept-language': language.iso,
      },
    },
  )
    .then(res => res.data)
}

export const geocode = (
  query: string,
  { details = false }: {
    details?: boolean
  } = {},
): Promise<IPlaceResponse | null> => {
  const language = configSelectors.language(store.getState())

  return axios.get(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        q: query,
        addressdetails: +details,
        limit: 1,
        format: 'json',
        'accept-language': language.iso,
      },
    },
  )
    .then(res =>
      res.data[0] &&
            ({ ...res.data[0], lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon) }),
    )
}

const orsToken = '5b3ce3597851110001cf6248b6254554dbfc488a8585d67081a4000f'

export const makeRoutePoints = (from: IAddressPoint, to: IAddressPoint): Promise<IRouteInfo> => {
  const convertPoint = (point: IAddressPoint) => `${point.longitude},${point.latitude}`

  return axios.get(
    'https://api.openrouteservice.org/v2/directions/driving-car',
    {
      params: {
        api_key: orsToken,
        start: convertPoint(from),
        end: convertPoint(to),
      },
    },
  )
    .then(res => res.data)
    .then(res => {
      const hours = Math.floor(res.features[0].properties.summary.duration / (60 * 60))
      const minutes = Math.round((res.features[0].properties.summary.duration - (hours * 60 * 60)) / 60)
      return {
        distance: parseFloat((res.features[0].properties.summary.distance / 1000).toFixed(2)),
        time: {
          hours,
          minutes,
        },
        points: res.features[0].geometry
          .coordinates.map((item: [number, number]) => [item[1], item[0]]),
      }
    })
}

export const notifyPosition = (point: IAddressPoint) => {
  const userID = userSelectors.user(store.getState())?.u_id

  axios.post('https://jecat.ru/car_api/api/notifypos.php', {
    driver: userID,
    lat: point.latitude,
    lon: point.longitude,
    time: new Date().getTime() / 1000,
  })
}



export const getPointSuggestions = async (
  targetString?: string,
  isIntercity?: boolean
): Promise<ISuggestion[]> => {
  const commonSuggestions: ISuggestion[] =
    getHints(targetString)
      .map(item => ({
        type: ESuggestionType.PointUserTop,
        point: { address: item },
      }))
      .concat(
        getHints(targetString).map(item => ({
          type: ESuggestionType.PointUnofficial,
          point: { address: item },
        }))
      );

  if (!targetString) return commonSuggestions;

  try {
    const language = configSelectors.language(store.getState());

    SITE_CONSTANTS.init(store.getState().global.data);
    
    let coords: [number, number] = SITE_CONSTANTS.DEFAULT_POSITION;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        coords = [location.coords.latitude, location.coords.longitude];
      }
    } catch (err) {
      console.warn('Location error, using default coords', err);
    }

    // Определяем страну для интерсити
    let country: string | undefined;
    if (isIntercity) {
      try {
        const geo = await reverseGeocode(coords[0].toString(), coords[1].toString());
        country = getCountryISO3(geo.address.country_code) || SITE_CONSTANTS.DEFAULT_COUNTRY;
      } catch {
        country = SITE_CONSTANTS.DEFAULT_COUNTRY;
      }
    }

    // Запрос официальных подсказок
    const officialSuggestions = await axios.get(
      'https://geocode.search.hereapi.com/v1/autosuggest',
      {
        params: {
          q: targetString,
          at: isIntercity ? `${coords[0]},${coords[1]}` : undefined,
          in: isIntercity
            ? `countryCode:${country}`
            : `circle:${coords};r=${SITE_CONSTANTS.SEARCH_RADIUS * 1000}`,
          apiKey: 'cBumVVL0YkHvynJZNIL3SRtUfgxnEtPpXhvUVcE6Uh0',
          lang: language.iso,
          limit: 3,
        },
      }
    ).then(res => res.data);

    const official: ISuggestion[] = officialSuggestions.items
      ?.map((item: any) => {
        if (item.position) {
          return {
            type: ESuggestionType.PointOfficial,
            point: {
              latitude: item.position.lat,
              longitude: item.position.lng,
              address: item.address.label,
            },
            distance: item.distance,
          };
        }
        return null;
      })
      .filter((item: ISuggestion | null): item is ISuggestion => item !== null) || [];

    return [...commonSuggestions, ...official];
  } catch (error) {
    console.error(error);
    return commonSuggestions;
  }
};

export const activateChatServer = () => {
  return axios.get('https://chat.itest24.com/wschat/checksrv.php', {
    params: {
      s: 1,
    },
  }).catch(error => console.error(error))
}
