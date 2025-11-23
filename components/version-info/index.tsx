import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import Config from '../../config'
import { getApiConstants } from '../../siteConstants'
import { configActionCreators } from '../../state/config'
import { ILanguage } from '../../types/types'


import AsyncStorage from '@react-native-async-storage/async-storage'

import version from '../../version.json'

const mapDispatchToProps = {
  setLanguage: configActionCreators.setLanguage,
}

const connector = connect(null, mapDispatchToProps)

interface IProps {
  setLanguage?: typeof configActionCreators.setLanguage
}

const VersionInfo: React.FC<IProps> = ({ setLanguage }) => {
  const _dt = new Date(version.buildTimestamp)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  const saveLang = async (value: string) => {
    try {
      await AsyncStorage.setItem('user_lang', value)
    } catch (e) {
      console.log('AsyncStorage set error', e)
    }
  }
  
  const handleClick = () => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastClickTime

    if (timeDiff < 500) {
      setClickCount(prev => prev + 1)
    } else {
      setClickCount(1)
    }
    
    setLastClickTime(currentTime)

    if (clickCount === 2) {
      const langs = getApiConstants()?.langs
      const russianLang = langs
        ? Object.entries(langs)?.find(([_, lang]) => lang.iso === 'ru')
        : undefined

      if (russianLang && setLanguage) {
        const [id, lang] = russianLang
        const language: ILanguage = {
          id: parseInt(id),
          iso: lang.iso,
          logo: lang.logo,
          native: lang.native,
          ru: lang.ru,
          en: lang.en,
          es: lang.es,
          tr_code: lang.iso
        }

        saveLang('ru')
        setLanguage(language)
      }
      setClickCount(0)
    }
  }

  return (
    <View style={styles.versionInfo}>
      <TouchableOpacity onPress={handleClick}>
        <Text style={[styles.infoItem, styles.database]}>
          {'DB: ' + (Config.getSavedConfig ? Config.getSavedConfig : 'default')}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.infoItem, styles.name]}>{version.name}</Text>
      <Text style={[styles.infoItem, styles.build]}>{`ver. ${version.version}`}</Text>
      <Text style={[styles.infoItem, styles.date]}>{_dt.toLocaleString()}</Text>
    </View>
  )
}

export default connector(VersionInfo)

const styles = StyleSheet.create({
  versionInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  infoItem: {
    marginLeft: 8,
  },

  database: {
    flexGrow: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  build: {
    fontSize: 16,
  },

  date: {
    fontSize: 12,
  },
})
