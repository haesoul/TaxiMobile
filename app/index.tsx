import CancelModal from '@/components/modals/CancelModal';
import LoginModal from '@/components/modals/LoginModal';
import PickTimeModal from '@/components/modals/PickTimeModal';
import config from '@/config';
import DEFAULTS from '@/defaultValues';
import SITE_CONSTANTS from '@/siteConstants';
import store, { IRootState } from '@/state';
import { ActionTypes } from '@/state/config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Passenger from './Passenger';

import AlarmModal from '@/components/modals/AlarmModal';
import CandidatesModal from '@/components/modals/CandidatesModal';
import CardDetailsModal from '@/components/modals/CardDetailsModal';
import CommentsModal from '@/components/modals/CommentsModal';
import DriverCancelModal from '@/components/modals/DriverCancelModal';
import DriverModal from '@/components/modals/DriverModal';
import MapModal from '@/components/modals/MapModal';
import MessageModal from '@/components/modals/MessageModal';
import OnTheWayModal from '@/components/modals/OnTheWayModal';
import ProfileModal from '@/components/modals/ProfileModal';
import RatingModal from '@/components/modals/RatingModal';
import SeatsModal from '@/components/modals/SeatsModal';
import TakePassengerModal from '@/components/modals/TakePassengerModal';
import TieCardModal from '@/components/modals/TieCardModal';
import VoteModal from '@/components/modals/VoteModal';


export default function Index() {
  const [open, setOpen] = useState(false);
  const state = store.getState();
  
  const isCancelModalOpen = useSelector((state: IRootState) => state.modals.isCancelModalOpen)
  const isPickTimeModalOpen = useSelector((state: IRootState) => state.modals.isPickTimeModalOpen)
  const isCommentsModalOpen = useSelector((state: IRootState) => state.modals.isCommentsModalOpen)
  const isDriverModalOpen = useSelector((state: IRootState) => state.modals.isDriverModalOpen)
  const isTieCardModalOpen = useSelector((state: IRootState) => state.modals.isTieCardModalOpen)
  const isCardDetailsModalOpen = useSelector((state: IRootState) => state.modals.isCardDetailsModalOpen)
  const isVoteModalOpen = useSelector((state: IRootState) => state.modals.isVoteModalOpen)
  const isShowSwitchersMenu = useSelector((state: IRootState) => state.modals.isShowSwitchersMenu)
  const WACodeModal = useSelector((state: IRootState) => state.modals.WACodeModal)
  const RefCodeModal = useSelector((state: IRootState) => state.modals.RefCodeModal)
  const isSeatsModalOpen = useSelector((state: IRootState) => state.modals.isSeatsModalOpen)
  const isLoginModalOpen = useSelector((state: IRootState) => state.modals.isLoginModalOpen)
  const isDriverCancelModalOpen = useSelector((state: IRootState) => state.modals.isDriverCancelModalOpen)

  const isOnTheWayModalOpen = useSelector((state: IRootState) => state.modals.isOnTheWayModalOpen)
  const isCandidatesModalOpen = useSelector((state: IRootState) => state.modals.isCandidatesModalOpen)
  const profileModal = useSelector((state: IRootState) => state.modals.profileModal)
  const alarmModal = useSelector((state: IRootState) => state.modals.alarmModal)
  const messageModal = useSelector((state: IRootState) => state.modals.messageModal)
  const mapModal = useSelector((state: IRootState) => state.modals.mapModal)
  const takePassengerModal = useSelector((state: IRootState) => state.modals.takePassengerModal)
  const ratingModal = useSelector((state: IRootState) => state.modals.ratingModal)
  const activeChat = useSelector((state: IRootState) => state.modals.activeChat)
  const deleteFilesModal = useSelector((state: IRootState) => state.modals.deleteFilesModal)
  const orderCardModal = useSelector((state: IRootState) => state.modals.orderCardModal)

 
  useEffect(() => {
    const globalData = store.getState().global.data;
    if (globalData) {
      SITE_CONSTANTS.init(globalData);
    }
    config.init();
    async function setLanguage() {
      const defaultLangId = await state.global.default_lang;
      const languageSTR = await AsyncStorage.getItem('user_lang')
      if (languageSTR) {
        const language = JSON.parse(languageSTR)
        const lang = await {
          ...DEFAULTS.LANGUAGES[language.id as keyof typeof DEFAULTS.LANGUAGES],
          id: language.id,
        };
        store.dispatch({ type: ActionTypes.SET_LANGUAGE, payload: lang });
      } else {
        const lang = await {
          ...DEFAULTS.LANGUAGES[defaultLangId as keyof typeof DEFAULTS.LANGUAGES],
          id: defaultLangId,
        };
        store.dispatch({ type: ActionTypes.SET_LANGUAGE, payload: lang });
      } 
    }
    setLanguage()
    
  }, []);
  return (
    
    <View style={styles.container}>
      {isCancelModalOpen && <CancelModal/>}
      {isPickTimeModalOpen && <PickTimeModal/>}
      {isCommentsModalOpen && <CommentsModal/>}
      {isDriverModalOpen && <DriverModal/>}
      {isTieCardModalOpen && <TieCardModal/>}
      {isCardDetailsModalOpen && <CardDetailsModal/>}
      {isVoteModalOpen && <VoteModal/>}
      {/* {isShowSwitchersMenu && <SwitchSlider/>} */}
      {/* {WACodeModal && <WACodeModal/>}
      {RefCodeModal && <RefCodeModal/>} */}
      {isSeatsModalOpen && <SeatsModal/>}
      {isLoginModalOpen && <LoginModal/>}
      {isDriverCancelModalOpen && <DriverCancelModal/>}
      {isOnTheWayModalOpen && <OnTheWayModal/>}
      {isCandidatesModalOpen && <CandidatesModal/>} 
      {profileModal && <ProfileModal/>}
      {alarmModal && <AlarmModal/>}
      {messageModal && <MessageModal/>}
      {mapModal && <MapModal/>}
      {takePassengerModal && <TakePassengerModal/>}
      {ratingModal && <RatingModal/>}
      {/* {activeChat && <ActiveChat/>} */}

      {/* {deleteFilesModal && <DeleteFileModal/>} */}
      {/* {orderCardModal && <OrderCard/>} */}



      <Passenger/>



    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 7
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
});
