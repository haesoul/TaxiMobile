import { useNavigation, useRoute } from '@react-navigation/native'
import moment from 'moment'
import React, { FC, useEffect, useState } from 'react'
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import config from '../../config'
import images from '../../constants/images'
import SITE_CONSTANTS from '../../siteConstants'
import { useInterval } from '../../tools/hooks'
import { EBookingDriverState, EUserRoles, ILanguage } from '../../types/types'
// import { setCookie } from '../../utils/cookies'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SvgProps } from 'react-native-svg'
import { t, TRANSLATION } from '../../localization'
import store, { IRootState } from '../../state'
import { clientOrderSelectors } from '../../state/clientOrder'
import { configActionCreators, configSelectors } from '../../state/config'
import { modalsActionCreators } from '../../state/modals'
import { ordersSelectors } from '../../state/orders'
import { userSelectors } from '../../state/user'
import { Burger } from '../Burger/Burger'



const FLAGS_IMAGES: Record<string, FC<SvgProps>> = {
  ru: images.flagRu,
  gb: images.flagGb,
  fr: images.flagFr,
  ma: images.flagMar,
}


interface IMenuItem {
  label: string
  action?: (index: number) => any
  href?: string
  type?: string
}

const mapStateToProps = (state: IRootState) => ({
  user: userSelectors.user(state),
  language: configSelectors.language(state),
  activeOrders: ordersSelectors.activeOrders(state),
  selectedOrder: clientOrderSelectors.selectedOrder(state),
})

