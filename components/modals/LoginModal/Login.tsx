// LoginForm.native.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import * as yup from 'yup';

import Config from '../../../config';
import images from '../../../constants/images';
import { t, TRANSLATION } from '../../../localization';
import store, { IRootState } from '../../../state';
import { modalsActionCreators, modalsSelectors } from '../../../state/modals';
import { userActionCreators, userSelectors } from '../../../state/user';
import { ERegistrationType, LOGIN_TABS_IDS } from '../../../state/user/constants';
import { useVisibility } from '../../../tools/hooks';
import { emailRegex, phoneRegex } from '../../../tools/utils';
import { EStatuses, EUserRoles } from '../../../types/types';
import { Intent } from '../../Alert';
import AlertComponent from '../../Alert/Alert';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import { Input } from './elements';
import styles from './STYLES'; // <- ваши стили в camelCase

// --- redux mapping
const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
  status: userSelectors.status(state),
  tab: userSelectors.tab(state),
  message: userSelectors.message(state),
  isWAOpen: modalsSelectors.isWACodeModalOpen(state),
});

const mapDispatchToProps = {
  login: userActionCreators.login,
  setLoginModal: modalsActionCreators.setLoginModal,
  googleLogin: userActionCreators.googleLogin,
  logout: userActionCreators.logout,
  remindPassword: userActionCreators.remindPassword,
  setStatus: userActionCreators.setStatus,
  setMessage: userActionCreators.setMessage,
  register: userActionCreators.register,
  setWAOpen: modalsActionCreators.setWACodeModal,
  setRefOpen: modalsActionCreators.setRefCodeModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

// --- form types
interface IFormValues {
  login: string;
  password?: string;
  type: ERegistrationType;
}

interface IProps extends ReduxProps {
  isOpen: boolean;
}

const LoginForm: React.FC<IProps> = ({
  user,
  status,
  tab,
  googleLogin,
  isOpen,
  setWAOpen,
  setRefOpen,
  login,
  logout,
  remindPassword,
  setMessage,
  setStatus,
  setLoginModal,
  message,
}) => {
  const [isPasswordShows, setIsPasswordShows] = useState(false);
  const [dataToLogin, setDataToLogin] = useState<any>({});
  const [isVisible, toggleVisibility] = useVisibility(false);
  const [isPasswordVisible, togglePasswordVisibility] = useVisibility(true);

  const route = useRoute();
  const navigation = useNavigation();

  // функция navigate, соответствующая типу (location: string) => void
  const navigateFn = (location: string) => {
    // В RN navigation.navigate может принимать имя роутa, или объект.
    // Приводим location к любому типу — это соответствует ожиданию action creators
    // Если у вас в проекте ожидается другая логика — замените здесь.
    // @ts-ignore
    if (navigation && typeof (navigation as any).navigate === 'function') {
      // Попытка вызвать navigate; если route name - просто передаём как строку
      try {
        // @ts-ignore
        (navigation as any).navigate(location);
      } catch {
        // noop
      }
    }
  };

  const googleClientId =
    '973943716904-b33r11ijgi08m5etsg5ndv409shh1tjl.apps.googleusercontent.com';

  const routePath =
    (route && ((route as any).name ?? ((route as any).params?.path ?? ''))) || '';
  const role = !String(routePath).includes('/driver-order')
    ? EUserRoles.Client
    : EUserRoles.Driver;

  // Yup schema (callback form to avoid TS issues with `is` field)
  const schema = yup.object({
    type: yup.string().required(),
    login: yup
      .string()
      .required()
      .when('type', (typeVal: any, schemaBuilder: any) => {
        if (typeVal === ERegistrationType.Email) {
          return schemaBuilder.matches(emailRegex, t(TRANSLATION.EMAIL_ERROR));
        }
        return schemaBuilder.matches(phoneRegex, t(TRANSLATION.PHONE_PATTERN_ERROR));
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    trigger,
    setValue,
  } = useForm<IFormValues>({
    mode: 'all',
    defaultValues: {
      login: (user && (user as any).u_email) ?? '',
      type: ERegistrationType.Email,
      password: '',
    },
    resolver: yupResolver(user ? yup.object() : (schema as any)),
  });

  const watched = useWatch({ control }) as Partial<IFormValues>;
  const formLogin = watched?.login;
  const type = watched?.type ?? ERegistrationType.Email;

  // helper to parse param from URL (works for web and deep link)
  const getParamFromURL = useCallback(async (param: string) => {
    try {
      const globalData = store.getState().global; 

      let url = '';
      if ( globalData?.location?.href) {
        url = globalData?.location?.href;
      } else {
        const initialUrl = await Linking.getInitialURL();
        url = initialUrl ?? '';
      }
      const results = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(url);
      if (results == null) return null;
      return decodeURIComponent(results[1]) || null;
    } catch (e) {
      return null;
    }
  }, []);

  // Effects (adapted)
  useEffect(() => {
    if (!isOpen) {
      setStatus(EStatuses.Default);
      setMessage('');
    }
    if (isOpen && isVisible) {
      toggleVisibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      const auth_hash = await getParamFromURL('auth_hash');
      if (auth_hash) {
        if (typeof auth_hash === 'string') {
          googleLogin({
            data: null,
            auth_hash: decodeURIComponent(auth_hash),
            // передаём функцию navigateFn (тип (location: string) => void)
            navigate: navigateFn as any,
          } as any);
        }
        return;
      }

      const u_email = await getParamFromURL('u_email');
      const u_name = await getParamFromURL('u_name');

      if (typeof u_email === 'string' && typeof u_name === 'string') {
        setRefOpen({
          isOpen: true,
          data: {
            u_name: decodeURIComponent(u_name).replaceAll('+', ' '),
            u_phone: '',
            u_email: decodeURIComponent(u_email),
            type: ERegistrationType.Email,
            u_role: EUserRoles.Client,
            ref_code: '',
            u_details: {},
            st: '1',
          },
        } as any);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDirty) trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (type === ERegistrationType.Whatsapp && isPasswordVisible) {
      togglePasswordVisibility();
    } else if (!isPasswordVisible) {
      togglePasswordVisibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    // follow original logic
    if (
      ((status === EStatuses.Fail ||
        (status === EStatuses.Success && user)) &&
        type !== ERegistrationType.Whatsapp &&
        !isVisible)
    ) {
      toggleVisibility();
    } else if (status === EStatuses.Whatsapp) {
      setLoginModal(false);
      setWAOpen({
        isOpen: true,
        login: formLogin,
        data: { ...dataToLogin, navigate: navigateFn },
      } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isVisible, type, user]);

  useEffect(() => {
    if (status === EStatuses.Success && message === 'remind_password_success') {
      toggleVisibility();
      if (!isVisible) toggleVisibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // If tab differs, do not render (as in web)
  if (tab !== LOGIN_TABS_IDS[0]) return null;

  const onSubmit = (data: IFormValues) => {
    if (isVisible) toggleVisibility();
    setDataToLogin(data);
    if (user) {
      logout();
    } else if (data) {
      const loginData: IFormValues =
        data.type === ERegistrationType.Whatsapp
          ? {
              type: data.type,
              login: data.login || '',
            }
          : {
              ...data,
              login: data.login || '',
            };
      login({ ...loginData, navigate: navigateFn } as any);
    }
  };

  // Open Google OAuth URL (web & mobile)
  const openGoogleAuth = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&client_id=${googleClientId}&redirect_uri=${Config.SERVER_URL}/google/&state&scope=email%20profile&prompt=select_account`;
    Linking.openURL(url).catch((err) => {
      /* handle error if needed */
      console.warn('Cannot open google auth url', err);
    });
  };

  // Render
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.loginForm}>
        {/* Login input */}
        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              inputProps={{
                placeholder:
                  type === ERegistrationType.Phone ||
                  type === ERegistrationType.Whatsapp
                    ? t(TRANSLATION.PHONE)
                    : t(TRANSLATION.EMAIL),
                value: value,
                onChangeText: onChange,
                onBlur: onBlur,
              }}
              label={t(TRANSLATION.LOGIN)}
              error={errors.login?.message}
              style={styles.loginFormInput}
              key={String(type) + '_login'}
            />
          )}
        />

        {/* Password input (conditionally rendered) */}
        {isPasswordVisible && (
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                inputProps={{
                  placeholder: t(TRANSLATION.PASSWORD),
                  value: value,
                  onChangeText: onChange,
                  onBlur: onBlur,
                  secureTextEntry: !isPasswordShows,
                }}
                label={t(TRANSLATION.PASSWORD)}
                error={errors.password?.message}
                buttons={[
                  {
                    // предполагаем, что ваш Input понимает ключ 'image' или 'src'
                    // если другой — замените на нужный ключ (например src)
                    image: isPasswordShows ? images.closedEye : images.openedEye,
                    onPress: () => setIsPasswordShows((p) => !p),
                  },
                  !user
                    ? {
                        type: 'button',
                        onPress: () => {
                          if (formLogin && !errors?.login) {
                            Alert.alert(
                              t(TRANSLATION.PASSWORD_RESET_MESSAGE),
                              '',
                              [
                                { text: t(TRANSLATION.CANCEL), style: 'cancel' },
                                {
                                  text: t(TRANSLATION.OK),
                                  onPress: () => remindPassword(formLogin),
                                },
                              ]
                            );
                          }
                        },
                        disabled: !formLogin || !!errors?.login,
                        text: t(TRANSLATION.RESTORE_PASSWORD),
                      }
                    : null,
                ].filter(Boolean) as any}
                style={styles.loginFormInput}
              />
            )}
          />
        )}

        {/* Radio checkboxes for type */}
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View>
              <Checkbox
                label={t(TRANSLATION.EMAIL)}
                value={ERegistrationType.Email}
                checked={value === ERegistrationType.Email}
                onPress={() => onChange(ERegistrationType.Email)}
              />
              <Checkbox
                label={'Whatsapp'}
                value={ERegistrationType.Whatsapp}
                checked={value === ERegistrationType.Whatsapp}
                onPress={() => onChange(ERegistrationType.Whatsapp)}
              />
            </View>
          )}
        />

        {/* Alert display */}
        {isVisible && (
          <View style={styles.alertContainer}>
            <AlertComponent
              intent={status === EStatuses.Fail ? Intent.ERROR : Intent.SUCCESS}
              message={
                status === EStatuses.Fail
                  ? `${t(TRANSLATION.LOGIN_FAIL)}: ${message}`
                  : message === 'remind_password_success'
                  ? t(TRANSLATION.REMIND_PASSWORD_SUCCESS)
                  : t(TRANSLATION.LOGIN_SUCCESS)
              }
              onClose={toggleVisibility}
            />
          </View>
        )}

        {/* Google button (only for non-driver roles) */}
        {Number(role) !== EUserRoles.Driver && (
          <TouchableOpacity onPress={openGoogleAuth} style={styles.workTypeButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={images.googleIcon} style={{ width: 20, height: 20, marginRight: 8 }} />
              <Text>{t(TRANSLATION.SIGN_IN_WITH_GOOGLE) ?? 'Sign in with Google'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Submit button */}
        <Button
          onPress={handleSubmit(onSubmit)}
          text={!!user ? t(TRANSLATION.LOGOUT) : t(TRANSLATION.SIGN_IN)}
          fixedSize={false}
          style={styles.loginBtn}
          disabled={!!Object.values(errors).length}
          status={status}
        />
      </View>
    </ScrollView>
  );
};

export default connector(LoginForm);
