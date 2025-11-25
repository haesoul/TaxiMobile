import React from 'react';
import { Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import images from '../../constants/images';
import { t, TRANSLATION } from '../../localization';
import { IRootState } from '../../state';
import { modalsActionCreators, modalsSelectors } from '../../state/modals';
import { defaultAlarmModal } from '../../state/modals/reducer';
import { useInterval } from '../../tools/hooks';
import Button from '../Button';
import Overlay from './Overlay';
import { styles } from './STYLES';
const mapStateToProps = (state: IRootState) => ({
  seconds: modalsSelectors.alarmModalSeconds(state),
  isOpen: modalsSelectors.isAlarmModalOpen(state),
});

const mapDispatchToProps = {
  setAlarmModal: modalsActionCreators.setAlarmModal,
  closeAllModals: modalsActionCreators.closeAllModals,
  setRatingModal: modalsActionCreators.setRatingModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

const AlarmModal: React.FC<Props> = ({
  isOpen,
  seconds,
  setAlarmModal,
}) => {
  useInterval(() => {
    if (seconds <= 0) {
      if (isOpen) setAlarmModal({ ...defaultAlarmModal });
      return;
    }
    setAlarmModal({ isOpen: true, seconds: seconds - 1 });
  }, 1000);

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setAlarmModal({ ...defaultAlarmModal })}
    >
      <View style={styles.modal}>
        <View style={styles.modalFieldset}>
          <Text style={styles.modalFieldsetLegend}>{t(TRANSLATION.ALARM)}</Text>

          <View style={styles.timerModal}>

            <View style={styles.timerModalButton}>
              <images.timer />
            </View>
            <Text style={styles.timerModalButtonText}>
              {t(TRANSLATION.ESTIMATE)}{' '}
              <Text style={styles.timerModalButtonText}>{seconds}</Text>{' '}
              {t(TRANSLATION.SECONDS)}
            </Text>

            <Button
              text={t(TRANSLATION.CANCEL_ALARM)}
              onPress={() => setAlarmModal({ ...defaultAlarmModal })}
              style={styles.timerModalButton}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
};

export default connector(AlarmModal);

