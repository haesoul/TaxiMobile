import React, { useCallback, useMemo, useState } from 'react'
import {
  Button,
  FlatList,
  GestureResponderEvent,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as yup from 'yup'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { configSelectors } from '../../state/config'
import { EStatuses, ILanguage } from '../../types/types'

const mapStateToProps = (state: IRootState) => ({
  language: configSelectors.language(state),
  configStatus: configSelectors.status(state),
})

const connector = connect(mapStateToProps)

type Option = { value: any; labelLang?: any }

type TFormElement = {
  name?: string
  type?: string | ((...args: any[]) => any)
  options?: Option[] | { path?: string; filter?: { by: string; field: string } }
  defaultValue?: any
  submit?: boolean
  disabled?: boolean
  validation?: Record<string, any>
  [k: string]: any
}

export type TForm = TFormElement[]

const firstItem = <T,>(arr: T[] | undefined): T | undefined => (Array.isArray(arr) ? arr[0] : undefined)

const makeFlat = (obj: Record<string, any> = {}) => {
  const res: Record<string, any> = {}
  const recurse = (o: any, prefix = '') => {
    if (o && typeof o === 'object' && !Array.isArray(o)) {
      Object.entries(o).forEach(([k, v]) => recurse(v, prefix ? `${prefix}.${k}` : k))
    } else {
      res[prefix] = o
    }
  }
  recurse(obj)
  return res
}

const makeNested = (flat: Record<string, any>) => {
  const res: Record<string, any> = {}
  for (const key of Object.keys(flat)) {
    const parts = key.split('.')
    let cur: any = res
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (i === parts.length - 1) cur[p] = flat[key]
      else {
        cur[p] = cur[p] || {}
        cur = cur[p]
      }
    }
  }
  return res
}

