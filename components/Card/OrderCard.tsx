import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Svg, { Circle, Ellipse, Path, SvgProps } from 'react-native-svg';



import { t, TRANSLATION } from '../../localization';
import { CURRENCY } from '../../siteConstants';
import { modalsActionCreators } from '../../state/modals';
import {
  ordersDetailsActionCreators,
  ordersDetailsSelectors,
} from '../../state/ordersDetails';
import { useSelector } from '../../tools/hooks';
import {
  dateFormatDate,
  dateShowFormat,
  formatCommentWithEmoji,
  formatCurrency,
  getOrderCount,
  getPayment,
  shortenAddress,
} from '../../tools/utils';
import {
  EBookingDriverState,
  EOrderProfitRank,
  IOrder,
  IUser,
} from '../../types/types';
import { Loader } from '../loader/Loader';

import { Image, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DollarMinimalistic from '../assets/default/dollarMinimalistic.svg';


interface DollarIconProps extends SvgProps {
  size?: number;
}

const DollarIcon = ({ size = 16, ...props }: DollarIconProps) => (
  <DollarMinimalistic width={size} height={size} {...props} />
);

const ClockIcon = ({ color = '#FF2400' }) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7.82996 5.33334V8.66668H11.1633" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


const SeatsIcon = ({ color = '#FF2400' }) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Circle cx="6.00004" cy="4.00001" r="2.66667" stroke={color} />
    <Path d="M10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2" stroke={color} strokeLinecap="round" />
    <Ellipse cx="6.00004" cy="11.3333" rx="4.66667" ry="2.66667" stroke={color} />
    <Path d="M12 9.33334C13.1695 9.58981 14 10.2393 14 11C14 11.6862 13.3242 12.282 12.3333 12.5803" stroke={color} strokeLinecap="round" />
  </Svg>
);


const mapDispatchToProps = {
  getOrderStart: ordersDetailsActionCreators.getOrderStart,
  setOrderCardModal: modalsActionCreators.setOrderCardModal,
};

const connector = connect(undefined, mapDispatchToProps);

interface IProps extends ConnectedProps<typeof connector> {
  user: IUser,
  order: IOrder,
  className?: string,
  // style?: React.CSSProperties,
  style?: StyleProp<ViewStyle>;
  onClick?: () => void,
  showChat?: boolean
}

