import { IStackTokens, PrimaryButton, Stack, TextField } from '@fluentui/react'
import * as React from 'react'

type Props = {
}

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

enum ClipboardOption {
  plainText = 'text/plain',
  html = 'text/html',
  files = 'Files',
  internalDragDrop = 'internalDragDrop'
}

interface IClipboardMetadata {
  html: string
  text: string
  files: File[]
}

export const ClipboardUtils: React.FC<Props> = () => {
  const [clipboardMetadata, setClipboardMetadata] = React.useState<IClipboardMetadata | undefined>(undefined)

  const onPaste = (clipboardEvent: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedContentTypes = clipboardEvent.clipboardData.types;
    clipboardEvent.preventDefault(); // Don't paste normally

    const newMetadata: IClipboardMetadata = {
      html: '',
      text: '',
      files: []
    }

    // This could be used for files...
    // if (pastedContentTypes.includes(ClipboardOption.files)) {
    //   newMetadata.files = [...clipboardEvent.clipboardData.files]
    // }

    if (pastedContentTypes.includes(ClipboardOption.html)) {
      newMetadata.html = clipboardEvent.clipboardData.getData(ClipboardOption.html);
      newMetadata.text = clipboardEvent.clipboardData.getData(ClipboardOption.plainText);
    } else if (pastedContentTypes.includes(ClipboardOption.plainText)) {
      newMetadata.text = clipboardEvent.clipboardData.getData(ClipboardOption.plainText)
    }

    setClipboardMetadata(newMetadata)
  }

  const onReset = () => {
    setClipboardMetadata(undefined)
  }

  return (
    <Stack tokens={ childrenTokens } >
      <input type='text' onPaste={ onPaste } placeholder='Paste here' />
      <TextField
        label='Text'
        readOnly={ true }
        value={ clipboardMetadata?.text }
        multiline={ true }
        rows={ 10 } />
      <TextField
        label='Html'
        readOnly={ true }
        value={ clipboardMetadata?.html }
        multiline={ true }
        rows={ 40 } />
      <PrimaryButton onClick={ onReset }>Reset</PrimaryButton>
    </Stack>
  )
}
