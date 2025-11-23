import React from 'react';
import { Image, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import images from '../../constants/images';
import { t, TRANSLATION } from '../../localization';
import { IRootState } from '../../state';
import { modalsActionCreators, modalsSelectors } from '../../state/modals';
import Button from '../Button';
import Overlay from './Overlay';
import { styles } from './STYLES';

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isMapModalOpen(state),
});

const mapDispatchToProps = {
  setTieCardModal: modalsActionCreators.setTieCardModal,
  setCardDetailsModal: modalsActionCreators.setCardDetailsModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface IProps extends ConnectedProps<typeof connector> {}

const TieCardModal: React.FC<IProps> = ({
  isOpen,
  setTieCardModal,
  setCardDetailsModal,
}) => {
  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setTieCardModal(false)}
    >
      <View style={[styles.modal, styles.tieCardModalInfoBlock]}>
        <View>
          <Text>{t(TRANSLATION.TIE_CARD_HEADER)}</Text>

          <View style={styles.tieCardModalInfoBlock}>
            <Image
              source={images.cardIcon}
              style={styles.tieCardModalIcon}
              resizeMode="contain"
            />

            <Text style={styles.tieCardModalInfoBlockArticle}>
              {t(TRANSLATION.TIE_CARD_ARTICLE)}
            </Text>

            <Text style={styles.tieCardModalInfoBlockP}>
              ({t(TRANSLATION.TIE_CARD_DESCRIPTION)})
            </Text>

            <Button
              text={t(TRANSLATION.ADD_CARD)}
              onPress={() => setCardDetailsModal(true)}
              style={styles.tieCardModalAddBtn}
              buttonStyle={styles.tieCardModalAddBtnButton}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
};

export default connector(TieCardModal);
