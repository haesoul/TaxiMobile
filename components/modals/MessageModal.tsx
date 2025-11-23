import React from 'react'
import { Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { defaultMessageModal } from '../../state/modals/reducer'
import { EColorTypes } from '../../types/types'
import Button from '../Button'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isMessageModalOpen(state),
  message: modalsSelectors.messageModalMessage(state),
  status: modalsSelectors.messageModalStatus(state),
})

const mapDispatchToProps = {
  setMessageModal: modalsActionCreators.setMessageModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const getStatusStyle = (status?: any) => {
  switch (status) {
    case 'fail':
      return styles.messageModalTextFail
    case 'success':
      return styles.messageModalTextSuccess
    case 'warning':
      return styles.messageModalTextWarning
    default:
      return {}
  }
}

const MessageModal: React.FC<IProps> = ({
  isOpen,
  message,
  status,
  setMessageModal,
}) => {
  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setMessageModal({ ...defaultMessageModal })}
    >
      <View style={styles.messageModal}>
        <Text style={[styles.messageModalText, getStatusStyle(status)]}>
          {message}
        </Text>
        <Button
          text={t(TRANSLATION.OK)}
          skipHandler
          colorType={EColorTypes.Accent}
          onPress={() => setMessageModal({ ...defaultMessageModal })}
        />
      </View>
    </Overlay>
  )
}

export default connector(MessageModal)
