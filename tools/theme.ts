import SITE_CONSTANTS from '../siteConstants'
import LinearGradient from 'react-native-linear-gradient'
// export const gradient = (color?: string, color2?: string) =>
//   `linear-gradient(90deg, ${
//     color || SITE_CONSTANTS.PALETTE.primary.dark
//   } 0%, ${
//     color2 || SITE_CONSTANTS.PALETTE.primary.main
//   } 100%)`


// Пока что необязательно



export const GradientBackground = ({ color1, color2, style, children }) => (
  <LinearGradient
    colors={[color1 || SITE_CONSTANTS.PALETTE.primary.dark, color2 || SITE_CONSTANTS.PALETTE.primary.main]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={style}
  >
    {children}
  </LinearGradient>
);