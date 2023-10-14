import { IStackTokens, Stack, TextField } from '@fluentui/react'
import * as React from 'react'
import {ExifParserFactory} from 'ts-exif-parser';

import { getErrorAsString } from '../../shared/logging/getErrorAsString'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const AnalyzeImage: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined);
  const [parseResult, setParseResult] = React.useState<string>('')

  React.useEffect(() => {
    getEncodingResult();
  }, [selectedFile])

  const getEncodingResult = async () => {
    if (!selectedFile) {
      return '';
    }

    try {
      const data = await selectedFile.arrayBuffer();
      const parser = ExifParserFactory.create(data);
      parser.flags.readBinaryTags = true;
      parser.flags.resolveTagNames = true;
      parser.flags.returnTags = true;

      const output = parser.parse();
      console.log(output);
      const set = JSON.stringify(output, undefined, '\t');
      setParseResult(set);
    } catch (error: unknown) {
      const set = getErrorAsString(error)
      setParseResult(set);
    }

    return;
  }

  return (
    <Stack tokens={ childrenTokens } >
        <input
          type="file"
          onChange={(e) => {
            const file = e.target?.files![0];
            setSelectedFile(file);
          }}
        />
      <TextField
        label='Parsed image metadata'
        readOnly={ true }
        value={ parseResult }
        multiline={ true }
        rows={ 40 } />
    </Stack>
  )
}
