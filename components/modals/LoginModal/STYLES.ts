
import { Dimensions, Platform, StyleSheet, ViewStyle } from 'react-native';

const { width } = Dimensions.get('window')
const MODAL_HORIZONTAL_PADDING = 20
const MODAL_MAX_WIDTH = Math.min(560, width - MODAL_HORIZONTAL_PADDING * 2)


const COLORS = {
background: '#FFFFFF',
surface: '#FFFFFF',
text: '#0F1724',
subtleText: '#6B7280',
accent: '#2563EB',
accentLight: '#E8F0FF',
danger: '#EF4444',
}

export default StyleSheet.create({
  modal: {
  position: 'relative',  
  width: '90%',

  flexDirection: 'column',

  maxHeight: '95%',

  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  // backgroundColor: 'black',
  borderRadius: 9,
  maxWidth: 900,
  padding: 10,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 30 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 10,
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


  // loadingFrame: {
  //   zIndex: 1,
  // },
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



  subtitle: {
    fontSize: 13,
    color: COLORS.subtleText,
    textAlign: 'center',
    marginBottom: 8,
    },
    
    
  loginModal: {
    borderRadius: 16,
    backgroundColor: COLORS.background,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignSelf: 'center',
    minWidth: 300,
  
  ...Platform.select({
      ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      },
      android: {
      elevation: 18,
      },
      }),
      overflow: 'hidden',
      },
  loadingFrame: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
  },
      fieldset: {
      width: '100%',
      marginBottom: 10,
      },
      legend: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: 15,
      },
      loginSection: {
      width: '100%',
      minHeight: 150,
      maxHeight: '70%',
      paddingVertical: 5,
      },
      tabsWrapper: {
      marginBottom: 12,
      },
      versionInfo: {
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      },
      inputWrapper: {
      marginBottom: 12,
      },
      primaryButton: {
      backgroundColor: COLORS.accent,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      },
      primaryButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 15,
      },
      linkButton: {
      paddingVertical: 8,
      alignItems: 'center',
      },
      linkButtonText: {
      color: COLORS.accent,
      fontSize: 14,
      fontWeight: '600',
      },
    errorText: {
      color: COLORS.danger,
      fontSize: 13,
      marginTop: 6,
    },
  subtleDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
    borderRadius: 1,
  },
});
