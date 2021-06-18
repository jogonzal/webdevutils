import { IStackTokens, Separator, Stack, TextField } from '@fluentui/react'
import * as React from 'react'

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const QueryParamParse: React.FC = () => {
  const [encodeInput, setEncodeInput] = React.useState('')

  const onInputTextChanged = (_ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, val?: string) => {
    setEncodeInput(val ?? '')
  }

  const renderQueryParams = () => {
    try {
      const url = new URL(encodeInput)
      const queryParamCollection = new URLSearchParams(url.search)
      const renderedArr: JSX.Element[] = []
      queryParamCollection.forEach((queryParamValue, queryParamKey) => {
        renderedArr.push((
          <TextField
            label={ queryParamKey }
            readOnly={ true }
            value={ queryParamValue ?? '' }
          />
        ))
      })

      return renderedArr
    } catch (error: unknown) {
      return (
        <TextField
          readOnly={ true }
          value={ `There was an error ${getErrorAsString(error)}` }
        />
      )
    }
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
      <Separator>Query params</Separator>
      { renderQueryParams() }
    </Stack>
  )
}
