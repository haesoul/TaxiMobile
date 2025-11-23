import React from 'react';
import { View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../../state';
import {
  userActionCreators,
  userSelectors,
} from '../../../state/user';

import { t, TRANSLATION } from '../../../localization';
import { EInputTypes } from '../../Input';

import Button from '../../Button';
import { Input } from './elements';

import styles from './STYLES';

const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
});

const mapDispatchToProps = {
  logout: userActionCreators.logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface IProps extends ConnectedProps<typeof connector> {}

function LogoutForm({ user, logout }: IProps) {
  if (!user) return null;

  return (
    <View style={styles.loginForm}>
      <Input
        inputProps={{
          disabled: true,
          value: user.u_phone ?? user.u_email,
        }}
        inputType={user.u_phone ? EInputTypes.MaskedPhone : EInputTypes.Default}
        label={t(TRANSLATION.LOGIN)}
        style={styles.loginFormInput}
      />

      <Button
        text={t(TRANSLATION.LOGOUT)}
        fixedSize={false}
        skipHandler={true}
        onPress={logout}
        style={styles.loginBtn}
      />
    </View>
  );
}

export default connector(LogoutForm);