const deepGet = (obj: any, path?: string) => {
  if (!path) return undefined
  const parts = path.split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

const getCalculation = (val: any, values?: any, variables?: any) => {
  if (typeof val === 'function') return val(values, variables)
  return val
}

const isRequired = (item: any, values?: any) => {
  if (!item) return false
  if (typeof item.required !== 'undefined') return !!item.required
  if (item.validation && item.validation.required) return true
  return false
}

const getOptions = (field: any) => {
  if (!field) return []
  if (Array.isArray(field.options)) return field.options
  if (field.options && field.options.path) {
    const map = deepGet((global as any).data, field.options.path)
    if (!map || typeof map !== 'object') return []
    return Object.entries(map).map(([k, v]) => ({ value: k, labelLang: v }))
  }
  return []
}

function JSONFormElement({
  element,
  values,
  variables,
  onChange,
  validationSchema,
  language,
  errors,
}: {
  element: TFormElement
  values: Record<string, any>
  variables: any
  onChange: (e: any, name: string, value: any) => void
  validationSchema?: any
  language: ILanguage
  errors: Record<string, any>
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const name = element.name
  const value = name ? values[name] : undefined
  const options: Option[] =
    Array.isArray(element.options) ? (element.options as Option[]) : typeof element.options === 'object' && (element.options as any)?.path ? getOptions(element) : []
  const langKey = (language && (language as any).code) || 'ru'
  const getLabel = (opt: any) => {
    if (opt == null) return ''
    if (opt.labelLang) {
      if (typeof opt.labelLang === 'string') return opt.labelLang
      return opt.labelLang[langKey] ?? opt.labelLang.ru ?? JSON.stringify(opt.labelLang)
    }
    if (opt.label) return opt.label
    return String(opt.value ?? opt)
  }
  if (!name) {
    return (
      <View style={styles.elementField}>
        <View>
          <Text>{JSON.stringify(element)}</Text>
        </View>
      </View>
    )
  }
  const commonProps = {
    editable: !element.disabled,
  }
  if (!element.type || ['text', 'email', 'phone', 'hidden'].includes(element.type as string)) {
    return (
      <View style={[styles.elementField, errors[name] ? styles.elementFieldError : undefined]}>
        <Text style={styles.elementLabel}>
          {element.labelLang ? (element.labelLang[langKey] ?? element.labelLang.ru ?? '') : element.label ?? ''}
          {isRequired(element) ? <Text style={styles.elementRequired}>*</Text> : null}
        </Text>
        <TextInput
          value={String(value ?? '')}
          onChangeText={v => onChange(null, name, v)}
          style={styles.elementTextInput}
          {...commonProps}
        />
        {errors[name] ? <Text style={styles.elementFieldErrorText}>{String(errors[name])}</Text> : null}
      </View>
    )
  }
  if (element.type === 'number') {
    return (
      <View style={[styles.elementField, errors[name] ? styles.elementFieldError : undefined]}>
        <Text style={styles.elementLabel}>
          {element.labelLang ? (element.labelLang[langKey] ?? element.labelLang.ru ?? '') : element.label ?? ''}
          {isRequired(element) ? <Text style={styles.elementRequired}>*</Text> : null}
        </Text>
        <TextInput
          value={value != null ? String(value) : ''}
          onChangeText={v => {
            const parsed = v === '' ? null : Number(v)
            onChange(null, name, parsed)
          }}
          keyboardType="numeric"
          style={styles.elementTextInput}
          {...commonProps}
        />
        {errors[name] ? <Text style={styles.elementFieldErrorText}>{String(errors[name])}</Text> : null}
      </View>
    )
  }
  if (element.type === 'checkbox') {
    return (
      <View style={[styles.elementField, styles.elementCheckbox]}>
        <View style={styles.elementInputRow}>
          <Switch value={!!value} onValueChange={v => onChange(null, name, v)} disabled={!!element.disabled} />
          <Text style={styles.elementCheckboxLabel}>
            {element.labelLang ? (element.labelLang[langKey] ?? element.labelLang.ru ?? '') : element.label ?? ''}
            {isRequired(element) ? <Text style={styles.elementRequired}>*</Text> : null}
          </Text>
        </View>
        {errors[name] ? <Text style={styles.elementFieldErrorText}>{String(errors[name])}</Text> : null}
      </View>
    )
  }
  if (element.type === 'select' || element.type === 'radio') {
    return (
      <View style={[styles.elementField, errors[name] ? styles.elementFieldError : undefined]}>
        <Text style={styles.elementLabel}>
          {element.labelLang ? (element.labelLang[langKey] ?? element.labelLang.ru ?? '') : element.label ?? ''}
          {isRequired(element) ? <Text style={styles.elementRequired}>*</Text> : null}
        </Text>
        <TouchableOpacity style={styles.elementSelectInput} onPress={() => setModalVisible(true)} disabled={!!element.disabled}>
          <Text>{options?.find(o => String(o.value) === String(value)) ? getLabel(options?.find(o => String(o.value) === String(value))) : ''}</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                keyExtractor={(item, idx) => String(item.value) + idx}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => {
                      onChange(null, name, item.value)
                      setModalVisible(false)
                    }}
                    disabled={!!element.disabled}
                  >
                    <Text>{getLabel(item)}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title={(t(TRANSLATION.CLOSE) as unknown) as string} onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        {errors[name] ? <Text style={styles.elementFieldErrorText}>{String(errors[name])}</Text> : null}
      </View>
    )
  }
  if (element.type === 'file') {
    return (
      <View style={[styles.elementField, errors[name] ? styles.elementFieldError : undefined]}>
        <Text style={styles.elementLabel}>
          {element.labelLang ? (element.labelLang[langKey] ?? element.labelLang.ru ?? '') : element.label ?? ''}
          {isRequired(element) ? <Text style={styles.elementRequired}>*</Text> : null}
        </Text>
        <TouchableOpacity
          style={styles.elementFileAdd}
          onPress={() => {
            const arr = Array.isArray(value) ? [...value] : []
            arr.push({ name: `file_${Date.now()}` })
            onChange(null, name, arr)
          }}
          disabled={!!element.disabled}
        >
          <Text>{(t(TRANSLATION.ADD_ITEM) as unknown) as string}</Text>
        </TouchableOpacity>
        <View style={styles.elementFileList}>
          {(Array.isArray(value) ? value : []).map((f: any, idx: number) => (
            <View key={idx} style={styles.elementFileValue}>
              <Text>{f?.name ?? JSON.stringify(f)}</Text>
              <TouchableOpacity
                onPress={() => {
                  const arr = Array.isArray(value) ? [...value] : []
                  arr.splice(idx, 1)
                  onChange(null, name, arr)
                }}
              >
                <Text>{(t(TRANSLATION.CANCEL) as unknown) as string}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {errors[name] ? <Text style={styles.elementFieldErrorText}>{String(errors[name])}</Text> : null}
      </View>
    )
  }
  return (
    <View style={styles.elementField}>
      <Text>{JSON.stringify(element)}</Text>
    </View>
  )
}

function CustomComponent(props: any) {
  return (
    <View style={styles.customComponent}>
      <Text>{props.title ?? JSON.stringify(props)}</Text>
    </View>
  )
}

interface IProps extends ConnectedProps<typeof connector> {
  language: ILanguage
  configStatus: EStatuses
  fields: TForm
  onSubmit?: (values: any) => any
  onChange?: (fieldName: string, value: any) => any
  defaultValues?: Record<string, any>
  errors?: Record<string, any>
  state?: {
    success?: boolean
    failed?: boolean
    pending?: boolean
    errorMessage?: string
  }
}

function JSONForm({
  configStatus,
  language,
  onSubmit,
  onChange,
  state = {},
  defaultValues = {},
  errors = {},
  fields,
}: IProps) {
  const [unfilteredValues, setValues] = useState(() => {
    const initialValues: Record<string, any> = makeFlat(defaultValues)
    const reverseFilteredDefaults: Record<string, any> = {}
    for (const field of fields) {
      if (!(field.name && !Array.isArray(field.options) && (field.options as any)?.filter)) continue
      const { path, filter } = field.options as any
      const value = initialValues[field.name] ?? field.defaultValue
      const map = deepGet((global as any).data, path)
      const filterFieldValue = (map as any)?.[value as any]?.[filter.field]
      if (filterFieldValue != null) reverseFilteredDefaults[filter.by] = filterFieldValue
    }
    for (const field of fields) {
      if (!field.name) continue
      let value = initialValues[field.name] ?? reverseFilteredDefaults[field.name] ?? field.defaultValue ?? null
      if (value === null) {
        if (field.type === 'checkbox') value = false
        if ((['select', 'radio'] as any).includes(field.type) && isRequired(field)) value = (firstItem(getOptions(field)) as { value: any } | undefined)?.value
        if (!field.type || ['text', 'email', 'phone', 'hidden'].includes(field.type as any)) value = ''
      }
      initialValues[field.name] = value
    }
    return initialValues
  })
  const [formErrors, setFormErrors] = useState<Record<string, any>>(errors)
  const [form, values] = useMemo(() => {
    const formElements: TFormElement[] = []
    const valuesCopy = { ...unfilteredValues }
    for (const field of fields) {
      if (field.type === 'select' && !Array.isArray(field.options) && (field.options as any)?.path) {
        const map = deepGet((global as any).data, (field.options as any).path)
        if ((field.options as any).filter) {
          const filterBy = (field.options as any).filter.by
          const filterField = (field.options as any).filter.field
          const selectedValue = valuesCopy[filterBy]
          if (!map || typeof map !== 'object') {
            formElements.push({ ...field, options: [], defaultValue: undefined, disabled: true })
            continue
          }
          const filteredOptions = Object.entries(map)
            .filter(([_, value]: [string, any]) => {
              if (!value || typeof value !== 'object') return false
              return value[filterField] === selectedValue
            })
            .map(([num, value]: [string, any]) => ({ value: num, labelLang: value }))
          if (field.name && (isRequired(field) || valuesCopy[field.name] != null) && (map as any)[valuesCopy[field.name]]?.[filterField] !== selectedValue)
            valuesCopy[field.name] = filteredOptions[0]?.value ?? null
          if (filteredOptions.length === 0) formElements.push({ ...field, options: [{ value: '', labelLang: { ru: '', en: '' } }], defaultValue: '', disabled: true })
          else formElements.push({ ...field, options: filteredOptions, defaultValue: filteredOptions[0]?.value })
        } else {
          if (!map || typeof map !== 'object') formElements.push({ ...field, options: [], defaultValue: undefined, disabled: true })
          else {
            const options = Object.entries(map).map(([num, value]) => ({ value: num, labelLang: value }))
            formElements.push({ ...field, options, defaultValue: options[0]?.value })
          }
        }
      } else formElements.push(field)
    }
    return [formElements, valuesCopy]
  }, [fields, unfilteredValues])
  const validationSchema = form.reduce((res: any, item: TFormElement) => {
    const { name, type, validation = {} } = item
    if (!name) return res
    let obj: any
    if (type === 'file') obj = yup.array()
    else if (type === 'number') {
      obj = yup.number()
      if (getCalculation(validation.max, values)) obj = obj.max(getCalculation(validation.max, values), t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR))
      if (getCalculation(validation.min, values)) obj = obj.min(getCalculation(validation.min, values), t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR))
    } else if (type === 'checkbox') {
      obj = yup.bool()
      if (isRequired(item, values)) obj = obj.oneOf([true], t(TRANSLATION.REQUIRED_FIELD))
      return { ...res, [name]: obj }
    } else if (type === 'select') obj = yup.string().nullable()
    else {
      obj = yup.string()
      if (type === 'email') obj = obj.email(t(TRANSLATION.EMAIL_ERROR))
      if (getCalculation(validation.length, values)) obj = obj.length(getCalculation(validation.length, values), t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR))
      if (getCalculation(validation.max, values)) obj = obj.max(getCalculation(validation.max, values), t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR))
      if (getCalculation(validation.min, values)) obj = obj.min(getCalculation(validation.min, values), t(TRANSLATION.CARD_NUMBER_PATTERN_ERROR))
      if (getCalculation(validation.pattern, values)) {
        const pattern: [string, string] = getCalculation(validation.pattern, values)
        if (Array.isArray(pattern)) {
          const regexp = new RegExp(...pattern)
          const phoneMask = (global as any).data?.site_constants?.def_maska_tel?.value
          const errorMessage = name === 'u_phone' && phoneMask ? `${t(TRANSLATION.PHONE_PATTERN_ERROR)} ${phoneMask}` : t(TRANSLATION.PHONE_PATTERN_ERROR)
          obj = obj.matches(getCalculation(regexp, values), errorMessage)
        }
      }
    }
    if (isRequired(item, values)) {
      if (type === 'file') obj = obj.min(1, t(TRANSLATION.REQUIRED_FIELD))
      else obj = obj.required(t(TRANSLATION.REQUIRED_FIELD))
    } else obj = obj.nullable().optional()
    return { ...res, [name]: obj }
  }, {})
  const yupSchema = yup.object().shape(validationSchema)
  const isValid = yupSchema.isValidSync(values)
  const handleChange = useCallback((e: any, name: any, value: any) => {
    setValues({
      ...values,
      [name]: value,
    })
    onChange && onChange(name, value)
    if (name === 'u_phone' && value) {
      const phoneMask = (global as any).data?.site_constants?.def_maska_tel?.value
      if (phoneMask) {
        const prefixMatch = phoneMask.match(/^\+?(\d+)/)
        const prefix = prefixMatch ? prefixMatch[1] : ''
        const digits = String(value).replace(/\D/g, '')
        const prefixWithoutPlus = prefix.replace('+', '')
        if (digits.length > 0 && !digits.startsWith(prefixWithoutPlus)) {
          setFormErrors({
            ...formErrors,
            [name]: t(TRANSLATION.PHONE_PATTERN_ERROR) + ' ' + phoneMask,
          })
        } else {
          const newErrors = { ...formErrors }
          delete newErrors[name]
          setFormErrors(newErrors)
        }
      }
    }
  }, [values, formErrors, onChange])
  const variables = useMemo(() => ({
    form: {
      valid: isValid,
      invalid: !isValid,
      pending: state.pending,
      submitSuccess: state.success,
      submitFailed: state.failed,
      errorMessage: state.errorMessage,
    },
  }), [isValid, state])
  function handleSubmit(e?: GestureResponderEvent) {
    if (!onSubmit) return
    const submitValues: Record<string, any> = { ...values }
    for (const field of form) {
      if (!(field.submit ?? true) || (['button', 'submit'] as const).includes(getCalculation(field.type, values, variables))) {
        const key: string = getCalculation(field.name, values, variables)
        delete submitValues[key]
      }
    }
    onSubmit(makeNested(submitValues))
  }
  if (configStatus !== EStatuses.Success) return null
  return (
    <View style={{ position: 'relative', zIndex: 500 }}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        {form.map((formElement: TFormElement, i: number) =>
          formElement.name ? (
            <JSONFormElement
              key={i}
              element={formElement}
              values={values}
              variables={variables}
              onChange={handleChange}
              validationSchema={validationSchema[formElement.name]}
              language={language}
              errors={formErrors}
            />
          ) : (
            <CustomComponent {...formElement} key={i} values={values} variables={variables} />
          )
        )}
        <View style={styles.submitButton}>
          <Button title=" " onPress={handleSubmit} />
        </View>
      </ScrollView>
    </View>
  )
}

export default connector(JSONForm)

const styles = StyleSheet.create({
  formContainer: {
    padding: 12,
  },
  elementField: {
    marginBottom: 40,
  },
  elementFieldError: {},
  elementFieldErrorText: {
    color: 'red',
    marginTop: 5,
  },
  elementLabel: {
    marginBottom: 15,
    fontSize: 14,
  },
  elementRequired: {
    color: 'red',
  },
  elementRadio: {
    marginBottom: 10,
  },
  elementCheckbox: {
    marginBottom: 10,
  },
  elementCheckboxLabel: {
    marginLeft: 8,
    lineHeight: 25,
  },
  elementSelectInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  elementTextInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  elementFileList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elementFileValue: {
    height: 110,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 10,
    marginRight: 8,
    marginTop: 8,
    padding: 8,
    justifyContent: 'space-between',
  },
  elementFileAdd: {
    height: 110,
    width: 90,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 10,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementHint: {
    marginLeft: 10,
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '80%',
    padding: 10,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customComponent: {
    padding: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 40,
  },
})
