import { Spinner, Text } from '@fluentui/react'
import * as React from 'react'

import { IAppSettings, settingsDatabase } from '../../shared/settings/SettingsDatabase'
import { Theme,ThemeUtils } from '../../shared/theme/ThemeUtils'
import { SelectInputWrapper } from '../../shared/wrappers/SelectInputWrapper'
import { VerticalStack } from '../Stacks/VerticalStack'

interface IProps {
}
interface IState {
  appSettings?: IAppSettings
}

export class Settings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      appSettings: undefined,
    }
  }

  async componentDidMount(): Promise<void> {
    const row = await settingsDatabase.appSettings.get(0)
    if (!row) {
      throw new Error('Failed to get row')
    }
    this.setState({
      appSettings: row,
    })
  }

  onChangeTheme = (theme: Theme) => {
    if (!this.state.appSettings) {
      return
    }

    ThemeUtils.loadTheme(theme)

    const newAppSettings: IAppSettings = {
      ...this.state.appSettings,
      theme,
    }

    this.setState({
      appSettings: newAppSettings,
    }, async () => {
      await settingsDatabase.appSettings.put(newAppSettings)
    })
  }

  render() {
    if (!this.state.appSettings) {
      return <Spinner />
    }

    return (
      <VerticalStack padding={ 10 }>
        <Text></Text>
        <VerticalStack maxWidth={ 200 }>
          <SelectInputWrapper<Theme>
            label='Interfaz'
            optionsEnum={ Theme }
            value={ this.state.appSettings.theme }
            onChange={ this.onChangeTheme } />
        </VerticalStack>
      </VerticalStack>
    )
  }
}
