import React, { useRef } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { createSelector } from 'reselect'
import { IRootState } from '../../state'
import { modalsSelectors } from '../../state/modals'
import Chat from '../Chat'
import AlarmModal from './AlarmModal'
import CancelOrderModal from './CancelModal'
import CandidatesModal from './CandidatesModal'
import CardDetailsModal from './CardDetailsModal'
import CardModal from './CardModal'
import CommentsModal from './CommentsModal'
import CancelDriverOrderModal from './DriverCancelModal'
import DriverModal from './DriverModal'
import LoginModal from './LoginModal'
import RefCodeModal from './LoginModal/RefCodeModal'
import WACodeModal from './LoginModal/WACodeModal'
import MapModal from './MapModal'
import MessageModal from './MessageModal'
import OnTheWayModal from './OnTheWayModal'
import TimerModal from './PickTimeModal'
import ProfileModal from './ProfileModal'
import RatingModal from './RatingModal'
import PlaceModal from './SeatsModal'
import TakePassengerModal from './TakePassengerModal'
import TieCardModal from './TieCardModal'
import VoteModal from './VoteModal'

const COMPONENTS = [
  [Chat, modalsSelectors.activeChat],
  [CancelOrderModal, modalsSelectors.isCancelModalOpen],
  [TimerModal, modalsSelectors.isPickTimeModalOpen],
  [CommentsModal, modalsSelectors.isCommentsModalOpen],
  [DriverModal, modalsSelectors.isDriverModalOpen],
  [RatingModal, modalsSelectors.isRatingModalOpen],
  [OnTheWayModal, modalsSelectors.isOnTheWayModalOpen],
  [TieCardModal, modalsSelectors.isTieCardModalOpen],
  [CardDetailsModal, modalsSelectors.isCardDetailsModalOpen],
  [VoteModal, modalsSelectors.isVoteModalOpen],
  [PlaceModal, modalsSelectors.isSeatsModalOpen],
  [LoginModal, modalsSelectors.isLoginModalOpen],
  [AlarmModal, modalsSelectors.isAlarmModalOpen],
  [MapModal, modalsSelectors.isMapModalOpen],
  [TakePassengerModal, modalsSelectors.isTakePassengerModalOpen],
  [CancelDriverOrderModal, modalsSelectors.isDriverCancelModalOpen],
  [ProfileModal, modalsSelectors.isProfileModalOpen],
  [CandidatesModal, modalsSelectors.isCandidatesModalOpen],
  [MessageModal, modalsSelectors.isMessageModalOpen],
  [WACodeModal, modalsSelectors.isWACodeModalOpen],
  [RefCodeModal, modalsSelectors.isRefCodeModalOpen],
  [CardModal, modalsSelectors.isOrderCardModalOpen],
] as const

const modalsSelector = createSelector(
  (state: IRootState) => state,
  state => new Map<React.ComponentType, boolean>(COMPONENTS.map(
    ([Component, selector]) => [Component, !!selector(state)],
  )),
  { memoizeOptions: {
    resultEqualityCheck: (oldValue, newValue) => [...newValue]
      .every(([Component, isOpen]) => oldValue.get(Component) === isOpen),
  } },
)

const mapStateToProps = (state: IRootState) => ({
  modals: modalsSelector(state),
})

const connector = connect(mapStateToProps)

interface IProps extends ConnectedProps<typeof connector> {}

const ModalHost: React.FC<IProps> = ({ modals }) => {
  const modalStack = useRef<[React.ComponentType, React.ReactNode][]>([])
  const prevModals = useRef<typeof modals | undefined>(undefined)

  if (modals !== prevModals.current) {
    const added = new Map<React.ComponentType, number>()
    for (const [index, [Component]] of COMPONENTS.entries())
      if (modals.get(Component) && !prevModals.current?.get(Component))
        added.set(Component, index)

    modalStack.current = modalStack.current.filter(([Component]) => !added.has(Component))
    for (const [Component, index] of added)
      modalStack.current.push([Component, <Component key={index} />])

    prevModals.current = modals
  }

  return (
    <>
      {modalStack.current.map(([_, element]) => element)}
    </>
  )
}

export const ConnectedModalHost = connector(ModalHost)
