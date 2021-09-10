import { IStackTokens, Stack, TextField } from '@fluentui/react'
import * as React from 'react'

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const PrettyJsonXml: React.FC = () => {
  const [input, setInput] = React.useState('')

  const getCountResults = () => {
    try {
      const json = JSON.parse(input)
      return JSON.stringify(json, undefined, '\t')
    } catch (error: unknown) {
      // TODO: XML!
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
        rows={ 30 } />
    </Stack>
  )
}
