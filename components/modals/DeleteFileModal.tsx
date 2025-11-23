import React from 'react'
import { Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../localization'
import SITE_CONSTANTS from '../../siteConstants'
import store, { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { defaultDeleteFilesModal } from '../../state/modals/reducer'
import Button from '../Button'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isDeleteFilesModalOpen(state),
})

const mapDispatchToProps = {
  setDeleteFilesModal: modalsActionCreators.setDeleteFilesModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  handleDeleteFile: () => any
  handleDeleteFiles: () => any
}

const DeleteFileModal: React.FC<IProps> = ({
  isOpen,
  handleDeleteFile,
  handleDeleteFiles,
  setDeleteFilesModal,
}) => {
  if (!handleDeleteFile || !handleDeleteFiles) return null
  SITE_CONSTANTS.init(store.getState().global.data);
  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setDeleteFilesModal({ ...defaultDeleteFilesModal })}
    >
      <View style={[styles.deleteFileModal, { padding: 20, borderRadius: 10 }]}>
        <Text style={styles.deleteFileModalText}>Удалить фото?</Text>

        <View style={[styles.deleteFileModalButtons]}>
          <Button
            text={t(TRANSLATION.ONE)}
            onPress={() => {
              handleDeleteFile()
              setDeleteFilesModal({ ...defaultDeleteFilesModal })
            }}
            skipHandler
          />

          <Button
            text={t(TRANSLATION.ALL)}
            onPress={() => {
              handleDeleteFiles()
              setDeleteFilesModal({ ...defaultDeleteFilesModal })
            }}
            style={[
              styles.deleteFileModalAllButton,
              {
                borderColor: SITE_CONSTANTS.PALETTE.primary.dark,
                borderWidth: 1,
              },
            ]}
            skipHandler
          />
        </View>
      </View>
    </Overlay>
  )
}

export default connector(DeleteFileModal)
