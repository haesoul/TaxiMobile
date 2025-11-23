import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as API from '../../API'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { orderSelectors } from '../../state/order'
import Button from '../Button'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isDriverCancelModalOpen(state),
  selectedOrderId: orderSelectors.selectedOrderId(state),
})

const mapDispatchToProps = {
  setDriverCancelModal: modalsActionCreators.setDriverCancelModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const CancelDriverOrderModal: React.FC<IProps> = ({
  isOpen,
  setDriverCancelModal,
  selectedOrderId,
}) => {
  const navigation = useNavigation<any>()

  const onCancel = () => {
    console.log('onCancel', selectedOrderId)
    if (selectedOrderId) {
      API.cancelDrive(selectedOrderId)
      navigation.navigate('DriverOrder') // заменяем useNavigate на React Navigation
    }
    setDriverCancelModal(false)
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setDriverCancelModal(false)}
    >
      <View style={[styles.modal, { padding: 20, borderRadius: 10 }]}>
        <View style={styles.cancelDriverOrderModalFieldset}>
          <Text style={styles.cancelDriverOrderModalLegend}>
            {t(TRANSLATION.CANCEL_ORDER)}
          </Text>

          <View style={styles.cancelDriverOrderModalStatus}>
            <Text style={styles.cancelDriverOrderModalStatusText}>
              {t(TRANSLATION.CANCEL_ORDER_CONFIRMATION)}
            </Text>

            <Button
              text={t(TRANSLATION.OK)}
              onPress={onCancel}
              style={styles.cancelDriverOrderModalOkBtn}
            />
          </View>
        </View>
      </View>
    </Overlay>
  )
}

export default connector(CancelDriverOrderModal)