function OrderCard({
  getOrderStart,
  setOrderCardModal,
  order,
  user,
  className,
  showChat,
  style,
  onClick,
}: IProps) {

  useEffect(() => {
    getOrderStart(order)
  }, [order])

  let address = useSelector(ordersDetailsSelectors.start, order.b_id)
  if (address && 'details' in address)
    address = {
      ...address,
      shortAddress: shortenAddress(
        address.address,
        address.details.city ||
        address.details.town ||
        address.details.village,
      ),
    }

  const getStatusText = () => {
    if (order.b_voting) return t(TRANSLATION.VOTER)
    return ''
  }

  const getStatusTextColor = () => {
    if (order.b_voting) return '#FF2400'

    return 'rgba(0, 0, 0, 0.25)'
  }

  const driver = order.drivers?.find((item: any) => item.c_state > EBookingDriverState.Canceled)

  const isHistory = order.b_canceled || order.b_completed;


  const cardStyle = [
    styles.statusCard,
    isHistory && styles.statusCardHistory,
    getProfitBackgroundStyle(order.profitRank),
    style,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => setOrderCardModal({ isOpen: true, orderId: order.b_id })}
      // onPress={onClick}
    >

      <View style={styles.statusCardTop}>
        <View style={styles.statusCardTime}>
          <ClockIcon />
          <Text style={styles.statusCardTimeLabel}>
            {
              order.b_voting &&
              driver?.c_state !== EBookingDriverState.Finished ?
                t(TRANSLATION.NOW) :
                order.b_start_datetime?.format(
                  order.b_options?.time_is_not_important ? dateFormatDate : dateShowFormat,
                )
            }
          </Text>
        </View>
        <Text style={[styles.statusCardNumber, { color: getStatusTextColor() }]}>
          №{order.b_id} {getStatusText()}
        </Text>
      </View>

      <View>
        <View style={styles.statusCardPoints}>
          <View style={styles.statusCardFrom}>
            <Text style={styles.statusCardFromAddress}>
              <Text>{t(TRANSLATION.FROM)}:</Text>{' '}
              {address ? (
                <Text style={styles.statusCardFromAddressValue}>
                  {address?.shortAddress ? address?.shortAddress : address?.address}
                </Text>
              ) : order.b_start_address ? (
                <Text style={styles.statusCardFromAddressValue}>{order.b_start_address}</Text>
              ) : (
                <Loader />
              )}
            </Text>
            <Text style={styles.statusCardFromAddress}>
              <Text>{t(TRANSLATION.TO)}:</Text>{' '}
              <Text style={styles.statusCardFromAddressValue}>
                {order.b_destination_address ||
                  `${order.b_destination_latitude}, ${order.b_destination_longitude}`
                }
              </Text>
            </Text>
          </View>
        </View>
      </View>


      <View style={[styles.statusCardSeparator, styles.statusCardMoney, styles.separate]}>
        <View style={styles.statusCardCostWrapper}>


          {/* <Image source={images.dollarMinimalistic} style={styles.statusCardCostIcon} /> */}
          <DollarIcon size={16} style={styles.statusCardCostIcon} />
          <Text style={styles.statusCardCost}>
            {getPayment(order).value} {CURRENCY.NAME}
          </Text>
        </View>

        {order.profit !== undefined &&
          <Text style={[styles.statusCardProfit, getProfitTextStyle(order.profitRank)]}>
            {formatCurrency(order.profit, { signDisplay: 'always' })}
          </Text>
        }
      </View>

      <View style={styles.statusCardComments}>
        <View style={styles.statusCardCommentsP}>
          {formatCommentWithEmoji(order.b_comments)?.map(({ src }, index) => (
            // <Image key={index} source={src} style={styles.commentIcon} />
            <Image key={index} source={{ uri: src }} style={styles.commentIcon} />

          ))}
        </View>
        {
          !(order.b_comments?.includes('97') || order.b_comments?.includes('98')) &&
          <View style={styles.statusCardSeats}>
            <SeatsIcon />
            <Text style={styles.statusCardSeatsLabel}>{getOrderCount(order)}</Text>
          </View>
        }
      </View>
    </TouchableOpacity>
  );
}

export default connector(OrderCard);


const lowProfitBg = '#C19276';
const lowProfitFg = '#3E0C0C';
const mediumProfitBg = '#FFFB8E';
const mediumProfitFg = '#A37211';
const highProfitBg = '#A1FF97';
const highProfitFg = '#22A613';


export const getProfitBackgroundStyle = (rank?: EOrderProfitRank): ViewStyle => {
  switch (rank) {
    case EOrderProfitRank.Low:
      return { backgroundColor: lowProfitBg };
    case EOrderProfitRank.Medium:
      return { backgroundColor: mediumProfitBg };
    case EOrderProfitRank.High:
      return { backgroundColor: highProfitBg };
    default:
      return {};
  }
};

export const getProfitTextStyle = (rank?: EOrderProfitRank): TextStyle => {
  switch (rank) {
    case EOrderProfitRank.Low:
      return { color: lowProfitFg };
    case EOrderProfitRank.Medium:
      return { color: mediumProfitFg };
    case EOrderProfitRank.High:
      return { color: highProfitFg };
    default:
      return {};
  }
};

export const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#AE0000',
    borderRadius: 13,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 7,
    elevation: 3,
    padding: 10,
    marginBottom: 8,
  },


  statusCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  statusCardNumber: {
    fontSize: 11,
    fontWeight: '500',

  },

  statusCardPoints: {
    paddingTop: 8,
    width: '100%',
  },

  statusCardFrom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  statusCardFromAddress: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.25)',
    marginBottom: 4,
  },
  statusCardFromAddressValue: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '500',
    flexShrink: 1,
  },

  statusCardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusCardTimeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000000',
  },

  statusCardSeparator: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusCardMoney: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 8,
  },
  separate: {
    justifyContent: 'center',
  },

  statusCardCostWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statusCardCost: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '500',
  },
  statusCardCostIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  statusCardProfit: {
    fontSize: 18,
    fontWeight: 'normal',
  },

  statusCardComments: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statusCardCommentsP: {
    maxWidth: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },

  statusCardSeats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusCardSeatsLabel: {
    fontWeight: '500',
    fontSize: 10,
    color: '#000000',
  },
  statusCardHistory: {
    opacity: 0.5,
  },

});