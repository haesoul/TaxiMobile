import React, { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../../localization'
import SITE_CONSTANTS from '../../../siteConstants'
import store, { IRootState } from '../../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../../state/modals'
import { EBookingCommentTypes } from '../../../types/types'
import Button, { EButtonStyles } from '../../Button'
import Checkbox, { ECheckboxStyles } from '../../Checkbox'
import Input, { EInputStyles } from '../../Input'
import Modal, { EModalStyles } from '../Modal'


const mapStateToProps = (state: IRootState) => ({
  comments: clientOrderSelectors.comments(state),
  isOpen: modalsSelectors.isCommentsModalOpen(state),
});

const mapDispatchToProps = {
  setComments: clientOrderActionCreators.setComments,
  setCommentsModal: modalsActionCreators.setCommentsModal,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface IProps extends ConnectedProps<typeof connector> {}

interface IFormValues {
  ids: string[];
  custom: string;
  flightNumber: string;
  placard: string;
}

function CommentsModal({
  isOpen,
  comments,
  setComments,
  setCommentsModal,
}: IProps) {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
  } = useForm<IFormValues>({
    criteriaMode: 'all',
    mode: 'onChange',
    defaultValues: {
      ids: comments.ids,
      custom: comments.custom,
      flightNumber: comments.flightNumber,
      placard: comments.placard,
    },
  });

  const { ids, ...values } = useWatch<IFormValues>({ control });

  const onSubmit = () => {
    if (!ids) return;

    if (isValid) {
      setComments({ ...values, ids: ids ?? [] });
    }

    setCommentsModal(false);
  };

  const componentId = useId();
  SITE_CONSTANTS.init(store.getState().global.data);
  return (
    <Modal
      overlayProps={{
        isOpen,
        onClick() {
          setCommentsModal(false);
        },
      }}
      style={EModalStyles.RedDesign}
    >
      <ScrollView contentContainerStyle={styles.commentsModalForm}>
        {Object.keys(SITE_CONSTANTS.BOOKING_COMMENTS).map(id => (
          <Checkbox
            key={id}
            {...register('ids')}
            id={componentId + id}
            checkboxStyle={ECheckboxStyles.RedDesign}
            value={id}
            label={t(TRANSLATION.BOOKING_COMMENTS[id])}
          />
        ))}

        {ids?.some(
          id =>
            SITE_CONSTANTS.BOOKING_COMMENTS[id].type ===
            EBookingCommentTypes.Plane,
        ) && (
          <View style={styles.commentsModalPlaneInputs}>
            <Input
              inputProps={{
                ...register('flightNumber', {
                  required: t(TRANSLATION.REQUIRED_FIELD),
                }),
                placeholder: `№ ${t(TRANSLATION.FLIGHT)}`,
              }}
              style={EInputStyles.RedDesign}
              error={errors.flightNumber?.message}
            />

            <Input
              inputProps={{
                ...register('placard', {
                  required: t(TRANSLATION.REQUIRED_FIELD),
                }),
                placeholder: t(TRANSLATION.TEXT_ON_THE_TABLE),
              }}
              style={EInputStyles.RedDesign}
              error={errors.placard?.message}
            />
          </View>
        )}

        <Input
          inputProps={{
            ...register('custom'),
            placeholder: t(TRANSLATION.CUSTOM_COMMENT),
          }}
          style={EInputStyles.RedDesign}
        />

        <Button
          type="submit"
          buttonStyle={EButtonStyles.RedDesign}
          checkLogin={false}
          text={t(TRANSLATION.OK)}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </Modal>
  );
}

export default connector(CommentsModal);



const styles = StyleSheet.create({
  commentsModalForm: {
    flexDirection: 'column',
    rowGap: 16,
    paddingVertical: 10,
  },

  commentsModalPlaneInputs: {
    flexDirection: 'row',
    columnGap: 16,
  },
});
