import { Dimensions, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const formPlaceholderHeight = 208 - 16;
const formContainerTop = -40 - 8 - 16;

const styles = StyleSheet.create({
  passengerMiniOrders: {
    position: 'absolute',
    zIndex: 1,
    marginBottom: 20,
  },

  passengerFormMapContainer: {
    marginTop: -16,
    flexGrow: 1,
    flexBasis: '100%',
    zIndex: 0,
  },

  passengerFormPlaceholder: {
    flex: 0,
    width: '100%',
    height: formPlaceholderHeight,
  },

  passengerFormContainer: {
    position: 'absolute',
    top: formContainerTop,
    zIndex: 2,
    flexDirection: 'column',
    rowGap: 8,
    overflow: 'hidden',
    width: '100%',
    minHeight: Math.min(520, windowHeight),
    maxHeight: '100%',
    paddingTop: 8,

  },

  passengerDraggable: {
    position: 'relative',
    flexDirection: 'column',
    overflow: 'scroll',
    rowGap: 16,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#ffffff',
  },

  passengerSwipeLine: {
    position: 'absolute',
    top: 4,
    left: '50%',
    width: 114,
    height: 4,
    backgroundColor: '#E7E7E7',
    borderRadius: 2,
    transform: [{ translateX: -57 }],
  },

  formContainer: {
    position: 'relative',
    zIndex: 0,
  },

  formHeading: {
    fontSize: 25,
    color: '#6f1717',
    fontWeight: '300',
    margin: 0,
    marginTop: 10,
    position: 'relative',
    top: 30,
  },

  detailsSummary: {
    fontSize: 18,
    fontWeight: '300',
    textDecorationLine: 'underline',

    marginBottom: 10,
  },

  detailsArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderLeftColor: 'transparent',
    borderRightWidth: 7,
    borderRightColor: 'transparent',
    marginLeft: 10,
    transform: [{ rotate: '0deg' }], 
  },

  detailsTextarea: {
    width: '100%',
    maxWidth: '100%',
  },



  //Voting


  passengerVotingForm: {
    // > * + * { margin-top: 16px } 
    // В RN: применять marginTop:16 к дочерним элементам кроме первого в компоненте
  },

  passengerVotingFormGroup: {
    marginTop: 0,
    paddingTop: 16,   // &:not(:first-child)
    paddingBottom: 16, // &:not(:last-child)
    // > * + * { marginTop: 16 } -> применять marginTop:16 к дочерним элементам кроме первого
  },

  passengerVotingFormOrderButtonWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // RN >= 0.70, иначе использовать marginRight/marginBottom на кнопках
  },

  passengerVotingFormOrderButton: {
    flex: 1, // flex: 1 0 0 -> flexGrow:1, flexShrink:0, flexBasis:0
    flexShrink: 0,
    flexBasis: 0,
  },

  passengerVotingFormOrderButtonError: {
    width: '100%',
    fontSize: 15,
    color: '#FF1111',
  },

  passengerVotingFormLocationWrapper: {
    flexDirection: 'column',
    rowGap: 8,
    position: 'relative',
  },

  passengerVotingFormSeatsTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  passengerVotingFormTimeTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  passengerVotingFormCarClassTitle: {
    fontSize: 13,
    fontWeight: '500',
  },

  passengerVotingFormSeatsAndTime: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 12,
    height: 56,
    paddingTop: 6,
  },

  passengerVotingFormSeats: {
    flexDirection: 'column',
    rowGap: 6,
    width: '50%',
  },

  passengerVotingFormTime: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    alignItems: 'center',
  },

  passengerVotingFormTimeWrapper: {
    flexDirection: 'column',
    height: 28,
  },

  passengerVotingFormTimeValue: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.5)',
  },

  passengerVotingFormTimeBtn: {
    width: 34,
    height: 24,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },

  passengerVotingFormTimeIcon: {
    width: 24,
    // stroke color: set on SVG component
  },

  passengerVotingFormCarClass: {
    width: '100%',
    flexDirection: 'column',
    rowGap: 8,
  },

  passengerVotingFormCarClassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    fontWeight: '500',
  },

  passengerVotingFormCarNearbyInfo: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
  },

  passengerVotingFormCarNearbyIcon: {
    width: 16,
    // stroke color: set on SVG component
  },

  passengerVotingFormWaitingTimeIcon: {
    width: 16,
    // stroke color: set on SVG component
  },

  passengerVotingFormCarNearbyInfoText: {
    fontSize: 10,
    fontWeight: '500',
  },

  passengerVotingFormComments: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  passengerVotingFormCommentsWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },

  passengerVotingFormCommentsTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },

  passengerVotingFormCommentsValue: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'left',
    maxWidth: '100%',
    overflow: 'hidden',
  },

  passengerVotingFormCommentsBtn: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
    height: 40,
  },
});

export default styles