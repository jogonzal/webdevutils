import { initializeIcons, ITheme, registerOnThemeChangeCallback } from '@fluentui/react'
import * as React from 'react'
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom'

import { App } from './components/App'
import { Log } from './shared/logging/Log'
import { initializeSettings as initializeAppSettings } from './shared/settings/SettingsDatabase'
import { ThemeUtils } from './shared/theme/ThemeUtils'

// Used in index.html
import faviconIco from './assets/img/favicon.ico'

// This if is to just use this value
if (faviconIco) {
  Log.logger.info('Starting app...')
}

// TODO: move to https://www.npmjs.com/package/@fluentui/react-icons. These are lighter, non-font icons
// More docs: https://github.com/microsoft/fluentui-system-icons#readme
initializeIcons()

registerOnThemeChangeCallback((theme: ITheme) => {
  Log.logger.info('Theme changed!')
  const root = document.getElementsByTagName('html')[0]
  root.style.backgroundColor = theme.semanticColors.bodyBackground
  root.style.color = theme.semanticColors.bodyText
})

async function start(): Promise<void> {
  const settings = await initializeAppSettings()
  ThemeUtils.loadTheme(settings.theme)

  render((
    <App />
  ), document.getElementById('root'), () => {
    Log.logger.info('Done rendering!')
  })
}

start()
