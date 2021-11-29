import { IStackTokens, Stack, TextField } from '@fluentui/react'
import * as React from 'react'
import { default as DiffViewer } from 'react-diff-viewer'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const DiffTool: React.FC = () => {
  const [input1, setInput1] = React.useState('')
  const [input2, setInput2] = React.useState('')

  const onInput1TextChanged = (_ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, val?: string) => {
    setInput1(val ?? '')
  }

  const onInput2TextChanged = (_ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>, val?: string) => {
    setInput2(val ?? '')
  }

  return (
    <Stack tokens={ childrenTokens } >
      <TextField
        label='Input 1'
        onChange={ onInput1TextChanged }
        value={ input1 }
        multiline={ true }
        rows={ 10 }
        autoFocus={ true } />
      <TextField
        label='Input 2'
        onChange={ onInput2TextChanged }
        value={ input2 }
        multiline={ true }
        rows={ 10 }
        autoFocus={ true } />
      <DiffViewer
        oldValue={ input1 }
        newValue={ input2 }
        splitView={ true } />
    </Stack>
  )
}
