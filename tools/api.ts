import state from '../state'
import { userSelectors } from '../state/user'
import { ParametersExceptFirst } from '../types'

export interface IApiMethodArguments {
  token: string,
  uHash: string,
  formData: FormData
}

interface apiMethodOptions {
  authRequired?: boolean
}

export const apiMethod = <T extends (...args: any[]) => any>(
  method: T,
  {
    authRequired = true,
  }: apiMethodOptions = {},
) => {
  return (...args: ParametersExceptFirst<T>): ReturnType<T> => {
    const formData = new FormData()
    let tokens

    if (authRequired) {
      tokens = userSelectors.tokens(state.getState())
      if (!tokens) {
        console.error('Auth failed for API call')
        return Promise.reject(new Error('Unauthorized user')) as ReturnType<T>
      }

      formData.append('token', tokens.token)
      formData.append('u_hash', tokens.u_hash)
    }

    const parameters = [
      {
        token: tokens?.token,
        u_hash: tokens?.u_hash,
        formData,
      }, ...args,
    ] as Parameters<T>
    return method(...parameters)
  }
}




export interface IResponseFields {
  /** Список валидных ключей */
  affected_fields: string[],
  /** Список невалидных ключей */
  forbidden_fields: string[],
  /** Список ключей с некорректными данными */
  wrong_data_fields?: string[]
}

// export const addToFormData = (formData: FormData, object: {[key: string]: any}) => {
//   for (let [key, value] of Object.entries(object)) {
//     if (!value) continue
//     formData.append(key, value)
//   }
//   return formData
// }


export const addToFormData = (formData: FormData, object: Record<string, any>) => {
  for (const [key, value] of Object.entries(object)) {

    if (value === undefined || value === null) continue

    // Moment → string
    if (typeof value === 'object' && value?._isAMomentObject) {
      formData.append(key, value.toISOString())
      continue
    }

    // Объекты и массивы → JSON
    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
      continue
    }

    // Numbers / booleans → string
    formData.append(key, String(value))
  }

  return formData
}
