import type { ITheme } from "@fluentui/react";
import {
  initializeIcons,
  registerOnThemeChangeCallback,
} from "@fluentui/react";

import { Log } from "./shared/logging/Log";
import {
  initializeSettings as initializeAppSettings,
  settingsDatabase,
} from "./shared/settings/SettingsDatabase";
import { ThemeUtils } from "./shared/theme/ThemeUtils";

let isInitialized = false;
const initialize = async () => {
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  // TODO: move to https://www.npmjs.com/package/@fluentui/react-icons. These are lighter, non-font icons
  // More docs: https://github.com/microsoft/fluentui-system-icons#readme
  initializeIcons();

  registerOnThemeChangeCallback((theme: ITheme) => {
    Log.logger.info("Theme changed!");
    const root = document.getElementsByTagName("html")[0];
    root.style.backgroundColor = theme.semanticColors.bodyBackground;
    root.style.color = theme.semanticColors.bodyText;
  });

  const settings = await initializeAppSettings();
  ThemeUtils.loadTheme(settings.theme);

  // Get latest value of theme
  settingsDatabase.appSettings.get(0).then((theme) => {
    Log.logger.info(`Latest theme is ${theme?.theme}`);
  });
};

initialize();
