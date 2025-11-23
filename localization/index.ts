import store, { IRootState } from '../state';
import { configSelectors } from '../state/config';
import CATEGORIES from './categories';
import TRANSLATION from './translation';



interface IOptions {
  /** Does result.toLowerCase() */
  toLower?: boolean,
  /** Does result.toUpperCase() */
  toUpper?: boolean
}

/**
 * Gets localized text
 *
 * @param id CATEGORY.KEY or just KEY. Default category is lang_vls
 * @param options Result text modificators
 */
function t(id: string, options: IOptions = {}) {
  try {
    const globalData: IRootState['global'] = store.getState().global;
    const splittedID = id.split('.')

    const category = splittedID.length === 2 ?
      splittedID[0] :
      CATEGORIES.LANG_VLS
    const key = splittedID[splittedID.length - 1]

    const language = configSelectors.language(store.getState())

    let result = ''

    // const _data = globals;
    const _data: IRootState['global']['data'] & Record<string, any> = globalData.data


    if (!_data || Object.keys(_data).length === 0) {
      return 'Error';
    }
    

    const possibleCategories: string[] = Object.values(CATEGORIES)
    if (category === CATEGORIES.LANG_VLS)
      result = _data[category][key][language.id]
    else if (category === CATEGORIES.BOOKING_DRIVER_STATES && key === '0')
      result = _data.lang_vls.search[language.id]
    else if (possibleCategories.includes(category))
      result = _data[category][key][language.iso]
    else
      throw new Error(`Unknown category ${category}`)

    if (!result)
      throw new Error('Wrong key')

    if (options.toLower) {
      result = result.toLowerCase()
    }
    if (options.toUpper) {
      result = result.toUpperCase()
    }

    return result
  } catch (error) {
    if (!errorsShown.has(id)) {
      console.warn(
        `Localization error. id: ${id}, options: ${JSON.stringify(options)}`,
        error,
      )
      errorsShown.add(id)
    }
    return 'Error'
  }
}

// TODO get back

// const castedTranslation = T as any

export {
  t,
  TRANSLATION
};

const errorsShown = new Set<string>()