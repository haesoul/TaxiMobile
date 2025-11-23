import React from 'react'
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import images from '../../constants/images'
import { t, TRANSLATION } from '../../localization'
import { ETimeTypes, IDateTime } from '../../tools/dateTime'
import CompareVariants, { ECompareVariants } from '../CompareVariants'

export interface IProps {
  value: IDateTime
  onChange: (newValue: IDateTime) => any
  isSimple?: boolean
}


const RNInput: React.FC<{
  label?: string
  value?: string
  onChangeText?: (text: string) => void
  keyboardType?: 'default' | 'numeric' | 'phone-pad'
  disabled?: boolean
  showDisablerCheckbox?: boolean
  onDisableChange?: () => void
  sideText?: string | undefined
  sideCheckbox?: { value: boolean; onClick: () => void; component?: React.ReactNode } | undefined
  compareVariant?: ECompareVariants | undefined
  onChangeCompareVariant?: (v: ECompareVariants) => void
  hideInput?: boolean
}> = ({
  label,
  value,
  onChangeText,
  disabled,
  showDisablerCheckbox,
  onDisableChange,
  sideText,
  sideCheckbox,
  compareVariant,
  onChangeCompareVariant,
  hideInput,
}) => {
  return (
    <View style={rnStyles.inputWrapper}>
      {label ? <Text style={rnStyles.label}>{label}</Text> : null}

      <View style={rnStyles.row}>

        {showDisablerCheckbox ? (
          <Pressable
            onPress={onDisableChange}
            style={[rnStyles.checkbox, disabled && rnStyles.checkboxDisabled]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !disabled }}
          >
            {!disabled ? <Text style={rnStyles.checkboxMark}>✓</Text> : null}
          </Pressable>
        ) : null}

        {!hideInput ? (
          <TextInput
            style={[rnStyles.textInput, disabled && rnStyles.inputDisabled]}
            value={value ?? ''}
            onChangeText={onChangeText}
            editable={!disabled}
            placeholder={label}
          />
        ) : (
          <View style={rnStyles.hiddenInputPlaceholder} />
        )}

 
        {sideText ? <Text style={rnStyles.sideText}>{sideText}</Text> : null}

        {sideCheckbox ? (
          <Pressable onPress={sideCheckbox.onClick} style={rnStyles.sideCheckbox}>
            {sideCheckbox.component ? (

              typeof sideCheckbox.component === 'string' ? (
                <Image source={{ uri: sideCheckbox.component as string }} style={rnStyles.icon} />
              ) : (
                <View>{sideCheckbox.component as React.ReactNode}</View>
              )
            ) : (
              <View style={[rnStyles.smallToggle, sideCheckbox.value && rnStyles.smallToggleActive]} />
            )}
          </Pressable>
        ) : null}
      </View>

      {compareVariant !== undefined && typeof onChangeCompareVariant === 'function' ? (
        <View style={rnStyles.compareWrapper}>
          <CompareVariants value={compareVariant} onChange={onChangeCompareVariant} />
        </View>
      ) : null}
    </View>
  )
}

