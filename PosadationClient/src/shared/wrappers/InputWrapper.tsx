import { IRefObject } from '@fluentui/react'
import { ITextField, TextField } from '@fluentui/react/lib/TextField'
import * as React from 'react'

import { Log } from '../logging/Log'

type State = {
}

type Props = {
  onChange?: (input: string) => void
  value: string
  maxLength: number
  label: string | undefined
  rows?: number
  readOnly?: boolean
  bold?: boolean
  onKeyDown?: (keyEvent: React.KeyboardEvent) => void
  suffix?: string
  componentRef?: IRefObject<ITextField>
}

export class InputWrapper extends React.Component<Props, State> {
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

  private onTextChanged = (_formEvent: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string | undefined) => {
    if (newValue === null || newValue === undefined) {
      return
    }
    if (this.props.onChange) {
      this.props.onChange(newValue)
    }
  }

  getTextFieldStyle(): React.CSSProperties | undefined {
    if (!this.props.bold) {
      return
    }

    // Bold if is clave
    return {
      fontWeight: 'bold',
    }
  }

  render() {
    return (
      <TextField
        componentRef={ this.props.componentRef }
        label={ this.props.label }
        onChange={ this.onTextChanged }
        value={ this.props.value }
        autoComplete='off'
        maxLength={ this.props.maxLength === -1 ? undefined : this.props.maxLength }
        type='text'
        disabled={ this.props.readOnly }
        style={ this.getTextFieldStyle() }
        rows={ this.props.rows }
        multiline={ (!!this.props.rows && this.props.rows > 1) }
        onKeyDown={ this.props.onKeyDown }
        suffix={ this.props.suffix } />
    )
  }
}
