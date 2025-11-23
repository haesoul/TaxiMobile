import moment from 'moment'
import React, { useCallback, useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { connect, ConnectedProps } from 'react-redux'
import { t, TRANSLATION } from '../../localization'
import { IRootState } from '../../state'
import {
  clientOrderActionCreators,
  clientOrderSelectors,
} from '../../state/clientOrder'
import { modalsActionCreators, modalsSelectors } from '../../state/modals'
import { dateFormatTime } from '../../tools/utils'
import Overlay from './Overlay'
import { styles } from './STYLES'

const mapStateToProps = (state: IRootState) => ({
  isOpen: modalsSelectors.isPickTimeModalOpen(state),
  time: clientOrderSelectors.time(state),
})

const mapDispatchToProps = {
  setTime: clientOrderActionCreators.setTime,
  setPickTimeModal: modalsActionCreators.setPickTimeModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {}

enum EPeriods {
  Today,
  Now,
  Tomorrow
}

const PickTimeModal: React.FC<IProps> = ({
  isOpen,
  time,
  setTime,
  setPickTimeModal,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [period, setPeriod] = useState(EPeriods.Now)

  const onPeriodClick = useCallback((item: EPeriods) => {
    setPeriod(item)
    if (item === EPeriods.Now) {
      setTime('now')
      setIsPickerOpen(false)
      setPickTimeModal(false)
    } else {
      setIsPickerOpen(true)
    }
  }, [setTime, setPickTimeModal])

  const items = [
    { label: t(TRANSLATION.TODAY), value: EPeriods.Today },
    { label: t(TRANSLATION.NOW), value: EPeriods.Now },
    { label: t(TRANSLATION.TOMORROW), value: EPeriods.Tomorrow },
  ]

  const activePeriod = useMemo(() => {
    if (time === 'now') return EPeriods.Now
    if (time?.isSame(moment(), 'day')) return EPeriods.Today
    if (time?.isSame(moment().add(1, 'days'), 'day')) return EPeriods.Tomorrow
    return null
  }, [time])

  return (
    <Overlay
      isOpen={isOpen}
      onClick={useCallback(() => {
        setPickTimeModal(false)
        setIsPickerOpen(false)
      }, [setPickTimeModal])}
    >
      <View style={[styles.modal, styles.timerModal]}>
        <ScrollView>
          {items.map(item => (
            <View key={item.value} style={{ marginBottom: 10 }}>
              <TouchableOpacity
                style={[
                  styles.timerModalButton,
                  activePeriod === item.value && styles.timerModalButtonActive
                ]}
                onPress={() => onPeriodClick(item.value)}
              >
                <Text style={styles.timerModalButtonText}>{item.label}</Text>
                {activePeriod === item.value && typeof time !== 'string' && (
                  <Text style={styles.timerModalLabel}>
                    {time.format(dateFormatTime)}
                  </Text>
                )}
              </TouchableOpacity>
              <View style={styles.timerModalSeparator} />
            </View>
          ))}
        </ScrollView>

        <DateTimePickerModal
          isVisible={isPickerOpen}
          mode="time"
          onConfirm={(date: any) => {
            const selected = moment(date)
            const days = period === EPeriods.Tomorrow ? 1 : 0
            setTime(selected.clone().add(days, 'days'))
            setPickTimeModal(false)
            setIsPickerOpen(false)
          }}
          onCancel={() => setIsPickerOpen(false)}
        />
      </View>
    </Overlay>
  )
}

export default connector(PickTimeModal)
