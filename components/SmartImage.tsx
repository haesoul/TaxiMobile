import React from "react";
import { Image, View } from "react-native";

interface Props {
  source: any;
  style?: any;
  resizeMode?: any;
  accessibilityLabel?: any
}

export default function SmartImage({ source, style, resizeMode, accessibilityLabel, ...props }: Props) {
  if (!source) return null;

  // 1) Если это SVG-компонент
  if (typeof source === "function") {
    const SvgIcon = source;
    return <View style={style}><SvgIcon width={style?.width} height={style?.height} resizeMode={resizeMode} /></View>;
  }

  // 2) Если это путь string
  if (typeof source === "string") {
    const isSvg = source.endsWith(".svg");

    if (isSvg) {
      // У SVG по строке нельзя сделать <Image>, он должен быть компонентом
      console.warn("Передан SVG как строка — импортируй SVG как компонент.");
      return null;
    }

    return <Image source={{ uri: source }} style={style} {...props} accessibilityLabel={accessibilityLabel}/>;
  }

  // 3) Если это локальный asset (require)
  if (typeof source === "number") {
    return <Image source={source} style={style} {...props} accessibilityLabel={accessibilityLabel}/>;
  }

  // 4) Если это { uri: string }
  if (source?.uri) {
    const isSvg = source.uri.endsWith(".svg");
    if (isSvg) {
      console.warn("SVG по uri не рендерится через Image, используй компонент.");
      return null;
    }
    return <Image source={{ uri: source.uri }} style={style} {...props} accessibilityLabel={accessibilityLabel}/>;
  }

  return null;
}
