import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageBackground,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View
} from 'react-native';
import RenderHtml from 'react-native-render-html';


import { t } from '../../localization';
import { getPhoneMask } from '../../tools/phoneUtils';
import { ILanguage } from '../../types/types';
import Button from '../Button';
import SmartImage from '../SmartImage';
import { TFormElement, TFormValues, TOption } from './types';
import {
  getCalculation,
  getTranslation,
  isRequired,
  parseVariable,
} from './utils';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IProps {
  element: TFormElement
  validationSchema?: any
  onChange: (e: any, name: string, value: any) => any
  values?: TFormValues
  language?: ILanguage
  variables?: Record<string, any>
  errors?: Record<string, any>
}

function JSONFormElement({
  onChange = () => {},
  values = {},
  validationSchema,
  language,
  variables = {},
  errors = {},
  element: formElement,
}: IProps) {
  const {
    accept,
    placeholder,
    multiple,
    visible,
    disabled,
    options = [],
  } = formElement;

  const { width } = useWindowDimensions();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [files, setFiles] = useState<[any, any][]>();
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const name: string = getCalculation(formElement.name, values, variables);
  const type = getCalculation(formElement.type, values, variables);
  const value = values[name];
  const hintTextName = `hint_${name.split('.').slice(-1)[0]}`;
  
  let hint = formElement.hint;
  if (!hint && getTranslation(hintTextName) !== hintTextName) {
    hint = getTranslation(hintTextName);
  }

  useEffect(() => {
    if (type === 'file' && value) {
      setFiles(value);
    }
  }, []);

  const validate = useCallback((value: any) => {
    if (!validationSchema) return;
    validationSchema.validate(value)
      .then(() => {
        setErrorMessage('');
      })
      .catch((error: any) => {
        setErrorMessage(error.message);
      });
  }, []);

  if (visible) {
    const isVisible = getCalculation(visible, values, variables);
    if (!isVisible) return null;
  }

  const createSyntheticEvent = (val: any, inputType: string) => ({
    target: {
      name,
      value: val,
      type: inputType,
      checked: inputType === 'checkbox' ? val : undefined,
      files: inputType === 'file' ? val : undefined
    }
  });

  const isDisabled = parseVariable(getCalculation(disabled, values, variables), variables);

  const commonProperties = {
    name,
    editable: !isDisabled,

    onChangeText(text: string) {
      const event = createSyntheticEvent(text, type);
      validate(text);
      onChange(event, name, text);
    },

    onBlur() {
       const event = createSyntheticEvent(value, type);
       validate(value);
    },
  };

  const toggleHint = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsHintVisible(!isHintVisible);
  }

  let hintElement: any = !hint ?
    null :
    (
      <View style={styles.elementHint}>
        <TouchableOpacity 
          onPress={toggleHint} 
          style={styles.elementHintIcon}
          activeOpacity={0.7}
        >
          <Text style={styles.elementHintIconText}>?</Text>
        </TouchableOpacity>
        {isHintVisible && (
          <View style={[
            styles.elementHintMessage, 
            !formElement.label ? styles.elementHintMessageLeft : styles.elementHintMessageRight
          ]}>
            <Text style={styles.elementHintMessageText}>{getTranslation(hint)}</Text>
          </View>
        )}
      </View>
    );

  let labelElement: any = !formElement.label ?
    null :
    (
      <View style={styles.elementLabel}>
        <Text style={styles.elementLabelText}>
           {getTranslation(getCalculation(formElement.label, values, variables))}
           {isRequired(formElement, values, variables) && <Text style={styles.elementRequired}>*</Text>}
        </Text>
        {hintElement}
      </View>
    );

  let element;

  if (type === 'hidden') {

    return null;
  }

  if (type === 'button' || type === 'submit') {
    return (
      <Button
        type={type}
        text={getTranslation(getCalculation(formElement.label, values, variables))}
        disabled={isDisabled}
        skipHandler
      />
    );
  }

  if (type === 'select') {
    const required = isRequired(formElement, values, variables);
    const selectOptions = getCalculation(options, values, variables);

    const selectedOption = selectOptions?.find((opt: TOption) => opt.value === value);
    const displayValue = selectedOption 
        ? (selectedOption.label ? getTranslation(selectedOption.label) : selectedOption.value)
        : '';

    element = (
      <View>
        <TouchableOpacity
          style={[styles.elementSelectInput, isDisabled && styles.elementDisabled]}
          onPress={() => !isDisabled && setIsSelectOpen(!isSelectOpen)}
        >
          <Text>{displayValue || (!required ? '-' : '')}</Text>
        </TouchableOpacity>
        
        {isSelectOpen && (
          <View style={styles.selectDropdown}>
             {!required && (
               <TouchableOpacity 
                 style={styles.selectOption}
                 onPress={() => {
                   const event = createSyntheticEvent('', 'select');
                   validate('');
                   onChange(event, name, '');
                   setIsSelectOpen(false);
                 }}
               >
                 <Text>-</Text>
               </TouchableOpacity>
             )}
             {selectOptions.map((option: TOption) => (
               <TouchableOpacity 
                 key={option.value} 
                 style={styles.selectOption}
                 onPress={() => {
                   const event = createSyntheticEvent(option.value, 'select');
                   validate(option.value);
                   onChange(event, name, option.value);
                   setIsSelectOpen(false);
                 }}
               >
                  <Text>
                    {!!option.label && getTranslation(option.label)}
                    {!!option.labelLang && !!language && option.labelLang[language.iso]}
                  </Text>
               </TouchableOpacity>
             ))}
          </View>
        )}
      </View>
    );
  }

  if (type === 'radio') {
    const radioOptions = getCalculation(options, values, variables);
    element = (
      <View>
        {radioOptions.map((option: TOption) => {
            const isChecked = values[name] === option.value;
            return (
              <TouchableOpacity 
                key={option.value} 
                style={styles.elementRadio}
                disabled={option.disabled}
                onPress={() => {
                    const event = createSyntheticEvent(option.value, 'radio');
                    validate(option.value);
                    onChange(event, name, option.value);
                }}
              >

                <View style={[
                    styles.elementRadioSpanBefore, 
                    isChecked && styles.elementRadioSpanBeforeChecked,
                    option.disabled && styles.elementRadioDisabled
                ]}>
                   {isChecked && <View style={styles.elementRadioSpanAfter} />}
                </View>
                <Text style={option.disabled && styles.elementRadioDisabledText}>
                    {getTranslation(option.label)}
                </Text>
              </TouchableOpacity>
            );
        })}
      </View>
    );
  }

  if (type === 'checkbox') {
    labelElement = null;
    const labelHtml = getTranslation(getCalculation(formElement.label, values, variables));
    
    element = (
      <TouchableOpacity 
        style={styles.elementCheckbox}
        disabled={isDisabled}
        onPress={() => {
            const newValue = !value;
            const event = createSyntheticEvent(newValue, 'checkbox');
            validate(newValue);
            onChange(event, name, newValue);
        }}
      >
        <View style={[
            styles.elementCheckboxSpanBefore,
            value && styles.elementCheckboxSpanBeforeChecked,
            isDisabled && styles.elementCheckboxDisabled
        ]}>
            {value && <Text style={styles.elementCheckboxCheckmark}>✓</Text>}
        </View>
        
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <RenderHtml
                    contentWidth={width}
                    source={{ html: `<span>${labelHtml}</span>` }}
                    tagsStyles={{ span: { fontSize: 16, color: '#000' } }}
                />
                {isRequired(formElement, values, variables) && <Text style={styles.elementRequired}>*</Text>}
            </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (type === 'phone') {
    element = (
      <TextInput
        {...commonProperties}
        value={value || ''}
        keyboardType="phone-pad"
        style={[styles.elementTextInput, isDisabled && styles.elementDisabled]}
        placeholder={getPhoneMask()}
      />
    );
  } else if (type === 'file') {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: multiple,
            quality: 1,
        });

        if (!result.canceled) {

            
            const inputFiles: [any, any][] = result.assets.map((asset) => [null, asset]);
            const newFiles = (files || []).concat(inputFiles);

            setFiles(newFiles);
            const event = createSyntheticEvent(newFiles, 'file');
            onChange(event, name, newFiles);
        }
    };

    element = (
      <View style={styles.elementFile}>
        {!!files && files.map((file: [any, any], key: number) => (
          <TouchableOpacity
            style={styles.elementFileValue}
            key={key}
            onPress={() => {
              const newFiles = files.filter((_, index: number) => index !== key);
              setFiles(newFiles);
              const event = createSyntheticEvent(newFiles.length ? newFiles : null, 'file');
              onChange(event, name, newFiles.length ? newFiles : null);
            }}
          >

            <SmartImage 
                source={{ uri: file[1].uri }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="cover"
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
            style={[
                styles.elementFileAdd, 
                isDisabled && styles.elementFileAddDisabled
            ]}
            disabled={isDisabled}
            onPress={pickImage}
        >
           <ImageBackground 

                source={{ uri: 'https://via.placeholder.com/90x110.png?text=+' }} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="center"
           >

           </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  if (!element) {
    element = (
      <TextInput
        {...commonProperties}
        value={value}
        secureTextEntry={type === 'password'}
        style={[styles.elementTextInput, isDisabled && styles.elementDisabled]}
        placeholder={placeholder}
      />
    );
  }


  
  const subscription = type === 'file' && accept === 'image/png, image/jpeg, image/jpg' ? t('subscription_images_upload') : null;

  return (
    <View style={[
        styles.elementField,
        errors[name] && styles.elementFieldErrorWrapper
    ]}>
      {labelElement}
      <View style={(type === 'file' || !hintElement) ? {} : styles.elementInput}>
        {element}
        {!labelElement && !!hint && hintElement}
      </View>
      
      {!!subscription && (
          <Text style={styles.elementFieldSubscription}>
            {subscription}
          </Text>
      )}
      
      {!!errorMessage && (
          <Text style={styles.elementFieldError}>
            {errorMessage}
          </Text>
      )}
      
      {!!errors[name] && !errorMessage && (
          <Text style={styles.elementFieldError}>
            {errors[name]}
          </Text>
      )}
    </View>
  );
}

export default JSONFormElement;


const styles = StyleSheet.create({

  elementField: {
    marginBottom: 40,

  },

  elementFieldErrorWrapper: {

  },

  elementFieldError: {
    color: 'red',
    marginTop: 5,
  },

  elementFieldSubscription: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },

  elementLabel: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementLabelText: {
      color: '#000',
      fontSize: 16,
  },

  elementRequired: {
    color: 'red',
  },

  elementRadio: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementRadioDisabled: {
      opacity: 0.3,
  },
  elementRadioDisabledText: {
      color: '#888',
  },

  elementRadioSpanBefore: {
    borderWidth: 2,
    borderColor: '#0f2c76',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  elementRadioSpanBeforeChecked: {
    borderColor: '#1c8c00',
    backgroundColor: '#1fdc00',
  },

  elementRadioSpanAfter: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#fff',
    position: 'absolute',
 
  },
  

  elementCheckbox: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  elementCheckboxDisabled: {
      opacity: 0.5,
  },

  elementCheckboxSpanBefore: {
    borderWidth: 2,
    borderColor: '#0f2c76',
    width: 25,
    height: 25,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  elementCheckboxSpanBeforeChecked: {
    borderColor: '#1c8c00',
    backgroundColor: '#1fdc00',
  },
  elementCheckboxCheckmark: {
      color: '#fff',
      fontSize: 18,
      lineHeight: 20,
  },


  elementSelectInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 10,
    justifyContent: 'center',
  },
  selectDropdown: {
      borderWidth: 1,
      borderColor: '#858585',
      borderRadius: 14,
      marginTop: 5,
      backgroundColor: '#fff',
  },
  selectOption: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
  },

  elementTextInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 10,
    width: '100%',
    color: '#000',
  },
  elementDisabled: {
    opacity: 0.3,
  },


  elementFile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 120,
    padding: 5,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    backgroundColor: '#fff',
  },

  elementFileValue: {
    height: 110,
    width: 100,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 10,
    marginRight: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  elementFileAdd: {
    height: 110,
    width: 90,
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    overflow: 'hidden',

  },
  elementFileAddDisabled: {
      opacity: 0.3,
  },


  elementHint: {
    marginLeft: 10,
    width: 24,
    height: 24,
    position: 'relative',
    zIndex: 10,
  },

  elementHintIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  elementHintIconText: {
      fontSize: 14,
      color: '#000',
  },

  elementHintMessage: {
      position: 'absolute',
      bottom: 30,
      backgroundColor: '#fff',
      padding: 5,
      minWidth: 200,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
  },
  elementHintMessageLeft: {
      right: 0,
  },
  elementHintMessageRight: {
      left: 0,
      top: 30,
      bottom: undefined,
  },
  elementHintMessageText: {
      color: '#000',
  },

  elementInput: {
      flexDirection: 'row',
      alignItems: 'center',
  }
});