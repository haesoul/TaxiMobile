import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import type { SvgProps } from 'react-native-svg'
import { names } from '../../constants/icons'
import SITE_CONSTANTS, { EIconsPalettes } from '../../siteConstants'

import * as GHA from '../../assets/icons/GHA'

import store from '@/state'
import * as Default from '../../assets/icons/default'


type IconKey = keyof typeof names

export interface IProps extends SvgProps {
  src: IconKey
  size?: number
  color?: string
  style?: StyleProp<ViewStyle>
}

const palettes: Record<EIconsPalettes, Record<string, React.FC<SvgProps>>> = {
  [EIconsPalettes.GHA]: (GHA as any) as Record<string, React.FC<SvgProps>>,
  [EIconsPalettes.Default]: (Default as any) as Record<string, React.FC<SvgProps>>,
}

export default function Icon({ src, size = 24, color, style, ...svgProps }: IProps) {
  
  SITE_CONSTANTS.init(store.getState().global.data);
  const directory = SITE_CONSTANTS.ICONS_PALETTE_FOLDER as EIconsPalettes || EIconsPalettes.Default
  const palette = palettes[directory] || palettes[EIconsPalettes.Default]

  const exportKeyCandidates = [
    src as string,
    (names[src] || '').replace(/\.svg$/i, ''),
  ]

  let SvgComponent: React.FC<SvgProps> | undefined
  for (const key of exportKeyCandidates) {
    if (key && (palette as any)[key]) {
      SvgComponent = (palette as any)[key]
      break
    }
  }

  if (!SvgComponent) {
    const anyPalette = palette as any
    const first = Object.keys(anyPalette)[0]
    SvgComponent = first ? anyPalette[first] : undefined
  }

  if (!SvgComponent) {
    console.warn(`Icon: symbol "${String(src)}" not found in palette "${String(directory)}"`)
    return null
  }

  const extra: Partial<SvgProps> = {}
  if (color) extra.fill = color

  return <SvgComponent width={size} height={size} {...extra} {...svgProps} />
}
