import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import * as API from '../../API';
import { t, TRANSLATION } from '../../localization';
import SITE_CONSTANTS from '../../siteConstants';
import store, { IRootState } from '../../state';
import { clientOrderSelectors } from '../../state/clientOrder';
import { modalsActionCreators, modalsSelectors } from '../../state/modals';
import { ordersActionCreators } from '../../state/orders';
import Button from '../Button';
import Overlay from './Overlay';
import { styles } from './STYLES';

const mapStateToProps = (state: IRootState) => ({
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  isOpen: modalsSelectors.isCancelModalOpen(state),
});

const mapDispatchToProps = {
  setCancelModal: modalsActionCreators.setCancelModal,
  setVoteModal: modalsActionCreators.setVoteModal,
  setDriverModal: modalsActionCreators.setDriverModal,
  setOnTheWayModal: modalsActionCreators.setOnTheWayModal,
  getActiveOrders: ordersActionCreators.getActiveOrders,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const CancelOrderModal: React.FC<Props> = ({
  selectedOrder,
  isOpen,
  setCancelModal,
  setVoteModal,
  setDriverModal,
  setOnTheWayModal,
  getActiveOrders,
}) => {
  const REASONS = [
    { id: 0, label: t(TRANSLATION.MISTAKENLY_ORDERED) },
    { id: 1, label: t(TRANSLATION.WAITING_FOR_LONG) },
    { id: 2, label: t(TRANSLATION.CONFLICT_WITH_RIDER) },
    { id: 3, label: t(TRANSLATION.VERY_EXPENSIVE) },
  ] as const;

  const REASONS_IDS = REASONS.map(item => item.id);

  const [reason, setReason] = useState<typeof REASONS_IDS[number]>(REASONS[0].id);

  function onDenial() {
    if (selectedOrder) {
      API.cancelDrive(selectedOrder, REASONS?.find(item => item.id === reason)?.label)
        .finally(() => getActiveOrders());
    }
    setCancelModal(false);
    setVoteModal(false);
    setDriverModal(false);
    setOnTheWayModal(false);
  }
  SITE_CONSTANTS.init(store.getState().global.data);
  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setCancelModal(false)}
    >
      <View style={[styles.modal, styles.cancelOrderModal, styles.messageWindow]}>
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
          {REASONS.map(item => {
            const isActive = reason === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setReason(item.id)}
                style={[
                  styles.cancelOrderModalReasonItem,
                  isActive && styles.cancelOrderModalReasonItemActive,
                  isActive && { backgroundColor: SITE_CONSTANTS.PALETTE.primary.light }
                ]}
              >
                <Text style={isActive ? { color: SITE_CONSTANTS.PALETTE.primary.dark } : undefined}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.modalButtonsBlock}>
          <Button
            text={t(TRANSLATION.CANCEL_ORDER)}
            onPress={onDenial}
          />
          <Button
            text={t(TRANSLATION.CANCEL)}
            onPress={() => setCancelModal(false)}
          />
        </View>
      </View>
    </Overlay>
  );
};

export default connector(CancelOrderModal);
