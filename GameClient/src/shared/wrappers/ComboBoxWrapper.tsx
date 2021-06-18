import { ComboBox, IComboBox, IComboBoxOption } from '@fluentui/react/lib/index'
import { Text } from '@fluentui/react/lib/Text'
import * as React from 'react'

import { VerticalStack } from '../../components/Stacks/VerticalStack'
import { EnumClass, lookupEnumString } from '../DataTypes'
import { Log } from '../logging/Log'

type State = {
}

type Props = {
  handleChangeInput?: (input: string) => void
  value: string
  maxLength: number
  label: string | undefined
  options: EnumClass<string>
}

export class ComboBoxWrapper extends React.Component<Props, State> {
  onChange = (_event: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined, _index?: number | undefined, value?: string | undefined) => {
    if (!this.props.handleChangeInput) {
      return
    }

    // An option is chosen
    if (option) {
      this.props.handleChangeInput(option.key.toString())
      return
    }

    // An option is entered
    if (value !== undefined) {
      this.props.handleChangeInput(value)
      return
    }
  }

  constructor(props: Props) {
    super(props)
  }

  componentDidUpdate(newProps: Props) {
    if (newProps.value === undefined || newProps.value === null) {
      Log.logger.warn(`En el campo ${newProps.label} se mando un valor nulo (nunca debe ser nulo)`)
      return
    }

    if (newProps.maxLength >= 0 && newProps.value.length > newProps.maxLength) {
      Log.logger.warn(`En el campo ${newProps.label}, el limite es ${newProps.maxLength} pero el campo mide ${newProps.value.length}`)
    }
  }

  getOptions = (): IComboBoxOption[] => {
    const options: IComboBoxOption[] = []
    for (const optionKey of Object.keys(this.props.options)) {
      const option = this.props.options[optionKey]
      options.push({
        key: option.databaseValue,
        text: option.niceDisplayString ?? option.databaseValue,
        data: option.databaseValue,
      })
    }

    return options
  }

  renderDisplayNombre = () => {
    let displayValue = lookupEnumString(this.props.options, this.props.value)
    if (displayValue === undefined) {
      displayValue = this.props.value
    }
    return (
      <div style={ { backgroundColor: 'rgb(70, 130, 180)', color: 'white', paddingLeft: '3px', fontStyle: 'italic' } }>
        <Text variant='medium'>{ displayValue }</Text>
      </div>
    )
  }

  render() {

    return (
      <VerticalStack>
        <ComboBox
          label={ this.props.label }
          allowFreeform={ true }
          text={ this.props.value }
          // autoComplete='on' Disabled, weird behavior
          options={ this.getOptions() }
          onChange={ this.onChange } />
          { this.renderDisplayNombre() }
      </VerticalStack>

    )
  }
}
