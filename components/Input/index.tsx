import React, { useMemo, useRef, useState } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { ISelectOption } from '../../types'
import { ESuggestionType, ISuggestion } from '../../types/types'
import Button from '../Button'
import CompareVariants, { ECompareVariants } from '../CompareVariants'
import RadioCheckbox from '../RadioCheckbox'

export enum EInputTypes {
  Default,
  Number,
  Textarea,
  Select,
  MaskedPhone,
  File,
}

export enum EInputStyles {
  Default,
  Login,
  RedDesign,
}

interface ISideCheckbox {
  value: boolean
  onClick: () => any
  component: React.ReactNode
}

interface IFileLike {
  uri?: string
  name?: string
  size?: number
  [k: string]: any
}

interface IProps {
  inputType?: EInputTypes
  style?: any
  error?: string | null
  label?: string
  buttons?: Array<React.ReactNode | { image?: any; buttonProps?: any }> | React.ComponentProps<typeof Button>[]
  suggestions?: ISuggestion[]
  onSuggestionClick?: (value: ISuggestion) => any
  options?: ISelectOption[]
  inputProps?: TextInputProps & { disabled?: boolean; required?: boolean; value?: any }
  onChange?: (newValue: string | number | IFileLike[] | null) => any
  removeDefaultImage?: (id: number) => any
  fieldWrapperClassName?: string
  oneline?: boolean
  fileName?: string
  showDisablerCheckbox?: boolean
  onDisableChange?: (value: boolean) => any
  defaultValue?: string
  sideText?: string
  sideCheckbox?: ISideCheckbox
  compareVariant?: ECompareVariants
  onChangeCompareVariant?: (value: ECompareVariants) => any
  hideInput?: boolean
  defaultFiles?: Array<[number, string]>
  onPickFiles?: () => Promise<IFileLike[]>
  fieldWrapperStyle?: StyleProp<ViewStyle>;

}

const suggestionStyleForType = (type?: ESuggestionType) => {
  switch (type) {
    case ESuggestionType.PointOfficial:
      return styles.suggestionOfficial
    case ESuggestionType.PointUnofficial:
      return styles.suggestionUnofficial
    case ESuggestionType.PointUserTop:
      return styles.suggestionUserTop
    default:
      return undefined
  }
}

