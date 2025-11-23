import store from '@/state'
import React, { createContext, useContext, useMemo } from 'react'
import { StyleSheet, useColorScheme, View } from 'react-native'
import SITE_CONSTANTS from '../../siteConstants'

export type ThemeColors = {
  primary: string
  primaryMain: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryMain: string
  secondaryLight: string
  secondaryDark: string
  foreground: string
  accent: string
  icon: string
}

const defaultColors: ThemeColors = {
  primary: '#FFFFFF',
  primaryMain: '#FFFFFF',
  primaryLight: '#FFFFFF',
  primaryDark: '#000000',
  secondary: '#FFFFFF',
  secondaryMain: '#FFFFFF',
  secondaryLight: '#FFFFFF',
  secondaryDark: '#000000',
  foreground: '#000000',
  accent: '#FF2400',
  icon: '#1C274C',
}

export const ThemeContext = createContext<ThemeColors>(defaultColors)

export function useTheme() {
  return useContext(ThemeContext)
}

export default function Theme({ children }: React.PropsWithChildren<{}>) {

  const scheme = useColorScheme()
  SITE_CONSTANTS.init(store.getState().global.data);
  const palette: any = SITE_CONSTANTS?.PALETTE || {}

  const colors = useMemo<ThemeColors>(() => {
    const primary = palette.primary || {}
    const secondary = palette.secondary || {}

    const primaryMain = (primary && (primary.main ?? primary)) || defaultColors.primaryMain
    const primaryLight = (primary && (primary.light ?? primary)) || primaryMain
    const primaryDark = (primary && (primary.dark ?? primary)) || primaryMain

    const secondaryMain = (secondary && (secondary.main ?? secondary)) || defaultColors.secondaryMain
    const secondaryLight = (secondary && (secondary.light ?? secondary)) || secondaryMain
    const secondaryDark = (secondary && (secondary.dark ?? secondary)) || secondaryMain

    return {
      primary: primaryMain,
      primaryMain,
      primaryLight,
      primaryDark,
      secondary: secondaryMain,
      secondaryMain,
      secondaryLight,
      secondaryDark,
      foreground: '#000000',
      accent: '#FF2400',
      icon: '#1C274C',
    }
  }, [palette])


  const backgroundColor = scheme === 'dark' ? colors.primaryDark : colors.primaryLight

  return (
    <ThemeContext.Provider value={colors}>
      <View style={[styles.theme, { backgroundColor }]}>{children}</View>
    </ThemeContext.Provider>
  )
}

const styles = StyleSheet.create({

  theme: {
    flex: 1,
  },


  primary: {},
  primaryMain: {},
  primaryLight: {},
  primaryDark: {},

  secondary: {},
  secondaryMain: {},
  secondaryLight: {},
  secondaryDark: {},

  foreground: {},
  accent: {},
  icon: {},
})
