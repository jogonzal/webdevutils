import * as React from 'react'
import { InputWrapperNumberOptional } from './InputWrapperNumberOptional'

type Props = {
  label: string | undefined
  value: number
  onChange?: (input: number) => void
  decimalRange: number
  readOnly?: boolean
  bold?: boolean
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void
  suffix?: string
  minDecimals?: number
  maxValue?: number
}

export class InputWrapperNumber extends React.Component<Props> {
  validateNumber = (num: number | undefined) => {
    if (num === undefined) {
      return // Simply ignore
    }
    if (this.props.onChange) {
      this.props.onChange(num)
    }
  }
  render() {
    return (
      <InputWrapperNumberOptional
        onChange={ this.validateNumber }
        value={ this.props.value }
        decimalRange={ this.props.decimalRange }
        label={ this.props.label }
        readOnly={ this.props.readOnly }
        bold={ this.props.bold }
        onKeyDown={ this.props.onKeyDown }
        suffix={ this.props.suffix }
        minDecimals={ this.props.minDecimals }
        maxValue={ this.props.maxValue } />
    )
  }
}
