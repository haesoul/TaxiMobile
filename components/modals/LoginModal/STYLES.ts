
import { StyleSheet, ViewStyle } from 'react-native';

export default StyleSheet.create({
  modal: {
  position: 'relative',  
  width: '90%',

  flexDirection: 'column',

  maxHeight: '95%',

  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: 9,
  maxWidth: 900,
  padding: 10,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 30 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 10,
  },
  loginModal: {
    maxWidth: 600,
  },

  loginModalError: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },

  loginModalLogOut: {
    justifyContent: 'center',
    height: 36,
    alignItems: 'center',
    fontFamily: 'Roboto',
    color: '#6F1717',
    fontSize: 25,
  },

  tabs: {
    marginBottom: 20,
  },

  tabsChild: {
    width: '100%',
    borderRadius: 0,
  },
  tabsChildFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tabsChildLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },


  errorMessage: {
    alignSelf: 'center',
  },


  loginForm: {

    color: '#1D2A50',
  } as ViewStyle,

  loginFormInput: {
    marginBottom: 40,
  },


  fieldset: {
    borderRadius: 13,
    width: '100%',

  },
  legend: {
    alignSelf: 'center',
    paddingHorizontal: 15,
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
    color: '#A90000',
  },

  loginSection: {
    flexDirection: 'column',
  },

  checkboxes: {
    marginBottom: 10,
  },

  radioLabelBefore: {
    marginRight: 13,
  },
  radioLabel: {
    fontWeight: '300',
    fontSize: 20,
    lineHeight: 23,
    color: '#510000',
  },

  loading: {
    height: 50,
    width: 50,
    alignSelf: 'flex-end',
  },

  loginBtn: {
    height: 50,
    marginBottom: 10,

    backgroundColor: '#EC4C60',

  },


  loadingFrame: {
    zIndex: 1,
  },
  loadingFrameImage: {
    width: 64,
    height: 64,
  },

  inputRequiredBefore: {
    position: 'absolute',
    width: 24,
    height: 52,
    borderTopRightRadius: 14,
    top: 1,
    right: 1,
    backgroundColor: '#EC4C60',
    opacity: 0.3,
    borderBottomRightRadius: 14,
    zIndex: 1,
  },

  inputRequiredAfter: {
    position: 'absolute',
    width: 24,
    height: 54,
    color: '#6F1717',
    fontSize: 18,
    fontFamily: 'Roboto',
    lineHeight: 34,
    top: 0,
    right: 0,
    textAlign: 'center',
  },


  refCodeToggler: {
    marginTop: 20,
  },


  refCodeInput: {

    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },

  refCodeInputActive: {
    height: 100,
    opacity: 1,
  },

  workTypeButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#858585',
    backgroundColor: 'transparent',
    borderRadius: 14,
    textAlign: 'left',
    marginBottom: 10, 
  },

  street: {
    marginTop: 20,
  },

  restorePasswordBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 54,
    alignSelf: 'flex-start',
    marginTop: 38,
    marginLeft: 12,
  },


  restorePasswordBlockButtonDisabled: {
    backgroundColor: '#dadada',
    borderColor: '#dbdbdb',
  },


  signInPasswordBlock: {
    flexDirection: 'row',
  },


  passwordBlockInput: {
    flexGrow: 1,
    flexDirection: 'column',
  },

  passwordBlockButtons: {
    position: 'absolute',
    right: 0,
  },


  alertContainer: {
    justifyContent: 'center',
  },


  sendToWhatsappCheckbox: {
    marginBottom: 40,
  },
});
