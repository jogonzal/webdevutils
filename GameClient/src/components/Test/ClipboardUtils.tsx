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
    let formats = clipboardEvent.clipboardData.types;
    clipboardEvent.preventDefault();

    const newMetadata: IClipboardMetadata = {
      html: '',
      text: '',
      files: []
    }

    if (formats.indexOf(ClipboardOption.html) !== -1) {
      newMetadata.html = clipboardEvent.clipboardData.getData(ClipboardOption.html);
      newMetadata.text = clipboardEvent.clipboardData.getData(ClipboardOption.plainText);
    } else if (formats.indexOf(ClipboardOption.plainText) !== -1) {
      newMetadata.text = clipboardEvent.clipboardData.getData(ClipboardOption.plainText)
    } else if (formats.indexOf(ClipboardOption.files) !== -1) {
      let files: File[] = [];
      for (let i = 0; i < clipboardEvent.clipboardData.files.length; i += 1) {
        files.push(clipboardEvent.clipboardData.files[i]);
      }
      newMetadata.files = files
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
        rows={ 20 } />
      <PrimaryButton onClick={ onReset }>Reset</PrimaryButton>
    </Stack>
  )
}