export default function Input({
  inputType = EInputTypes.Default,
  style = EInputStyles.Default,
  error,
  label,
  buttons,
  options,
  inputProps = {},
  fieldWrapperClassName,
  suggestions,
  oneline,
  showDisablerCheckbox,
  defaultValue,
  sideText,
  fileName,
  defaultFiles = [],
  sideCheckbox,
  compareVariant,
  hideInput,
  onChange,
  removeDefaultImage,
  onDisableChange,
  onChangeCompareVariant,
  onSuggestionClick,
  onPickFiles,
  fieldWrapperStyle

}: IProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isDisabled, setIsDisabled] = useState(!!inputProps.disabled)
  const [isDefaultValueUsed, setIsDefaultValueUsed] = useState(false)
  const [files, setFiles] = useState<IFileLike[]>([])
  const prevValue = useRef<string>('')
  const [bufferedValue, setBufferedValue] = useState<string | undefined>(undefined)

  const idRef = useRef(Math.random().toString(36).slice(2))
  const inputRef = useRef<TextInput | null>(null)

  const isControlled = inputProps.value !== undefined
  const setBuffered = isControlled ? setBufferedValue : () => {}

  const addFiles = async (picked?: IFileLike[]) => {
    let newOnes = picked ?? []
    if (!newOnes.length && onPickFiles) {
      try {
        newOnes = await onPickFiles()
      } catch (err) {
        console.warn('onPickFiles failed', err)
      }
    }
    if (!newOnes || !newOnes.length) return
    const merged = files.concat(newOnes)
    setFiles(merged)
    onChange && onChange(merged)
  }

  const removeImg = (file: IFileLike, idx?: number) => {
    const newFiles = files.filter((e, i) => (idx !== undefined ? i !== idx : e !== file))
    setFiles(newFiles)
    onChange && onChange(newFiles)
  }

  const blurTimeoutRef = useRef<number | null>(null)

  const commonOnFocus = (e?: any) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
    setIsFocused(true)
    inputProps.onFocus && inputProps.onFocus(e)
  }

  const commonOnBlur = (e?: any) => {
    blurTimeoutRef.current = (setTimeout(() => setIsFocused(false), 300) as unknown) as number
    inputProps.onBlur && inputProps.onBlur(e)
  }

  const handleTextChange = (valueRaw: string) => {
    if (inputType === EInputTypes.MaskedPhone) {
      valueRaw = valueRaw.replace(/[^\d]/g, '')
    }

    const numberTypes = [EInputTypes.Number, EInputTypes.MaskedPhone]
    const isNumberType = numberTypes.includes(inputType)

    let numberValue: number | null = isNumberType ? (valueRaw === '' ? null : Number(valueRaw)) : null;

    let valid = true;
    if (isNumberType) {
      let normalized = valueRaw;
      if (normalized && normalized[normalized.length - 1] === '.') normalized = normalized.slice(0, -1);
    
      if (normalized === '') {
        valid = true;
        numberValue = null;
      } else if (numberValue !== null && Number.isFinite(numberValue) && numberValue >= 0 && String(numberValue) === normalized) {
        valid = true;
      } else {
        valid = false;
      }
    }
    

    if (valid) {
      prevValue.current = valueRaw
      setBuffered(undefined)
      if (onChange) {
        onChange(isNumberType && valueRaw.length > 0 ? Number(valueRaw) : valueRaw)
      }
    } else {
      setBufferedValue(valueRaw)
    }
  }

  const textValue = isControlled ? (bufferedValue ?? String(inputProps.value ?? '')) : undefined

  const renderInputByType = () => {
    switch (inputType) {
      case EInputTypes.Textarea:
        return (
          <TextInput
            ref={inputRef}
            multiline
            numberOfLines={4}
            style={[styles.input, style === EInputStyles.Login && styles.styleLogin, style === EInputStyles.RedDesign && styles.styleRed]}
            editable={!isDisabled && !isDefaultValueUsed && inputProps.editable !== false}
            onChangeText={handleTextChange}
            onFocus={commonOnFocus}
            onBlur={commonOnBlur}
            value={textValue}
            {...inputProps}
          />
        )
      case EInputTypes.Select:
        return (
          <View style={styles.pseudoSelectContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              {options?.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onChange && onChange(opt.value as any)}
                  style={styles.pseudoSelectOption}
                >
                  <Text>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )
      case EInputTypes.MaskedPhone:
        return (
          <TextInput
            ref={inputRef}
            keyboardType="phone-pad"
            style={[styles.input, style === EInputStyles.Login && styles.styleLogin, style === EInputStyles.RedDesign && styles.styleRed]}
            editable={!isDisabled && !isDefaultValueUsed && inputProps.editable !== false}
            onChangeText={handleTextChange}
            onFocus={commonOnFocus}
            onBlur={commonOnBlur}
            value={textValue}
            {...inputProps}
          />
        )
      case EInputTypes.File:
        return (
          <View style={styles.fileWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 120 }}>
              {defaultFiles.map((df, i) => (
                <TouchableOpacity key={i} style={styles.fileUploaded} onPress={() => removeDefaultImage && removeDefaultImage(df[0])}>
                  <Image source={typeof df[1] === 'string' ? { uri: df[1] } : (df[1] as any)} style={styles.fileImage} />
                </TouchableOpacity>
              ))}
              {files.map((file, i) => (
                <TouchableOpacity key={i} style={styles.fileUploaded} onPress={() => removeImg(file, i)}>
                  {file.uri ? <Image source={typeof file.uri === 'string' ? { uri: file.uri } : (file.uri as any)} style={styles.fileImage} /> : <View style={styles.filePlaceholder}><Text>{file.name ?? 'file'}</Text></View>}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.fileAdd}
              onPress={() => addFiles()}
              disabled={!onPickFiles}
            >
              <Image source={images.addPhoto ? (typeof images.addPhoto === 'string' ? { uri: images.addPhoto } : (images.addPhoto as any)) : undefined} style={styles.fileAddImage} />
            </TouchableOpacity>
          </View>
        )
      case EInputTypes.Number:
        return (
          <TextInput
            ref={inputRef}
            keyboardType="decimal-pad"
            style={[styles.input, style === EInputStyles.Login && styles.styleLogin, style === EInputStyles.RedDesign && styles.styleRed]}
            editable={!isDisabled && !isDefaultValueUsed && inputProps.editable !== false}
            onChangeText={handleTextChange}
            onFocus={commonOnFocus}
            onBlur={commonOnBlur}
            value={textValue}
            {...inputProps}
          />
        )
      default:
        return (
          <TextInput
            ref={inputRef}
            style={[styles.input, style === EInputStyles.Login && styles.styleLogin, style === EInputStyles.RedDesign && styles.styleRed]}
            editable={!isDisabled && !isDefaultValueUsed && inputProps.editable !== false}
            onChangeText={handleTextChange}
            onFocus={commonOnFocus}
            onBlur={commonOnBlur}
            value={textValue}
            {...inputProps}
          />
        )
    }
  }

  const suggestionsFiltered = useMemo(() => {
    if (!suggestions) return suggestions
    const addresses = new Set<string>()
    const res: ISuggestion[] = []
    for (const s of suggestions) {
      const addr = s.point?.address
      if (!addr || addresses.has(addr)) continue
      addresses.add(addr)
      res.push(s)
    }
    return res
  }, [suggestions])

  const handleSuggestionClick = (item: ISuggestion) => {
    setIsFocused(false)
    onSuggestionClick && onSuggestionClick(item)
  }

  const handleDisablerCheckboxChange = () => {
    setIsDisabled(prev => {
      const next = !prev
      onDisableChange && onDisableChange(next)
      return next
    })
  }

  const handleIsDefaultValueUsedChange = () => {
    setIsDefaultValueUsed(prev => {
      const next = !prev
      if (!prev && defaultValue && onChange) onChange(defaultValue)
      return next
    })
  }

  const wrapperOneline = oneline || isDefaultValueUsed
  const hide = !!hideInput

  return (
    <View style={[
      styles.fieldWrapper,
      wrapperOneline && styles.fieldWrapperOneline,
      hide && styles.fieldWrapperMarginDisabled,
      style !== EInputStyles.Default && (style === EInputStyles.Login ? styles.styleLogin : styles.styleRed)
    ]}>
      <View style={[styles.header, (!showDisablerCheckbox && !defaultValue && !label && !sideCheckbox) && styles.headerEmpty]}>
        <View style={styles.headerItem}>
          {showDisablerCheckbox && (
            <RadioCheckbox checked={!isDisabled && !inputProps.disabled && !hide} onChange={handleDisablerCheckboxChange} />
          )}

          {defaultValue && (
            <View style={styles.defaultValue}>
              <RadioCheckbox checked={isDefaultValueUsed} onChange={handleIsDefaultValueUsedChange} />
              <TouchableOpacity onPress={handleIsDefaultValueUsedChange}>
                <Text>{t(TRANSLATION.USE_THE)} {isDefaultValueUsed ? '' : defaultValue}</Text>
              </TouchableOpacity>
            </View>
          )}

          {!!label && (
            <Text style={styles.label}>
              {label}
              {inputProps.required && <Text style={{ color: 'red' }}>*</Text>}
              {hide ? '' : ':'}
            </Text>
          )}
        </View>

        {!hide && !!sideCheckbox && (
          <TouchableOpacity style={styles.headerItem} onPress={() => sideCheckbox.onClick()}>
            <RadioCheckbox checked={sideCheckbox.value} onClick={e => e.stopPropagation()} />
            <View>{sideCheckbox.component}</View>
          </TouchableOpacity>
        )}
      </View>

      {
        !hide && (
          <>
            <View style={styles.sideTextWrapper}>
              {sideText && <Text style={{ marginRight: 6 }}>{sideText}</Text>}

              <View style={[styles.wrapperInput, suggestionsFiltered?.length ? styles.wrapperWithHints : null, (isDisabled || isDefaultValueUsed || inputProps.disabled) ? styles.disabledWrapper : null]}>
                {renderInputByType()}

                {!!buttons && (
                  <View style={styles.buttonsArea}>
                    {buttons.map((item, idx) => {
                      if (React.isValidElement(item)) {
                        return <View key={idx} style={{ marginHorizontal: 5 }}>{item}</View>
                      }
                      if (typeof item === 'object' && (item as any).image) {
                        return <Image key={idx} source={(item as any).image} style={styles.buttonImage} />
                      }
                      if (typeof item === 'object' && (item as any).buttonProps) {
                        return <Button key={idx} {...(item as any).buttonProps} />
                      }
                      return null
                    })}
                  </View>
                )}

                <View style={[styles.suggestionsArea, isFocused && suggestionsFiltered && suggestionsFiltered.length ? styles.suggestionsActive : null]}>
                  <ScrollView>
                    {suggestionsFiltered && suggestionsFiltered.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSuggestionClick(item)}
                        style={[styles.suggestionItem, suggestionStyleForType(item.type)]}
                      >
                        <Text>
                          {item.point?.address}
                          {item.distance ? ` ${(item.distance / 1000).toFixed(1)}${t(TRANSLATION.KM, { toLower: true })}` : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            {compareVariant !== undefined && onChangeCompareVariant && (
              <View style={{ marginTop: 8 }}>
                <CompareVariants value={compareVariant} onChange={onChangeCompareVariant} />
              </View>
            )}

            {!!error && <Text style={styles.error}>{error}</Text>}
          </>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  fieldWrapper: {
    flex: 1,
    alignSelf: 'stretch',
  },
  fieldWrapperOneline: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingRight: 15,
  },
  fieldWrapperMarginDisabled: {
    marginBottom: 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerEmpty: {
    marginBottom: 0,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },

  defaultValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  label: {
    fontSize: 20,
  },

  sideTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  wrapperInput: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    position: 'relative' as any,
    borderRadius: 16,
    paddingRight: 7,
    backgroundColor: '#E7E7E7',
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  wrapperWithHints: {
  },
  disabledWrapper: {
    backgroundColor: '#efefef',
  },

  input: {
    height: 52,
    paddingRight: 10,
    paddingLeft: 15,
    flex: 1,
    backgroundColor: 'transparent',
  },

  // styles that were missing -> added
  styleLogin: {
    borderWidth: 1,
    borderColor: '#8E8E8E',
  },
  styleRed: {
    height: 40,
    fontSize: 13,
  },

  buttonsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonImage: {
    width: 22,
    height: 22,
    marginHorizontal: 5,
  },

  suggestionsArea: {
    opacity: 0,
    zIndex: -1,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#858585',
    height: 0,
    marginTop: -1,
  },
  suggestionsActive: {
    opacity: 1,
    zIndex: 1,
    height: 'auto',
  },

  suggestionItem: {
    padding: 15,
  },
  suggestionUserTop: {
    backgroundColor: '#fff',
  },
  suggestionUnofficial: {
    backgroundColor: '#FFFBE6',
  },
  suggestionOfficial: {
    backgroundColor: '#E6C200',
  },

  error: {
    marginTop: 5,
    color: 'red',
  },

  fileWrapper: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingRight: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  fileUploaded: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    width: 80,
    height: 96,
    padding: 6,
    marginRight: 8,
  },
  fileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  filePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileAdd: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    width: 80,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileAddImage: {
    width: 32,
    height: 32,
  },

  pseudoSelectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 6,
  },
  pseudoSelectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})
