import { IStackTokens, Stack, TextField, Toggle } from '@fluentui/react'
import * as React from 'react'

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

type Props = {
  encodeFunc: (input: string) => string
  decodeFunc: (input: string) => string
}

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const EncodeDecodeUI: React.FC<Props> = (props: Props) => {
  const [encodeInput, setEncodeInput] = React.useState('')
  const [encodeToggle, setEncodeToggle] = React.useState(false)

  const getEncodingResult = () => {
    try {
      if (encodeToggle) {
        return props.decodeFunc(encodeInput)
      } else {
        return props.encodeFunc(encodeInput)
      }
    } catch (error: unknown) {
      return getErrorAsString(error)
    }
  }

  const onEncodeOrDecodeToggle = (_ev?: React.MouseEvent<HTMLElement, MouseEvent>, val?: boolean) => {
    setEncodeToggle(val ?? false)
  }

  const onInputTextChanged = (_ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, val?: string) => {
    setEncodeInput(val ?? '')
  }

  return (
    <Stack tokens={ childrenTokens } >
      <TextField
        label='Input'
        onChange={ onInputTextChanged }
        value={ encodeInput }
        multiline={ true }
        rows={ 10 }
        autoFocus={ true } />
      <TextField
        label='Output'
        readOnly={ true }
        value={ getEncodingResult() }
        multiline={ true }
        rows={ 20 } />
      <Toggle onChange={ onEncodeOrDecodeToggle } label={ encodeToggle ? 'Decode' : 'Encode' } />
    </Stack>
  )
}
