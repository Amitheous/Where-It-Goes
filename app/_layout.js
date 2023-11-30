import { SplashScreen, Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme as DefaultTheme, configureFonts } from 'react-native-paper';


import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

const fontConfig = {
  customVariant: {
    fontFamily: Platform.select({
      web: 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
      ios: 'Montserrat',
      android: 'Montserrat',
      default: 'sans-serif',
    }),
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 22,
    fontSize: 20,
  }
};

const theme = {
  "colors": {
    "primary": "rgb(77, 217, 229)",
    "onPrimary": "rgb(0, 54, 59)",
    "primaryContainer": "rgb(0, 79, 85)",
    "onPrimaryContainer": "rgb(128, 244, 255)",
    "secondary": "rgb(177, 203, 206)",
    "onSecondary": "rgb(27, 52, 55)",
    "secondaryContainer": "rgb(50, 75, 77)",
    "onSecondaryContainer": "rgb(204, 232, 234)",
    "tertiary": "rgb(183, 199, 234)",
    "onTertiary": "rgb(33, 48, 76)",
    "tertiaryContainer": "rgb(56, 71, 100)",
    "onTertiaryContainer": "rgb(215, 226, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(25, 28, 29)",
    "onBackground": "rgb(224, 227, 227)",
    "surface": "rgb(25, 28, 29)",
    "onSurface": "rgb(224, 227, 227)",
    "surfaceVariant": "rgb(63, 72, 73)",
    "onSurfaceVariant": "rgb(190, 200, 201)",
    "outline": "rgb(137, 147, 147)",
    "outlineVariant": "rgb(63, 72, 73)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(224, 227, 227)",
    "inverseOnSurface": "rgb(45, 49, 49)",
    "inversePrimary": "rgb(0, 105, 112)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(28, 37, 39)",
      "level2": "rgb(29, 43, 45)",
      "level3": "rgb(31, 49, 51)",
      "level4": "rgb(31, 51, 53)",
      "level5": "rgb(32, 55, 57)"
    },
    "surfaceDisabled": "rgba(224, 227, 227, 0.12)",
    "onSurfaceDisabled": "rgba(224, 227, 227, 0.38)",
    "backdrop": "rgba(41, 50, 51, 0.4)"
  },
  "fonts": configureFonts({config: fontConfig}),
};

export default function Layout() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_300Light,
    Montserrat_100Thin,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_600SemiBold
  });

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.
    return( 
    
    <PaperProvider theme={theme}>
      <SplashScreen  />
    </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}  />
    </PaperProvider>
  );
}
