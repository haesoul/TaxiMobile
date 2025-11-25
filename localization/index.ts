import store from '../state';
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
function t(id: string, options: IOptions = {}): string {
  const safeKeyFallback = (rawId: string) => {
    const k = rawId.split('.').pop() || rawId;
    if (options.toLower) return k.toLowerCase();
    if (options.toUpper) return k.toUpperCase();
    return k;
  };

  try {
    // single getState call
    const state = store.getState();

    // selector once
    const language = configSelectors.language(state);

    // data once
    const _data = state?.global?.data;

    // если языка нет — НЕ делаем dispatch здесь, просто возвращаем fallback
    if (!language || (!language.id && !language.iso)) {
      return safeKeyFallback(id);
    }

    // если данных нет — возвращаем fallback
    if (!_data) {
      return safeKeyFallback(id);
    }

    const splittedID = id.split('.');
    const category = splittedID.length === 2 ? splittedID[0] : CATEGORIES.LANG_VLS;
    const key = splittedID[splittedID.length - 1];

    const possibleCategories: string[] = Object.values(CATEGORIES);

    let result: unknown | undefined;

    // безопасный доступ с несколькими попытками (id -> iso)
    if (category === CATEGORIES.LANG_VLS) {
      result =
        _data?.[category]?.[key]?.[language.id] ??
        _data?.[category]?.[key]?.[language.iso];
    } else if (category === CATEGORIES.BOOKING_DRIVER_STATES && key === '0') {
      result =
        _data?.lang_vls?.search?.[language.id] ??
        _data?.lang_vls?.search?.[language.iso];
    } else if (possibleCategories.includes(category)) {
      result =
        _data?.[category]?.[key]?.[language.iso] ??
        _data?.[category]?.[key]?.[language.id];
    } else {
      // неизвестная категория — вернуть fallback (не кидать)
      return safeKeyFallback(id);
    }

    // если ничего не найдено — fallback
    if (!result) {
      return safeKeyFallback(id);
    }

    // применяем опции
    let out = String(result);
    if (options.toLower) out = out.toLowerCase();
    if (options.toUpper) out = out.toUpperCase();

    return out;
  } catch (error) {
    // логируем только один раз на id
    if (!errorsShown.has(id)) {
      console.warn(`Localization error. id: ${id}, options: ${JSON.stringify(options)}`, error);
      errorsShown.add(id);
    }
    return safeKeyFallback(id);
  }
}

// function t(id: string, options: IOptions = {}) {
//   const state = store.getState();
//   const language = configSelectors.language(state);


//   if (!language || !language.id) {

//     return options.toUpper ? id : id.split('.').pop() || id;
//   }
//   try {
//     const splittedID = id.split('.')
//     console.log("DATA EXISTS AT MOMENT OF CALL:", Boolean(store.getState().global.data));

//     const category = splittedID.length === 2 ?
//       splittedID[0] :
//       CATEGORIES.LANG_VLS
//     const key = splittedID[splittedID.length - 1]

//     const language = configSelectors.language(store.getState())

//     let result = ''
//     const state = store.getState();

    
//     const _data = state.global.data

//     if (!_data) return 'Error'

//     const possibleCategories: string[] = Object.values(CATEGORIES)
//     if (category === CATEGORIES.LANG_VLS) {
//       result = _data[category][key][language.id]
//       if (!result) return id;
//       // console.log("CHECK:", category, key, _data[category]?.[key]);

//     }
//     else if (category === CATEGORIES.BOOKING_DRIVER_STATES && key === '0')
//       result = _data.lang_vls.search[language.id]
//     else if (possibleCategories.includes(category))
//       result = _data[category][key][language.iso]
//     else
//       throw new Error(`Unknown category ${category}`)

//     if (!result)
//       throw new Error('Wrong key')

//     if (options.toLower) {
//       result = result.toLowerCase()
//     }
//     if (options.toUpper) {
//       result = result.toUpperCase()
//     }

//     return result
//   } catch (error) {
//     if (!errorsShown.has(id)) {
//       console.warn(
//         `Localization error. id: ${id}, options: ${JSON.stringify(options)}`,
//         error,
//       )
//       errorsShown.add(id)
//     }
//     return 'Error'
//   }
// }
// TODO get back

// const castedTranslation = T as any

export {
  t,
  TRANSLATION
};

const errorsShown = new Set<string>()