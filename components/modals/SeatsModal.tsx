import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { IRootState } from '../../state'
import { clientOrderActionCreators, clientOrderSelectors } from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isSeatsModalOpen(state),
  seats: clientOrderSelectors?.seats(state),
})

const mapDispatchToProps = {
  setSeats: clientOrderActionCreators.setSeats,
  setSeatsModal: modalsActionCreators.setSeatsModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const SeatsModal: React.FC<IProps> = ({
  isOpen,
  seats,
  setSeats,
  setSeatsModal,
}) => {
  function onSeatsClick(value: number) {
    setSeats(value)
    setSeatsModal(false)
  }

  return (
    <Overlay
      isOpen={isOpen}
      onClick={() => setSeatsModal(false)}
    >
      <View style={[styles.modal, styles.seatsModal]}>

        {[1, 2, 3].map((item) => (
          <View key={item} style={{ width: '100%' }}>
            <TouchableOpacity
              style={[
                styles.seatsModalDiv,
                seats === item && { backgroundColor: '#e6f0ff' } // активное состояние (пример)
              ]}
              onPress={() => onSeatsClick(item)}
            >
              <Text style={styles.seatsModalDivText}>{item}</Text>
            </TouchableOpacity>

            {/* separator (RN version of <span>) */}
            <View style={styles.seatsModalSpan} />
          </View>
        ))}

      </View>
    </Overlay>
  )
}

export default connector(SeatsModal)
