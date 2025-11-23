import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import images from '../../constants/images';
import { t, TRANSLATION } from '../../localization';
import { IRootState } from '../../state';
import { clientOrderActionCreators } from '../../state/clientOrder';
import { modalsActionCreators } from '../../state/modals';
import { ordersSelectors } from '../../state/orders';
import {
  EPaymentType,
  formatCurrency,
  getOrderCount,
  getOrderIcon,
  getPayment,
} from '../../tools/utils';
import { EBookingDriverState, EColorTypes, IOrder } from '../../types/types';
import Button from '../Button';
import ChatToggler from '../Chat/Toggler';

const mapStateToProps = (state: IRootState) => ({
  activeOrders: ordersSelectors.activeOrders(state),
});

const mapDispatchToProps = {
  setSelectedOrder: clientOrderActionCreators.setSelectedOrder,
  setCancelModal: modalsActionCreators.setCancelModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface IProps extends ConnectedProps<typeof connector> {
  className?: string;
  handleOrderClick: (order: IOrder) => any;
}

function MiniOrders({
  activeOrders,
  setSelectedOrder,
  setCancelModal,
  handleOrderClick,
}: IProps) {
  if (!activeOrders?.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniOrders}>
      {activeOrders.map(order => {
        const payment = getPayment(order);
        const orderDriver = order?.drivers &&
          order.drivers?.find(item => item.c_state !== EBookingDriverState.Canceled);

        const isDisabled =
          !order.drivers?.length &&
          !order?.b_voting &&
          !['96', '95'].some(item => order?.b_comments?.includes(item));

        return (
          <TouchableOpacity
            key={order.b_id}
            style={[styles.orderCard, isDisabled && styles.disabled]}
            onPress={() => handleOrderClick(order)}
          >
            <Text style={[styles.orderId]}>{`№ ${order.b_id}`}</Text>

            <Text style={styles.stateText}>
              {t(
                order.drivers?.length
                  ? TRANSLATION.BOOKING_DRIVER_STATES[
                      order.drivers[0].c_state || EBookingDriverState.Performer
                    ]
                  : TRANSLATION.SEARCH,
              )}
            </Text>

            <Image source={images.stars} style={styles.starsImg} />

            <Text style={styles.waitingTime}>
              {order.b_estimate_waiting || 0} {t(TRANSLATION.MINUTES)}
            </Text>

            <View style={styles.orderTypeRow}>
              <Image
                source={getOrderIcon(order)}
                style={styles.orderTypeIcon}
                resizeMode="contain"
              />
              <Text style={styles.orderTypeText}>{getOrderCount(order)}</Text>
            </View>

            <Text
              style={[
                styles.orderAmount,
                payment.type === EPaymentType.Customer && styles.orderAmountBlue,
              ]}
            >
              {payment.type === EPaymentType.Customer ? '⥮' : '~'}
              {typeof payment.value === 'number'
                ? formatCurrency(payment.value)
                : payment.value}
            </Text>

            <View style={styles.button}>
              <Button
                type="button"
                text={t(TRANSLATION.CANCEL)}
                colorType={EColorTypes.Accent}
                onPress={() => {
                  setSelectedOrder(order.b_id);
                  setCancelModal(true);
                }}
              />
            </View>

            {orderDriver && (
              <ChatToggler anotherUserID={orderDriver.u_id} orderID={order.b_id} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default connector(MiniOrders);

const styles = StyleSheet.create({
  miniOrders: {
    flexDirection: 'row',
    padding: 5,
  },

  orderCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
    paddingVertical: 10,

    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    marginRight: 20,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.23,
    shadowRadius: 7,
    elevation: 3,
  },

  disabled: {
    opacity: 0.5,
  },

  orderId: {
    fontSize: 15,
    color: 'grey',
  },

  stateText: {
    fontSize: 21,
    lineHeight: 25,
    textAlign: 'center',
  },

  starsImg: {
    width: 60,
    height: 12,
    marginVertical: 5,
  },

  waitingTime: {
    fontSize: 21,
    lineHeight: 25,
  },

  orderTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  orderTypeIcon: {
    width: 30,
    height: 30,
  },

  orderTypeText: {
    fontWeight: '500',
    fontSize: 27,
    lineHeight: 32,
    marginLeft: 5,
  },

  orderAmount: {
    fontWeight: '500',
    fontSize: 29,
    lineHeight: 34,
  },

  orderAmountBlue: {
    color: '#0094FF',
  },

  button: {
    marginTop: 10,
    marginBottom: 0,
  },
});