const DateTimeIntervalInput: React.FC<IProps> = ({ value, onChange, isSimple }) => {
  // toggle disabled flags
  const handleIsDateDisabledChange = () => {
    onChange({ ...value, dateDisabled: !value.dateDisabled })
  }

  const handleIsTimeDisabledChange = () => {
    onChange({ ...value, timeDisabled: !value.timeDisabled })
  }

  const handleIsDateIntervalChange = () => {
    onChange({
      ...value,
      dateType: value.dateType === ETimeTypes.Interval ? ETimeTypes.Single : ETimeTypes.Interval,
    })
  }

  const handleIsTimeIntervalChange = () => {
    onChange({
      ...value,
      timeType: value.timeType === ETimeTypes.Interval ? ETimeTypes.Single : ETimeTypes.Interval,
    })
  }

  const handleDateComparatorChange = (comparator: ECompareVariants) => {
    onChange({
      ...value,
      dateComparator: comparator,
    })
  }

  const handleTimeComparatorChange = (comparator: ECompareVariants) => {
    onChange({
      ...value,
      timeComparator: comparator,
    })
  }

  const handleDateChange = (from?: boolean) => (text: string) => {
    onChange({
      ...value,
      date: from ? text : value.date,
      dateTill: from ? value.dateTill : text,
    })
  }

  const handleTimeChange = (from?: boolean) => (text: string) => {
    onChange({
      ...value,
      time: from ? text : value.time,
      timeTill: from ? value.timeTill : text,
    })
  }

  const isDateInterval = value.dateType === ETimeTypes.Interval
  const isTimeInterval = value.timeType === ETimeTypes.Interval

  return (
    <View style={[
      rnStyles.container,
      ((!isDateInterval && !isTimeInterval) || value.dateDisabled || value.timeDisabled) ? rnStyles.fields : null,
    ]}>
      {/* DATE row */}
      <View style={[rnStyles.fieldsRow, rnStyles.bottomRow]}>
        <RNInput
          label={t(TRANSLATION.DATE_P)}
          value={value.date}
          onChangeText={handleDateChange(true)}
          disabled={value.dateDisabled}
          showDisablerCheckbox={!isSimple}
          onDisableChange={handleIsDateDisabledChange}
          sideText={isDateInterval ? t(TRANSLATION.DATE_FROM, { toLower: true }) : undefined}
          sideCheckbox={
            isSimple ? undefined : {
              value: isDateInterval,
              onClick: handleIsDateIntervalChange,
              // show image icon
              component: <Image source={images.interval as ImageSourcePropType} style={rnStyles.icon} />,
            }
          }
          compareVariant={isDateInterval || isSimple ? undefined : value.dateComparator}
          onChangeCompareVariant={handleDateComparatorChange}
          hideInput={value.dateDisabled}
        />

        {isDateInterval && (
          <RNInput
            value={value.dateTill}
            onChangeText={handleDateChange()}
            disabled={value.dateDisabled}
            hideInput={value.dateDisabled}
            sideText={isDateInterval ? t(TRANSLATION.DATE_TILL, { toLower: true }) : undefined}
          />
        )}
      </View>

      {/* TIME row */}
      <View style={[rnStyles.fieldsRow, rnStyles.bottomRow]}>
        <RNInput
          label={t(TRANSLATION.TIME_P)}
          value={value.time}
          onChangeText={handleTimeChange(true)}
          disabled={value.timeDisabled}
          showDisablerCheckbox={!isSimple}
          onDisableChange={handleIsTimeDisabledChange}
          sideText={isTimeInterval ? t(TRANSLATION.DATE_FROM, { toLower: true }) : undefined}
          sideCheckbox={
            isSimple ? undefined : {
              value: isTimeInterval,
              onClick: handleIsTimeIntervalChange,
              component: <Image source={images.interval as ImageSourcePropType} style={rnStyles.icon} />,
            }
          }
          compareVariant={isTimeInterval || isSimple ? undefined : value.timeComparator}
          onChangeCompareVariant={handleTimeComparatorChange}
          hideInput={value.timeDisabled}
        />

        {isTimeInterval && (
          <RNInput
            value={value.timeTill}
            onChangeText={handleTimeChange()}
            disabled={value.timeDisabled}
            hideInput={value.timeDisabled}
            sideText={isTimeInterval ? t(TRANSLATION.TIME_TILL, { toLower: true }) : undefined}
          />
        )}
      </View>
    </View>
  )
}

const rnStyles = StyleSheet.create({
  container: {
  
    marginVertical: 8,
  },
  fields: {

  },
  fieldsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bottomRow: {

  },

  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#1D2A50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkboxMark: {
    color: '#1fdc00',
    fontSize: 14,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  hiddenInputPlaceholder: {
    flex: 1,
    height: 40,
  },
  sideText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  sideCheckbox: {
    marginLeft: 8,
  },
  smallToggle: {
    width: 18,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  smallToggleActive: {
    backgroundColor: '#32CD32',
  },
  compareWrapper: {
    marginTop: 6,
  },

  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  inputDisabled: {
    
  }
})

export default DateTimeIntervalInput
