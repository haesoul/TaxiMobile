import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // --- .overlay ---
  overlay: {
    // cursor: 'pointer' - (нет в RN)
    backgroundColor: 'rgba(0, 0, 0, 0.17)',
    // backdrop-filter: blur(5px) - (нужен компонент BlurView)
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayWrapper: {
    position: 'absolute', // fixed -> absolute
    zIndex: 0,
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayWrapperActive: { // &--active
    display: 'flex',
  },

  // --- .modal ---
  modal: {
    position: 'relative',
    width: '90%',
    // box-sizing: border-box (по умолчанию в RN)
    flexDirection: 'column',
    // height: fit-content (автоматически в RN)
    maxHeight: '95%',
    // overflow-y: auto (используй ScrollView)
    overflow: 'hidden', // overflow-x: hidden
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    maxWidth: 900,
    padding: 10,
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 10,
  },
  modalFieldset: {
    borderRadius: 13,
    width: '100%',
    borderWidth: 2,
    borderColor: '#1E58EB',
  },
  modalFieldsetLegend: {
    alignSelf: 'center', // margin: 0 auto
    paddingHorizontal: 15,
    color: '#0f2c76',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
  },
  modalFieldsetH3: { // h3
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },
  modalFieldsetH4: { // h4
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },
  modalStyleRedDesign: { // &--style &--red-design
    // width: calc(100% - 32px) -> решается margin
    width: '100%',
    paddingHorizontal: 8, // padding: 8
    paddingVertical: 8,
    borderRadius: 24,
    marginHorizontal: 16, // ~ calc logic
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 17,
    elevation: 5,
  },
  modalActive: { // .active
    backgroundColor: 'aliceblue',
  },
  getCoordsMapModal: { // &.get-coords-map-modal
    maxWidth: undefined, // 'none'
  },

  modalButtonsBlock: {
    marginTop: 25,
  },

  // --- .message-window ---
  messageWindow: {
    paddingHorizontal: 30, // padding: 0 30px
    borderWidth: 2,
    borderColor: '#BBA387',
  },
  messageWindowButton: {
    // cursor: pointer
  },

  // --- .message-modal ---
  messageModal: {
    paddingTop: 15,
    display: 'flex',
    minHeight: '20%', // 20vh
    justifyContent: 'flex-end',
  },
  messageModalText: {
    flex: 1, // flex: 1 0 auto
    textAlign: 'center',
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 20,
  },
  messageModalTextFail: {
    color: 'red',
  },
  messageModalTextSuccess: {
    color: '#000',
  },
  messageModalTextWarning: {
    color: '#FBD300',
  },

  // --- .cancel-order-modal ---
  cancelOrderModal: {
    padding: 15,
  },
  cancelOrderModalReasonItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    padding: 20,
    // box-shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    color: '#686868',
  },
  cancelOrderModalReasonItemActive: {
    backgroundColor: '#e1f8ff',
  },
  cancelOrderModalButtonFirstChild: {
    marginBottom: 15,
  },

  // --- .timer-modal ---
  timerModal: {
    borderRadius: 10,
  },
  timerModalButton: {
    display: 'flex',
    flexDirection: 'row', // align-items center в строку
    alignItems: 'center',
    paddingHorizontal: 30,
    height: 78,
    fontWeight: '300', // применять к Text внутри
    justifyContent: 'space-between',
    // color: #686868 (применять к Text)
  },
  timerModalButtonText: { // Доп стиль для текста кнопки
    fontSize: 20,
    lineHeight: 23,
    fontWeight: '300',
    color: '#686868',
  },
  timerModalButtonActive: {
    backgroundColor: 'aliceblue',
  },
  timerModalLabel: {
    fontWeight: '300',
    fontSize: 28,
    lineHeight: 33,
    color: '#686868',
  },
  timerModalSeparator: {
    // display: block
    borderBottomWidth: 1,
    borderBottomColor: '#BABABA',
    width: '97%',
    alignSelf: 'center', // margin: 0 auto
  },
  timerModalTimePicker: {
    position: 'absolute', // fixed -> absolute
    display: 'none',
    backgroundColor: 'white',
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.33, // #0005
    shadowRadius: 10,
    elevation: 5,
  },
  timerModalTimePickerVisible: {
    display: 'flex', // block
  },

  // --- .driver-modal ---
  driverModal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 17,
    elevation: 5,
  },
  driverModalFormFieldsetH3: {
    marginTop: 0,
  },
  driverModalFormFieldsetH4: {
    fontSize: 19,
    lineHeight: 22,
    color: '#600000',
    marginTop: 0,
    marginBottom: 15,
  },
  driverModalSpan: { // span:not(...)
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  driverInfo: {
    display: 'flex',
    flexDirection: 'row', // justify-content: space-between требует row
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  driverInfoDiv: {
    // font styles apply to Text inside
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfoDivText: {
    fontSize: 18,
    lineHeight: 21,
    textAlign: 'center',
    color: '#600000',
  },
  driverInfoDivLink: { // a
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 21,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: '#600000',
  },
  driverInfoGettingBtn: {
    marginBottom: 5,
    width: 282,
  },
  driverInfoGettingBtnButton: {
    // background: linear-gradient(...) -> заглушка
    backgroundColor: '#EC4C60',
    borderRadius: 14,
    // text-transform: capitalize
  },
  driverInfoOkBtn: {
    marginBottom: 5,
    width: 156,
  },
  driverInfoImg: {
    marginBottom: 5,
  },
  driverInfoDivChild: { // > div
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  driverInfoDivChildSpan: {
    fontSize: 18,
    lineHeight: 21,
    textAlign: 'center',
  },
  driverInfoDivChildSpanThird: { // span:nth-child(3)
    fontSize: 17,
    opacity: 0.7,
  },
  cancellButton: {
    flex: 1,
  },
  cancellButtonBtn: {
    // background: linear-gradient(...) -> заглушка
    backgroundColor: '#FF8008',
  },
  driverModalRegistrationPlate: {
    // display: inline -> не работает на View, используй Text или View row
    // overflow-x: auto -> ScrollView horizontal
    maxWidth: 160, // ~16ch
  },

  // --- .rating-modal ---
  ratingModal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 17,
    elevation: 5,
  },
  rating: {
    display: 'flex',
    flexDirection: 'column',
  },
  ratingStarsSpan: {
    width: 40,
    height: 40,
  },
  ratingLink: { // a
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 21,
    color: '#600000',
    textDecorationLine: 'underline',
    alignSelf: 'center', // margin: 0 auto
  },
  ratingStars: { // &-stars
    textAlign: 'center', // alignItems: center for View
    alignItems: 'center',
  },
  ratingStarsImg: {
    height: 40,
    width: 40,
    padding: 0,
  },
  ratingP: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    color: '#B9A2A2',
  },
  ratingModalRatingBtnButton: { // &_rating-btn button
    marginBottom: 10,
    // background: linear-gradient
    backgroundColor: '#EC4C60',
    // text-transform: none
  },

  // --- .tie-card-modal ---
  tieCardModalInfoBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tieCardModalInfoBlockArticle: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
    color: '#510000',
  },
  tieCardModalInfoBlockP: {
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    color: '#B9A2A2',
    marginTop: 10,
  },
  tieCardModalInfoBlockA: {
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 21,
    color: '#600000',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  tieCardModalAddBtn: {
    width: '100%',
    marginBottom: 10,
  },
  tieCardModalAddBtnButton: {
    // background: linear-gradient
    backgroundColor: '#EC4C60',
    borderRadius: 14,
  },
  tieCardModalIcon: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },

  // --- .card-details-modal ---
  cardDetailsModalDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardDetailsModalDetailsInputGroupWiconImg: {
    marginTop: 61,
  },
  cardDetailsModalDetailsSaveBtn: {
    width: '100%',
    marginBottom: 10,
  },
  cardDetailsModalDetailsSaveBtnButton: {
    // background: linear-gradient
    backgroundColor: '#EC4C60',
    borderRadius: 14,
  },
  cardDetailsModalDetailsA: {
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 21,
    color: '#600000',
  },
  cardDetailsModalDetailsExpirationDate: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  cardDetailsModalDetailsExpirationDateExp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  cardDetailsModalDetailsExpirationDateCvc: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDetailsModalDetailsExpirationDateSelect: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 14,
    width: '100%',
    height: 36,
  },
  cardDetailsModalDetailsExpirationDateSpan: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    color: '#510000',
  },
  cardDetailsModalDetailsExpirationDateCvcImg: {
    marginTop: 12,
  },
  // Media query max-width 320px
  cardDetailsModalDetailsExpirationDateSpanSmall: {
    fontSize: 15,
  },

  // --- .whatsapp-modal ---
  whatsappModalGrouppedButtons: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  whatsappModalLegendImg: {
    position: 'absolute',
    right: 45,
    top: 2,
  },
  whatsappModalCodeBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  whatsappModalCodeBlockTimerImg: {
    marginTop: 10,
    marginBottom: 12,
  },
  whatsappModalCodeBlockArticle: {
    display: 'flex', // row
    flexDirection: 'row',
    alignItems: 'center',
    // font props -> Text
  },
  whatsappModalCodeBlockArticleText: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },
  whatsappModalCodeBlockArticleSpan: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 57,
    lineHeight: 67,
    marginHorizontal: 13,
  },
  whatsappModalBtn: {
    width: '100%',
    marginBottom: 12,
  },
  whatsappModalBtnButton: {
    // background: linear-gradient
    backgroundColor: '#EC4C60',
    borderRadius: 14,
  },
  whatsappModalBtnCancelButton: {
    // background: linear-gradient yellow
    backgroundColor: '#FFE34E',
    borderWidth: 2,
    borderColor: '#FBD300',
    // color: #414141 !important
  },
  whatsappModalBtnCancelButtonText: {
    color: '#414141',
  },

  // --- .vote-modal (Similar to Whatsapp) ---
  voteModalGrouppedButtons: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  voteModalLegendImg: {
    position: 'absolute',
    right: 45,
    top: 2,
  },
  voteModalVoteBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  voteModalVoteBlockTimerImg: {
    marginTop: 10,
    marginBottom: 12,
  },
  voteModalVoteBlockArticle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteModalVoteBlockArticleText: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    textAlign: 'center',
  },
  voteModalVoteBlockArticleSpan: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 57,
    lineHeight: 67,
    marginHorizontal: 13,
  },
  voteModalBtn: {
    width: '100%',
    marginBottom: 12,
  },
  voteModalBtnButton: {
    backgroundColor: '#EC4C60',
    borderRadius: 14,
  },
  voteModalBtnCancelButton: {
    backgroundColor: '#FFE34E',
    borderWidth: 2,
    borderColor: '#FBD300',
  },
  voteModalBtnCancelButtonText: {
    color: '#414141',
  },

  // --- .seats-modal ---
  seatsModal: {
    borderRadius: 10,
  },
  seatsModalDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 78,
    width: '100%',
    justifyContent: 'center',
    // color: #686868
  },
  seatsModalDivText: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    color: '#686868',
  },
  seatsModalDivLabel: {
    fontWeight: '300',
    fontSize: 28,
    lineHeight: 33,
    color: '#686868',
  },
  seatsModalSpan: {
    borderWidth: 1,
    borderColor: '#BABABA',
    // box-shadow
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    width: '97%',
    alignSelf: 'center', // margin: 0 auto
  },

  // --- .ontheway-modal ---
  onthewayModalCloseButton: {
    marginBottom: 10,
  },
  onthewayModalTime: {
    marginBottom: 24, // 1.5em ~ 24px
    fontSize: 32, // 2em ~ 32px
    textAlign: 'center',
  },

  // --- .profile-modal ---
  profileModal: {
    maxWidth: 500,
  },
  profileModalAvatar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  profileModalAvatarInput: {
    display: 'none',
  },
  profileModalAvatarImage: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 50, // 100%
    // cursor: pointer
  },
  profileModalAvatarImageBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileModalButton: {
    marginTop: 10,
  },

  // --- .candidates-modal ---
  candidatesModalFieldset: {
    padding: 10, // default
  },
  // Media max-width 768
  candidatesModalFieldsetSmall: {
    padding: 5,
  },
  candidatesModalCandidate: {
    padding: 10,
    margin: 10,
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, // #00000012
    shadowRadius: 7,
    elevation: 2,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  // Media max-width 768
  candidatesModalCandidateSmall: {
    padding: 5,
    margin: 5,
  },
  candidatesModalCandidateActive: { // :hover, :focus, :active
    borderColor: '#2ECE5B',
  },
  candidatesModalCandidateHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  candidatesModalCandidateHeaderAvatar: {
    marginRight: 15,
  },
  candidatesModalCandidateHeaderAvatarImg: {
    width: 60,
    height: 60, // нужно задать высоту для img
  },
  candidatesModalCandidateHeaderInfo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    paddingRight: 10,
  },
  candidatesModalCandidateHeaderSubinfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  candidatesModalCandidateHeaderSubinfoItem: {
    marginRight: 10,
  },
  candidatesModalCandidateHeaderName: {
    width: '100%',
    fontSize: 26,
    marginBottom: 10,
  },
  // Media max-width 768
  candidatesModalCandidateHeaderNameSmall: {
    fontSize: 18,
  },
  candidatesModalCandidateHeaderRegistration: {
    margin: 0, // marginTop: 0 etc
  },
  candidatesModalCandidateHeaderRegistrationSmall: {
    fontSize: 15,
  },
  candidatesModalCandidateHeaderReplies: {
    margin: 0,
  },
  candidatesModalCandidateHeaderRepliesSmall: {
    fontSize: 15,
  },
  candidatesModalCandidateHeaderArrow: {
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderColor: 'transparent',
    // transform rotate(45deg) -> RN syntax
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
  },
  candidatesModalCandidateHeaderArrowActive: {
    transform: [{ rotate: '-135deg' }],
    marginTop: 10,
    marginBottom: 0,
  },
  candidatesModalCandidateReplies: {
    opacity: 0,
    transform: [{ scale: 0 }],
    overflow: 'hidden',
  },
  candidatesModalCandidateRepliesActive: {
    marginBottom: 20,
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  candidatesModalCandidateReply: {
    backgroundColor: 'white',
    // box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
    padding: 15,
    borderRadius: 15,
    margin: 10,
    marginBottom: 20, // not:last-child logic handled in render
  },
  // Media max-width 768
  candidatesModalCandidateReplySmall: {
    padding: 10,
    margin: 5,
  },
  candidatesModalCandidateReplyHover: { // :hover
    shadowOpacity: 0.2, // #00000033
    shadowRadius: 15,
    elevation: 4,
  },
  candidatesModalCandidateReplyRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  candidatesModalCandidateReplyIcon: {
    marginRight: 15,
  },
  candidatesModalCandidateReplyIconImg: {
    width: 30,
    height: 30, // implicit
  },
  candidatesModalCandidateButtons: {
    width: '100%',
    opacity: 0,
    transform: [{ scale: 0 }],
    maxHeight: 0,
    overflow: 'hidden',
  },
  candidatesModalCandidateButtonsActive: {
    marginBottom: 30,
    marginTop: 30,
    maxHeight: 150,
    opacity: 1,
    transform: [{ scale: 1 }],
  },

  // --- .delete-file-modal ---
  deleteFileModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // transparentize(#fff, .1)
  },
  deleteFileModalText: {
    marginVertical: 20,
    alignSelf: 'center',
    fontSize: 21,
  },
  deleteFileModalButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  deleteFileModalAllButton: {
    backgroundColor: '#fff',
  },

  // --- CancelDriverOrderModal styles ---
  cancelDriverOrderModalFieldset: {
    marginVertical: 10,
  },
  cancelDriverOrderModalLegend: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cancelDriverOrderModalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelDriverOrderModalStatusText: {
    fontSize: 16,
    flex: 1,
  },
  cancelDriverOrderModalOkBtn: {
    marginLeft: 10,
  },



  takePassengerModal: {
    maxHeight: '90%',
  },

  scroll: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },


  whatsappModal: {
    alignSelf: 'stretch',
    maxWidth: 480,
  },

  codeBlock: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'stretch',
    width: '100%',
  },

  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },


  buttonsWrapper: {
    marginTop: 12,
    width: '100%',
  },

  whatsappModalBtnCancel: {
    marginTop: 6,
  },


  alertContainer: {
    width: '100%',
    marginTop: 8,
  },

});


