import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import * as API from '../../API';
import images from '../../constants/images';
import { t, TRANSLATION } from '../../localization';
import SITE_CONSTANTS from '../../siteConstants';
import store, { IRootState } from '../../state';
import { clientOrderSelectors } from '../../state/clientOrder';
import { modalsActionCreators, modalsSelectors } from '../../state/modals';
import { ordersSelectors } from '../../state/orders';
import { useInterval } from '../../tools/hooks';
import { EColorTypes } from '../../types/types';
import Button from '../Button';
import Overlay from './Overlay';
import { styles } from './STYLES';

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isVoteModalOpen(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
  activeOrders: ordersSelectors.activeOrders(state),
});

const mapDispatchToProps = {
  setVoteModal: modalsActionCreators.setVoteModal,
  setCancelModal: modalsActionCreators.setCancelModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface IProps extends ConnectedProps<typeof connector> {}

const VoteModal: React.FC<IProps> = ({
  isOpen,
  selectedOrder,
  activeOrders,
  setVoteModal,
  setCancelModal,
}) => {
  const order = activeOrders?.find(item => item.b_id === selectedOrder);
  
  SITE_CONSTANTS.init(store.getState().global.data);
  const [sumSeconds, setSumSeconds] = useState(order?.b_max_waiting || SITE_CONSTANTS.WAITING_INTERVAL);
  const [seconds, setSeconds] = useState(
    order?.b_start_datetime
      ? sumSeconds - moment().diff(order?.b_start_datetime, 'seconds')
      : sumSeconds,
  );

  // --- TIMER ---
  useInterval(() => {
    const newSeconds = order?.b_start_datetime
      ? (sumSeconds - moment().diff(order?.b_start_datetime, 'seconds'))
      : sumSeconds;

    if (newSeconds <= 0 && isOpen) {
      setVoteModal(false);
      setSeconds(order?.b_max_waiting || SITE_CONSTANTS.WAITING_INTERVAL);
      setSumSeconds(order?.b_max_waiting || SITE_CONSTANTS.WAITING_INTERVAL);
      return;
    }
    setSeconds(newSeconds);
  }, 1000);

  useEffect(() => {
    if (isOpen) {
      setSeconds(
        order?.b_start_datetime
          ? (sumSeconds - moment().diff(order?.b_start_datetime, 'seconds'))
          : sumSeconds,
      );
      setSumSeconds(order?.b_max_waiting || SITE_CONSTANTS.WAITING_INTERVAL);
    }
  }, [isOpen, selectedOrder]);

  // --- HANDLERS ---
  const onWaiting = () => {
    if (!selectedOrder) return;

    const additionalTime = 180;

    API.setWaitingTime(selectedOrder, sumSeconds)
      .then(() => {
        setSumSeconds((prev: any) => prev + additionalTime);
        setSeconds((prev: any) => prev + additionalTime);
      })
      .catch(console.error);
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setVoteModal(false)}
    >
      <View style={[styles.modal, styles.voteModalGrouppedButtons]}>
        
        {/* Legend */}
        <Text style={styles.title}>
          {t(TRANSLATION.ORDER)} №{selectedOrder}     {t(TRANSLATION.DRIVE)} №{order?.b_driver_code}
        </Text>

        {/* TIMER BLOCK */}
        <View style={styles.voteModalVoteBlock}>

          {/* Timer Image */}

          <View style={styles.voteModalVoteBlockTimerImg}>
            <images.timer />
          </View>

          {/* Seconds */}
          <View style={styles.voteModalVoteBlockArticle}>
            <Text style={styles.voteModalVoteBlockArticleText}>
              {t(TRANSLATION.LEFT)}
            </Text>

            <Text style={styles.voteModalVoteBlockArticleSpan}>
              {seconds}
            </Text>

            <Text style={styles.voteModalVoteBlockArticleText}>
              {t(TRANSLATION.SECONDS)}
            </Text>
          </View>

          {/* Continue Button */}
          <Button
            text={t(TRANSLATION.CONTINUE_WAITING)}
            onPress={onWaiting}
            style={styles.voteModalBtn}
            buttonStyle={styles.voteModalBtnButton}
          />

          {/* Cancel */}
          <View style={styles.voteModalGrouppedButtons}>
            <Button
              type="button"
              text={t(TRANSLATION.CANCEL)}
              colorType={EColorTypes.Accent}
              onPress={() => {
                setVoteModal(false);
                setCancelModal(true);
              }}
              style={styles.voteModalBtn}
              buttonStyle={styles.voteModalBtnCancelButton}
              textStyle={styles.voteModalBtnCancelButtonText}
            />
          </View>

        </View>
      </View>
    </Overlay>
  );
};

export default connector(VoteModal);
