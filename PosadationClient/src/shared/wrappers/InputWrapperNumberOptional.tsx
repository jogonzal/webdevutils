import * as React from 'react'

import { NumberUtils } from '../utils/NumberUtils'
import { InputWrapper } from './InputWrapper'

type State = {
  currentText: string
}

type Props = {
  label: string | undefined
  value: number | undefined
  onChange?: (input: number | undefined) => void
  decimalRange: number
  readOnly?: boolean
  bold?: boolean
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void
  suffix?: string
  minDecimals?: number
  maxValue?: number
}

export class InputWrapperNumberOptional extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentText: '',
    }
  }

  componentDidMount(): void {
    let str = ''
    if (this.props.value !== undefined && this.props.value !== null) {
      str = NumberUtils.printNumberAsString(this.props.value, this.props.minDecimals)
    }
    this.setState({
      currentText: str,
    })
  }

  componentDidUpdate(prevProps: Props) {
    // Handle NaN gracefully
    const currentTextAsNumber = NumberUtils.getStringAsNumber(this.state.currentText)
    let currentNumber = this.props.value
    if (currentNumber !== undefined && currentNumber !== null) {
      currentNumber = NumberUtils.getStringAsNumber(NumberUtils.printNumberAsString(currentNumber, undefined))
    }
    if (prevProps.value !== this.props.value && currentTextAsNumber !== currentNumber) { // Only write a value if it has changed and is different from current text
      this.updateCurrentPropInTextState()
    }
  }

  handleChangeInput = (num: string) => {
    const numVal = NumberUtils.getStringAsNumber(num)

    if (numVal === undefined || numVal === null) {
      this.setState({
        currentText: '', // Set state to empty
      })
      if (this.props.onChange) {
        this.props.onChange(undefined) // Empty means undefined value
      }
      return
    }

    if (numVal >= 0) {
      // Check for decimal range
      if ((num.split('.')[1] || []).length > this.props.decimalRange) {
        return
      }
      // Check for max if enabled
      if (this.props.maxValue !== undefined) {
        if (numVal > this.props.maxValue) {
          return
        }
      }

      // Accept value
      this.setState({
        currentText: num,
      }, () => {
        if (this.props.onChange) {
          this.props.onChange(numVal)
        }
      })
    }
  }

  private updateCurrentPropInTextState() {
    let str = ''
    if (this.props.value !== undefined && this.props.value !== null) {
      str = NumberUtils.printNumberAsString(this.props.value, this.props.minDecimals)
    }
    this.setState({
      currentText: str,
    })
  }

  render() {
    return (
      <InputWrapper
        onChange={ this.handleChangeInput }
        value={ this.state.currentText }
        maxLength={ 12 }
        label={ this.props.label }
        readOnly={ this.props.readOnly }
        bold={ this.props.bold }
        onKeyDown={ this.props.onKeyDown }
        suffix={ this.props.suffix } />
    )
  }
}
