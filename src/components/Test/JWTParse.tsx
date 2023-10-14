import { IStackTokens, Stack, TextField } from '@fluentui/react'
import jwt_decode from 'jwt-decode'
import * as React from 'react'

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const JWTParse: React.FC = () => {
  const [encodeInput, setEncodeInput] = React.useState('')

  const getDecodedJWT = () => {
    try {
      return JSON.stringify(jwt_decode(encodeInput), undefined, '\t')
    } catch (error: unknown) {
      return getErrorAsString(error)
    }
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
        value={ getDecodedJWT() }
        multiline={ true }
        rows={ 40 } />
    </Stack>
  )
}
