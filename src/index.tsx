import { initializeIcons, ITheme, registerOnThemeChangeCallback } from '@fluentui/react'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import * as React from 'react'
import { render } from 'react-dom'

import { App } from './components/App'
import { getCurrentUser } from './shared/getCurrentUser'
import { Log } from './shared/logging/Log'
import { initializeSettings as initializeAppSettings } from './shared/settings/SettingsDatabase'
import { ThemeUtils } from './shared/theme/ThemeUtils'

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: '32fb18f1-357e-43db-afae-7ec05f923b50',
    disableFetchTracking: false,
    // How long does the user need to be inactive for a session to expire: 5 minutes
    sessionRenewalMs: 5 * 60 * 1000, // 5 minutes
    // Max session length
    sessionExpirationMs: 10 * 60 * 1000 // 10 minutes
  }
})
appInsights.loadAppInsights()
appInsights.trackPageView() // Manually call trackPageView to establish the current user/session/pageview
appInsights.context.sessionManager.update() // Update session
const currentUser = getCurrentUser()
if (currentUser) {
  appInsights.setAuthenticatedUserContext(currentUser.UsuarioClave)
}
Log.logger.configureTelemetry(appInsights) // Pass in the logger

Log.logger.info(`AppInsights UserId:${appInsights.context.user.id}, sessionId ${appInsights.context.sessionManager.automaticSession.id}`)

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
