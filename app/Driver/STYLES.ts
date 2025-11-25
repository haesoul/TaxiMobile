// driverStyles.react-native.js
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  android: {
    elevation: 4,
  },
  default: {},
});

export const MIN_TOUCH_SIZE = 44;
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 7
  }, 
  /* === driver-tabs === */
  driverTabs: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
    marginTop: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  // tab button base
  driverTabsTab: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: '#E7E7E7',
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // recommended touch area
    minHeight: MIN_TOUCH_SIZE,
    minWidth: 0,
  },
  driverTabsTabText: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: 13,
    color: 'rgba(0,0,0,0.25)',
  },
  driverTabsTabActive: {
    backgroundColor: '#FF2400',
  },
  driverTabsTabActiveText: {
    color: '#FFFFFF',
  },

  driverTabsSpan: {
    fontWeight: '300',
    fontSize: 17,
    lineHeight: 20,
    color: '#5E5E5E',
  },
  driverTabsLabel: {
    marginHorizontal: 5,
  },

  /* === driver-statuses === */
  driverStatuses: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  // each status item (span)
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // cursor: pointer -> handled by Touchable in component
    paddingRight: 8, // default; conditional removal for last-child should be controlled in component
    borderRightWidth: 1,
    borderRightColor: '#F1F1F1',
  },
  statusItemNoBorder: {
    borderRightWidth: 0,
    paddingRight: 0,
  },

  statusLabel: {
    fontWeight: '300',
    fontSize: 17,
    lineHeight: 20,
    color: '#5E5E5E',
  },

  // little square/badge variants
  statusBadgeBase: {
    height: 24,
    width: 24,
    borderRadius: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#FF2400',
  },
  statusBadgeRecomended: {
    backgroundColor: '#00A72F',
    borderWidth: 0,
  },
  statusBadgeRequested: {
    backgroundColor: '#FFD12E',
    borderWidth: 0,
  },
  statusBadgeTrip: {},
  statusBadgeWaiting: {},
  statusBadgeRating: {},
  statusBadgeUrgently: {},
  statusBadgeTaken: {},

  /* === driver-orders === */
  driverOrders: {
    position: 'relative',
    // height: 0 + overflow hidden -> initial collapsed state can be:
    height: 0,
    overflow: 'hidden',
    fontWeight: '400',
    padding: 0,
  },
  driverOrdersSeparatorBefore: {
    // CSS :not(:last-child)::before — implement by conditionally rendering a View.separator
    position: 'absolute',
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: '#F1F1F1',
    bottom: 0,
  },
  driverOrdersActive: {
    height: 'auto', // in RN you typically remove height restriction
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  driverOrdersEmpty: {
    fontSize: 13,
    fontWeight: '500',
  },

  /* === driver-order-map-mode === */
  driverOrderMapMode: {
    position: 'relative',
    // avoid 100vh; use flex:1 in RN container that wraps the Map component
    flex: 1,
    overflow: 'hidden',
  },

  leafletDivIcon: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  leafletTopLeft: {
    zIndex: 400, // Android needs elevation
    ...Platform.select({ android: { elevation: 400 }, ios: {} }),
  },

  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  noCoordsOrders: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 400,
    color: 'red',
    backgroundColor: '#fff',
    padding: 20,
    // cursor: pointer -> wrap in Touchable
    borderWidth: 0,
  },

  /* order-marker (container) */
  orderMarker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    // cursor: pointer -> use Touchable wrapper
  },

  // profit modifiers (apply conditionally in component)
  orderMarkerProfitLow_hint: {
    backgroundColor: '#C19276',
  },
  orderMarkerProfitLow_text: {
    color: '#3E0C0C',
  },
  orderMarkerProfitMedium_hint: {
    backgroundColor: '#FFFB8E',
  },
  orderMarkerProfitMedium_text: {
    color: '#A37211',
  },
  orderMarkerProfitHigh_hint: {
    backgroundColor: '#A1FF97',
  },
  orderMarkerProfitHigh_text: {
    color: '#22A613',
  },

  orderProfitEstimation: {
    color: '#636363',
  },

  /* popup-list */
  popupList: {
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    // center horizontally: left 50% + transform translateX(-50%) -> in RN, calculate using left & width or use alignSelf
    alignSelf: 'center',
    lineHeight: 1,
    ...shadow,
    zIndex: 3,
  },
  popupListUl: {
    padding: 0,
    margin: 0,
    // listStyleType: 'none',
  },
  popupListLi: {
    textAlign: 'center',
  },

  /* order-marker-hint */
  orderMarkerHint: {
    flexDirection: 'column',
    borderRadius: 4,
    ...shadow,
    backgroundColor: '#ffffff',
    width: 'auto',
    maxWidth: screenWidth * 0.3, // ~30vw
    padding: 5,
    marginBottom: 3,
  },

  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    width: '100%',
    textAlign: 'center',
  },
  // styling of inner elements inside rowInfo (competitors-num, price, tips)
  competitorsNum: {
    borderRadius: 8,
    backgroundColor: 'rgba(209,120,255,1)',
    marginLeft: 5,
    paddingHorizontal: 2,
  },
  pricePill: {
    backgroundColor: 'rgba(255,223,66,1)',
    marginRight: 5,
    paddingHorizontal: 2,
  },
  tipsPill: {
    backgroundColor: 'rgba(202,226,108,1)',
    marginRight: 5,
    paddingHorizontal: 2,
  },

  // image general
  markerImg: {
    zIndex: 3,
    resizeMode: 'contain',
  },

  // hr vertical line variants -> implement as Views with absolute pos
  hrVerticalBase: {
    position: 'absolute',
    left: '50%',
    width: 2,
    backgroundColor: '#353535',
  },
  hrTop: {
    top: 25,
    zIndex: 2,
    height: 35,
  },
  hrBottom: {
    bottom: -2,
    zIndex: -1,
    height: 22,
  },

  bottomDot: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -4, // half width to center
    backgroundColor: '#000',
    width: 8,
    height: 7,
    borderRadius: 4,
    zIndex: -2,
  },

  finishDriveButton: {
    position: 'absolute',
    // fixed bottom center -> in RN use absolute positioned inside a full-screen container
    bottom: 80,
    left: '50%',
    // translateX(-50%) -> use marginLeft negative half width or wrap and center using alignSelf
    transform: [{ translateX: -(screenWidth * 0.5) + (screenWidth * 0.5) }], // noop placeholder; better to center parent view
    zIndex: 1000,
    width: '90%',
    maxWidth: 400,
    marginHorizontal: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FF2400',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    // shadow
    ...shadow,
  },
  finishDriveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  /* errorIcon */
  errorIcon: {
    marginTop: 20,
    width: 250,
    height: 250,
    minHeight: 250,
    textAlign: 'center',
    backgroundColor: '#fff',
    ...shadow,
    borderRadius: 125, // 100% circular for 250x250
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Utilities / recommended RN defaults */
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCol: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverOrderWideModeStatusCard: {}
});
