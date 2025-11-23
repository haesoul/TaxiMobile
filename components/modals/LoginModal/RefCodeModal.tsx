// RefCodeModal.native.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import * as yup from 'yup';

import * as API from '../../../API';
import { t, TRANSLATION } from '../../../localization';
import { IRootState } from '../../../state';
import { modalsActionCreators, modalsSelectors } from '../../../state/modals';
import { userActionCreators, userSelectors } from '../../../state/user';
import { ERegistrationType } from '../../../state/user/constants';
import { useVisibility } from '../../../tools/hooks';
import { EStatuses } from '../../../types/types';
import { Intent } from '../../Alert';
import Alert from '../../Alert/Alert';
import Button from '../../Button';
import Input from '../../Input';
import Overlay from '../Overlay';
import styles from './STYLES';


interface IFormValues {

  code?: string;
}

const mapStateToProps = (state: IRootState) => ({
  payload: modalsSelectors.isRefCodeModalOpen(state),
  user: userSelectors.user(state),
  whatsappSignUpData: userSelectors.whatsappSignUpData(state),
  status: userSelectors.status(state),
});

const mapDispatchToProps = {
  googleLogin: userActionCreators.googleLogin,
  login: userActionCreators.login,
  whatsappSignUp: userActionCreators.whatsappSignUp,
  setRefCodeModal: modalsActionCreators.setRefCodeModal,
  setCancelModal: modalsActionCreators.setCancelModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

// ---- Компонент ----
const RefCodeModal: React.FC<PropsFromRedux> = ({
  payload,
  setRefCodeModal,
  googleLogin,
  status,
  whatsappSignUp,
  whatsappSignUpData,
}) => {
  const [isVisible, toggleVisibility] = useVisibility(false);
  const navigation = useNavigation();

  // navigateFn соответствует (location: string) => void, как ожидают action creators
  const navigateFn = useCallback((location: string) => {
    try {
      // @ts-ignore — приводим navigation к любому виду, чтобы вызвать navigate как строку
      if (navigation && typeof (navigation as any).navigate === 'function') {
        // Если location — строка с именем маршрута, просто навигируем
        (navigation as any).navigate(location);
      }
    } catch {
      // noop
    }
  }, [navigation]);


  const schema = yup.object<IFormValues>({
    code: yup.string().notRequired(),
  });
  
  

  const resolver = yupResolver(schema) as unknown as Resolver<IFormValues>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<IFormValues>({
    mode: 'all',
    criteriaMode: 'all',
    resolver,
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (status === EStatuses.Fail && !isVisible) {
      toggleVisibility();
    } else if (status === EStatuses.Success) {
      reset({ code: '' });
      if (isVisible) toggleVisibility();

      setRefCodeModal({ isOpen: false } as any);
    }

  }, [status]);

  const onSubmit = async (formData: IFormValues) => {

    const data = payload?.data ?? null;

    if (!formData?.code) {
      if (whatsappSignUpData?.u_phone) {

        whatsappSignUp({
          type: ERegistrationType.Whatsapp,
          login: whatsappSignUpData.u_phone,
          navigate: navigateFn,
        } as any);
        return;
      } else {

        googleLogin({ data, auth_hash: null, navigate: navigateFn } as any);
        return;
      }
    }

    try {
      const isFreeCode = await API.checkRefCode(formData.code!);

      if (isFreeCode) {
        setError('code', { type: 'custom', message: t(TRANSLATION.REF_CODE_NOT_FOUND) });
        return;
      }

      const payloadWithRef = data ? { ...data, ref_code: formData.code } : { ref_code: formData.code };

      if (whatsappSignUpData?.u_phone) {
        whatsappSignUp({
          type: ERegistrationType.Whatsapp,
          login: whatsappSignUpData.u_phone,
          ref_code: formData.code,
          navigate: navigateFn,
        } as any);
        return;
      } else {
        googleLogin({ data: payloadWithRef, auth_hash: null, navigate: navigateFn } as any);
        return;
      }
    } catch (err) {
      setError('code', { type: 'custom', message: t(TRANSLATION.LOGIN_FAIL) });
    }
  };

  const isOpen = !!payload?.isOpen;
  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={() => setRefCodeModal({ isOpen: false } as any)}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.modal}>
          <View style={styles.loginForm}>
            <Text style={styles.legend}>{t(TRANSLATION.REF_CODE_INFO)}</Text>

            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  inputProps={{
                    placeholder: t(TRANSLATION.REF_CODE_INFO),
                    value: value,
                    onChangeText: onChange,
                    onBlur: onBlur,
                  }}
                  error={errors.code?.message}
                  style={styles.loginFormInput}
                />
              )}
            />

            {isVisible && (
              <View style={styles.alertContainer}>
                <Alert intent={Intent.ERROR} message={t(TRANSLATION.LOGIN_FAIL)} onClose={toggleVisibility} />
              </View>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              text={t(TRANSLATION.SIGNUP)}
              fixedSize={false}
              skipHandler={true}
              disabled={!!Object.values(errors).length}
              style={styles.loginBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Overlay>
  );
};

export default connector(RefCodeModal);
