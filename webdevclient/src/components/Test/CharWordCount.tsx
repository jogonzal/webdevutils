import { IStackTokens, Stack, TextField } from '@fluentui/react'
import * as React from 'react'

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const CharWordCount: React.FC = () => {
  const [input, setInput] = React.useState('')

  const getCountResults = () => {
    const words = input.split(' ').filter(e => !!e).length
    const chars = input.length;
    const output = {
        words,
        chars,
    }
    try {
      return JSON.stringify(output, undefined, '\t')
    } catch (error: unknown) {
      return getErrorAsString(error)
    }
  }

  const onInputTextChanged = (_ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, val?: string) => {
    setInput(val ?? '')
  }

  return (
    <Stack tokens={ childrenTokens } >
      <TextField
        label='Input'
        onChange={ onInputTextChanged }
        value={ input }
        multiline={ true }
        rows={ 10 }
        autoFocus={ true } />
      <TextField
        label='Output'
        readOnly={ true }
        value={ getCountResults() }
        multiline={ true }
        rows={ 4 } />
    </Stack>
  )
}
