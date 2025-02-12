import React, {
  ReactNode,
  useState,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  Provider as PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
} from "react-native-paper";

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextData {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const ThemeContext = createContext<ThemeContextData>({
  toggleTheme: () => {},
  isDarkTheme: false,
});

export const useThemeToggle = () => useContext(ThemeContext);

/**
 * Custom Light Theme based on MD3LightTheme.
 * Here we override key colors like primary, secondary, background, and text.
 */
export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    primary: "rgb(177, 45, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 219, 209)",
    onPrimaryContainer: "rgb(59, 9, 0)",
    secondary: "rgb(0, 101, 139)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(197, 231, 255)",
    onSecondaryContainer: "rgb(0, 30, 45)",
    tertiary: "rgb(66, 89, 169)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(220, 225, 255)",
    onTertiaryContainer: "rgb(0, 21, 80)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 25)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(32, 26, 25)",
    surfaceVariant: "rgb(245, 222, 216)",
    onSurfaceVariant: "rgb(83, 67, 63)",
    outline: "rgb(133, 115, 110)",
    outlineVariant: "rgb(216, 194, 188)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 45)",
    inverseOnSurface: "rgb(251, 238, 235)",
    inversePrimary: "rgb(255, 181, 161)",
    elevation: {
      level0: "transparent",
      level1: "rgb(251, 241, 242)",
      level2: "rgb(249, 235, 235)",
      level3: "rgb(246, 228, 227)",
      level4: "rgb(246, 226, 224)",
      level5: "rgb(244, 222, 219)",
    },
    surfaceDisabled: "rgba(32, 26, 25, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
    backdrop: "rgba(59, 45, 42, 0.4)",
  },
};

/**
 * Custom Dark Theme based on MD3DarkTheme.
 * We similarly override key colors to suit a dark background.
 */
export const CustomDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: "rgb(255, 181, 161)",
    onPrimary: "rgb(96, 20, 0)",
    primaryContainer: "rgb(136, 32, 0)",
    onPrimaryContainer: "rgb(255, 219, 209)",
    secondary: "rgb(126, 208, 255)",
    onSecondary: "rgb(0, 52, 74)",
    secondaryContainer: "rgb(0, 76, 106)",
    onSecondaryContainer: "rgb(197, 231, 255)",
    tertiary: "rgb(182, 196, 255)",
    onTertiary: "rgb(10, 41, 120)",
    tertiaryContainer: "rgb(41, 65, 144)",
    onTertiaryContainer: "rgb(220, 225, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(32, 26, 25)",
    onBackground: "rgb(237, 224, 221)",
    surface: "rgb(32, 26, 25)",
    onSurface: "rgb(237, 224, 221)",
    surfaceVariant: "rgb(83, 67, 63)",
    onSurfaceVariant: "rgb(216, 194, 188)",
    outline: "rgb(160, 140, 135)",
    outlineVariant: "rgb(83, 67, 63)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(237, 224, 221)",
    inverseOnSurface: "rgb(54, 47, 45)",
    inversePrimary: "rgb(177, 45, 0)",
    elevation: {
      level0: "transparent",
      level1: "rgb(43, 34, 32)",
      level2: "rgb(50, 38, 36)",
      level3: "rgb(57, 43, 40)",
      level4: "rgb(59, 45, 41)",
      level5: "rgb(63, 48, 44)",
    },
    surfaceDisabled: "rgba(237, 224, 221, 0.12)",
    onSurfaceDisabled: "rgba(237, 224, 221, 0.38)",
    backdrop: "rgba(59, 45, 42, 0.4)",
  },
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Use memo to only update the theme object when isDark changes
  const theme = useMemo(
    () => (isDark ? CustomDarkTheme : LightTheme),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkTheme: isDark }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
