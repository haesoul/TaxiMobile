import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { t, TRANSLATION } from '../../localization';
import { IRootState } from '../../state';
import { clientOrderSelectors } from '../../state/clientOrder';
import { formatCurrency, getPhoneNumberError } from '../../tools/utils';
import Icon from '../Icon';

const mapStateToProps = (state: IRootState) => ({
  time: clientOrderSelectors.time(state),
  seats: clientOrderSelectors?.seats(state) ?? 1,
  carClass: clientOrderSelectors.carClass(state),
  customerPrice: clientOrderSelectors.customerPrice(state),
  phone: clientOrderSelectors.phone(state),
});

const connector = connect(mapStateToProps);
interface IProps extends ConnectedProps<typeof connector> {}

function ShortInfo({ time, seats, carClass, customerPrice, phone }: IProps) {
  const items: {
    name: React.ComponentProps<typeof Icon>['src'];
    value: string | null;
    active?: boolean;
  }[] = [
    {
      name: 'alarm',
      value: time === 'now' ? t(TRANSLATION.NOW) : time.format('HH:mm'),
    },
    { name: 'people', value: `${seats}` },
    { name: 'car', value: t(TRANSLATION.CAR_CLASSES[carClass]) },
    {
      name: 'money',
      value: customerPrice !== null ? formatCurrency(customerPrice) : null,
    },
    {
      name: 'call',
      value: '',
      active: useMemo(() => getPhoneNumberError(phone) === null, [phone]),
    },
    { name: 'msg', value: '' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.shortInfo}
    >
      {items.map(({ name, value, active = true }, index) =>
        value !== null ? (
          <React.Fragment key={name}>
            <View
              style={[
                styles.shortInfoItem,
                active && styles.shortInfoItemActive,
              ]}
            >
              <Icon style={styles.shortInfoIcon} src={name} />
              <Text style={styles.shortInfoText}>{value}</Text>
            </View>
            {index < items.length - 1 && <View style={styles.shortInfoLine} />}
          </React.Fragment>
        ) : null
      )}
    </ScrollView>
  );
}

export default connector(ShortInfo);

const styles = StyleSheet.create({
  shortInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    overflow: 'hidden',
    height: 16,
  },
  shortInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
    fontSize: 10,
    fontWeight: '500',
  },
  shortInfoItemActive: {

  },
  shortInfoLine: {
    width: 1,
    height: 12,
    borderRadius: 0.5,
    backgroundColor: '#E7E7E7',
  },
  shortInfoIcon: {
    width: 16,
    height: 16,

  },
  shortInfoText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