const mapDispatchToProps = {
  setLanguage: configActionCreators.setLanguage,
  setLoginModal: modalsActionCreators.setLoginModal,
  setProfileModal: modalsActionCreators.setProfileModal,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

interface IProps extends ConnectedProps<typeof connector> {
  style?: StyleProp<ViewStyle>
}

function Header({
  user,
  language,
  activeOrders,
  selectedOrder,
  setLanguage,
  setLoginModal,
  setProfileModal,
  style,
}: IProps) {
  const [languagesOpened, setLanguagesOpened] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [menuOpened, setMenuOpened] = useState(false)

  if (!menuOpened && languagesOpened) setLanguagesOpened(false)

  const navigation = useNavigation()
  const route = useRoute()

  const [savedConfig, setSavedConfig] = useState<string | null>(null);

  const clientOrder = activeOrders?.find(item => item.b_id === selectedOrder)
  const driver = clientOrder?.drivers?.find(
    item =>
      item.c_state > EBookingDriverState.Canceled ||
      item.c_state === EBookingDriverState.Considering,
  )

  const menuItems: IMenuItem[] = []
  menuItems.push({
    label: t('profile'),
    action: () => {
      setProfileModal({ isOpen: true })
      setMenuOpened(false)
    },
  })

  menuItems.push({
    label: t(TRANSLATION.EDIT_LANGS_PAGE_TITLE),
    type: 'language',
    action: () => {
      setLanguagesOpened(prev => !prev)
    },
  })

  useInterval(() => {
    SITE_CONSTANTS.init(store.getState().global.data);
    if (clientOrder) {
      if (driver) return setSeconds(0)
      const _seconds = moment().diff(clientOrder?.b_start_datetime, 'seconds')
      if (_seconds > (clientOrder?.b_max_waiting || SITE_CONSTANTS.WAITING_INTERVAL))
        return setSeconds(0)
      setSeconds(_seconds)
    } else if (seconds !== 0) setSeconds(0)
  }, 1000)

  const onReturn = () => {

    if ((navigation as any).canGoBack && (navigation as any).canGoBack()) {
      (navigation as any).goBack()
    }
  }

  const toggleMenuOpened = () => {
    setMenuOpened(prev => !prev)
  }

  const detailedOrderID =
    (route.params as any)?.id ??

    (route.name && String(route.name).toLowerCase().includes('driver-order')
      ? (route.params as any)?.id ?? null
      : null)

  let avatar = images.noUserAvatar
  let avatarResizeMode: 'cover' | 'contain' = 'contain'
  if (user) {
    avatar = (user as any).u_photo || images.noImgAvatar
    avatarResizeMode = (user as any).u_photo ? 'cover' : 'contain'
  }

  // const languages = SITE_CONSTANTS.LANGUAGES.filter(
  //   x => x.iso !== (config.getSavedConfig !== 'children' ? ' ' : 'ru'),
  // )

  useEffect(() => {
    config.getSavedConfig().then(setSavedConfig);
  }, []);
  
  const languages =
    savedConfig === null
      ? SITE_CONSTANTS.LANGUAGES
      : SITE_CONSTANTS.LANGUAGES.filter(
          (x: any) => x.iso !== (savedConfig !== 'children' ? ' ' : 'ru'),
        );



  const handleLanguageChange = async (lang: ILanguage) => {
    // setCookie('user_lang', lang.iso)
    // await AsyncStorage.setItem('user_lang', lang.iso)
    await AsyncStorage.setItem("user_lang", JSON.stringify(lang.iso));

    setLanguage(lang)
    setLanguagesOpened(false)
    setMenuOpened(false)
  }

  const renderMenu = () => {
    if (!menuOpened) return null

    return (
      <View style={styles.menuListWrapper}>
        <ScrollView style={[styles.menuList, languagesOpened && styles.menuListActive]}>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  item.href
                    ?
                      (navigation as any).navigate(item.href)
                    : item.action?.(index)
                }
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>{item.label}</Text>
              </TouchableOpacity>

              {item.type === 'language' && languagesOpened && (
                <View style={styles.languagesList}>
                  {languages.map((lang: any) => (
                    <TouchableOpacity
                      key={lang.id}
                      onPress={e => {

                        handleLanguageChange(lang)
                      }}
                      style={styles.languageFlag}
                    >

                    {lang.logo in FLAGS_IMAGES && (() => {
                      const Flag: FC<SvgProps> = FLAGS_IMAGES[lang.logo];
                      return (
                        <View style={styles.languageFlagIcon}>
                          <Flag width={24} height={16} />
                        </View>
                      )
                    })()}


                      <Text style={styles.languageFlagText}>{lang.native}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={[styles.header, style]}>
      <View style={styles.burgerWrapper}>
        <View style={styles.column}>
          {detailedOrderID ? (
            <TouchableOpacity onPress={onReturn} style={styles.menuIconWrapper}>

              <View style={styles.menuIcon}> 
                <images.returnIcon width={28} height={28}/>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.menuWrapper}>
              <Burger onPress={toggleMenuOpened} isOpen={menuOpened} />
              {renderMenu()}
            </View>
          )}
        </View>

        {user?.u_role === EUserRoles.Client && (
          <TouchableOpacity style={styles.voteButton} activeOpacity={0.8}>
            <View style={styles.voteIcon}>
              <images.handUp width={18} height={18} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.headerLogo}>
        {/* <Image source={images.logo} style={styles.logoImg} resizeMode="contain" /> */}
        <View style={styles.logoImg}>
          <images.logo width={60} height={32} />
        </View>
      </View>

      <View style={styles.headerAvatarWrapper}>
        <Text style={styles.headerUserName}>
          {user?.u_city
            ? `${((globalThis as any).data?.cities?.[user?.u_city]?.[language?.iso ?? (globalThis as any).data?.langs?.[(globalThis as any).default_lang]?.iso]) ?? ''},`
            : ''}
        </Text>
        <Text style={styles.headerUserLng}>{language?.iso?.toUpperCase()}</Text>

        <TouchableOpacity
          onPress={() => setLoginModal(true)}
          style={styles.avatarTouchable}
          activeOpacity={0.8}
        >

          <View style={[styles.avatar, avatarResizeMode === 'cover' ? styles.avatarCover : undefined]}>
            <images.avatar width={60} height={32} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default connector(Header)

const $height = 80
const $red = '#FF2400'

const styles = StyleSheet.create({
  header: {
    position: 'relative' as any,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    boxSizing: 'border-box' as any,
    backgroundColor: '#FFFFFF',
  },


  burgerWrapper: {
    flexDirection: 'row',
    columnGap: 8 as any,
    alignItems: 'center',
    height: 32,
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrapper: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  menuIcon: {
    width: 28,
    height: 28,
    tintColor: '#FF0000',
  },
  menuWrapper: {
    cursor: 'pointer' as any,
    padding: 5,
    position: 'relative' as any,
    height: $height,
    display: 'flex' as any,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuListWrapper: {
    position: 'absolute' as any,
    top: $height,
    left: 0,
    zIndex: 50,
  },
  menuList: {
    width: 250,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 0,
    maxHeight: 0,
    opacity: 0,
    transform: [{ scale: 0 }],

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuListActive: {
    maxHeight: 500,
    opacity: 1,
    transform: [{ scale: 1 }],
  },

  menuItem: {
    position: 'relative' as any,
  },

  menuButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 250,
    textAlign: 'left' as any,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#000',
  },

  languagesList: {
    position: 'absolute' as any,
    top: 0,
    right: 0,
    marginRight: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#858585',
    borderRadius: 5,
    zIndex: 60,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  languageFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  languageFlagIcon: {
    width: 24,
    height: 16,
  },

  languageFlagText: {
    marginLeft: 5,
  },

  voteButton: {
    borderWidth: 0,
    backgroundColor: $red,
    height: 32,
    width: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteIcon: {
    width: 18,
    height: 18,
  },

  headerLogo: {
    position: 'absolute'as any,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 60,
    height: 32,
  },

  headerAvatarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4 as any,
    height: 32,
  },
  headerUserName: {
    color: '#BDBDBD',
    fontSize: 13,
    fontWeight: '500',
  },
  headerUserLng: {
    color: '#BDBDBD',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },

  avatarTouchable: {
    marginLeft: 8,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#999999',
  },
  avatarCover: {
  },
})
