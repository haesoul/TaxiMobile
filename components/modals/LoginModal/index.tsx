// LoginModal.native.tsx
import { useRoute } from '@react-navigation/native'; // react-navigation
import React, { useMemo } from 'react';
import {
  Modal,
  // SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { t, TRANSLATION } from '../../../localization';
import { IRootState } from '../../../state';
import { modalsActionCreators, modalsSelectors } from '../../../state/modals';
import {
  userActionCreators,
  userSelectors,
} from '../../../state/user';
import { LOGIN_TABS } from '../../../state/user/constants';
import { EStatuses } from '../../../types/types';
import LoadFrame from '../../LoadFrame';
import Tabs from '../../tabs/Tabs';
import VersionInfo from '../../version-info';
import LoginForm from './Login';
import LogoutForm from './LogoutForm';
import RegisterForm from './Register';
import RegisterJSON from './RegisterJSON';
import styles from './STYLES';

import { SafeAreaView } from 'react-native-safe-area-context';

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isLoginModalOpen(state),
  user: userSelectors.user(state),
  status: userSelectors.status(state),
  tab: userSelectors.tab(state),
});

const mapDispatchToProps = {
  setLoginModal: modalsActionCreators.setLoginModal,
  setTab: userActionCreators.setTab,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface IProps extends PropsFromRedux {}

function LoginModal({
  isOpen,
  user,
  status,
  tab,
  setTab,
  setLoginModal,
}: IProps) {

  const route = useRoute();

  const path =
    route?.name ??
    (route?.params && "path" in route.params ? (route.params as any).path : undefined) ??
    (route?.params && "screen" in route.params ? (route.params as any).screen : undefined) ??
    "";
  

  const _TABS = user
    ? []
    : LOGIN_TABS.map((item) => ({
        ...item,
        label: t(item.label),
      }));

  const RegisterComponent = path.includes('/driver-order')
    ? RegisterJSON
    : RegisterForm;

  return (
    <Modal
      visible={!!isOpen}
      transparent
      animationType="fade"
      hardwareAccelerated
      onRequestClose={() => setLoginModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setLoginModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      </TouchableWithoutFeedback>

      <SafeAreaView
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.loginModal}>
          {status === EStatuses.Loading && (
            <View style={styles.loadingFrame}>
              <LoadFrame />
            </View>
          )}

          <View style={styles.fieldset}>
            <Text style={styles.legend}>
              {user
                ? t(TRANSLATION.PROFILE)
                : tab === 'sign-in'
                ? t(TRANSLATION.SIGN_IN_HEADER)
                : t(TRANSLATION.SIGNUP)}
            </Text>

            <View style={styles.loginSection}>
              {useMemo(
                () =>
                  _TABS.length > 0 && (
                    <Tabs
                      tabs={_TABS}
                      activeTabID={tab}
                      onChange={(id: string | number) => setTab(id as typeof tab)}
                      gradient={() => 'black'}
                    />
                  ),
                [_TABS, tab]
              )}

              {useMemo(
                () =>
                  user ? (
                    <LogoutForm />
                  ) : tab === 'sign-in' ? (
                    <LoginForm isOpen={!!isOpen} />
                  ) : (
                    <RegisterComponent isOpen={!!isOpen} />
                  ),
                [user, tab, isOpen]
              )}
            </View>
          </View>

          <VersionInfo />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default connector(LoginModal);
