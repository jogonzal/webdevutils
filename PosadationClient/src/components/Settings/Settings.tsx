import * as React from 'react'
import { Spinner, Text } from 'office-ui-fabric-react'
import { SelectInputWrapper } from '../../shared/wrappers/SelectInputWrapper'
import { IAppSettings, settingsDatabase } from '../../shared/settings/SettingsDatabase'
import { VerticalStack } from '../Stacks/VerticalStack'
import { ThemeUtils, Theme } from '../../shared/theme/ThemeUtils'

type Props = {}
type State = {
  appSettings?: IAppSettings
}

export class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
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
