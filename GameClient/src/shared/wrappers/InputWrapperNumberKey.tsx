import * as React from 'react'

import { InputWrapper } from './InputWrapper'
import { InputWrapperNumber } from './InputWrapperNumber'

type Props = {
  value: number
  onChange: (input: number) => void
  isCreatingNew: boolean
}

export class InputWrapperNumberKey extends React.Component<Props> {
  render() {
    if (this.props.isCreatingNew) {
      return (
        <InputWrapper
          value='Nueva'
          readOnly={ true }
          bold={ true }
          maxLength={ -1 }
          label='Clave'
          onChange={ () => {} }/>
      )
    }

    return (
      <InputWrapperNumber
        onChange={ this.props.onChange }
        value={ this.props.value }
        decimalRange={ 0 }
        label='Clave'
        bold={ true }
        readOnly={ true } />
    )
  }
}
