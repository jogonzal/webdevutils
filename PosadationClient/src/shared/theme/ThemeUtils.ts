import { loadTheme, createTheme } from 'office-ui-fabric-react'
import { EnumValue } from '../DataTypes'

export type Theme = 'Light' | 'Dark'
export const Theme = {
  Light: new EnumValue<Theme>('Light', 'Modo claro'),
  Dark: new EnumValue<Theme>('Dark', 'Modo oscuro'),
}

// Theme generator: https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/index.html
const darkTheme = createTheme({
  palette: {
    themePrimary: '#9dc9eb',
    themeLighterAlt: '#060809',
    themeLighter: '#192026',
    themeLight: '#2f3c46',
    themeTertiary: '#5e798d',
    themeSecondary: '#8ab1ce',
    themeDarkAlt: '#a6ceed',
    themeDark: '#b3d5ef',
    themeDarker: '#c7e0f4',
    neutralLighterAlt: '#2b2b2b',
    neutralLighter: '#333333',
    neutralLight: '#414141',
    neutralQuaternaryAlt: '#4a4a4a',
    neutralQuaternary: '#515151',
    neutralTertiaryAlt: '#6f6f6f',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#222222',
  }})
export const lightTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }})

export class ThemeUtils {
  public static loadTheme(theme: Theme) {
    switch (theme) {
      case 'Light':
        loadTheme(lightTheme)
        break
      case 'Dark':
        loadTheme(darkTheme)
        break
      default:
        throw new Error('Unhandled theme!')
    }
  }
}