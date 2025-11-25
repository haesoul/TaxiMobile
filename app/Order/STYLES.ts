

import { Platform, StyleSheet } from 'react-native';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

export default StyleSheet.create({
  order: {
    flexDirection: 'column',
  },

  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  passengerInfoMeta: {
    flexDirection: 'column',
    marginLeft: 17,
  },
  passengerInfoName: {
    fontWeight: '400',
    fontSize: 26,
    lineHeight: 30,
  },
  passengerInfoIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerInfoIconImg: {
    height: 17,
    resizeMode: 'contain',
  },

  // .order__separator
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79,0,0,0.22)',
    marginBottom: 10,
    height: 0,
    // box-shadow в RN не поддерживается — используем shadow / elevation при необходимости
  },

  // .order__from-to
  fromTo: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    lineHeight: 23,
    marginBottom: 10,
  },
  deliveryText: {
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 23,
  },
  deliverySpanBlock: {
    marginBottom: 20,
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // .from, .to
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButtonImg: {
    width: 25,
    height: 25,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  label: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
  },
  labelStrong: {
    fontWeight: '600',
  },

  estimateTime: {
    marginBottom: 10,
    color: '#B8B8B8',
  },

  orderInfoFurnitureImg: {
    resizeMode: 'contain',
  },
  orderInfoFurnitureText: {
    fontWeight: '300',
  },

  orderFields: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneLink: {
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  orderFieldsTitle: {
    marginRight: 8,
  },
  orderFieldsImg: {
    marginRight: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  orderFieldsLabel: {
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 23,
  },
  orderFieldsLabelStrong: {
    fontWeight: '600',
  },
  negative: {
    fontWeight: '300',
  },

  currency: {
    fontWeight: '500',
    fontSize: 25,
    lineHeight: 34,
    textAlign: 'right',
    color: '#FF5C00',
    marginRight: 10,
  },

  comment: {
    alignItems: 'flex-start',
  },

  takeOrderBtnContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  takeOrderBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    backgroundColor: '#EC4C60',
  },
  takeOrderBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  hideOrderBtnContainer: {
    marginVertical: 15,
  },
  hideOrderBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#939393',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },
  hideOrderBtnText: {
    color: '#4A4A4A',
  },

  alarmBtnContainer: {
    marginTop: 10,
  },
  alarmBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FBD300',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF500',
  },
  alarmBtnText: {
    color: '#414141',
  },

  touchable: {
    minWidth: 44,
    minHeight: 44,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center' },
  column: { flexDirection: 'column' },
});
