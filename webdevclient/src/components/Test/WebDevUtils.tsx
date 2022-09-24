import { IStackTokens, Pivot, PivotItem, Stack } from '@fluentui/react'
import * as React from 'react'

import { CharWordCount } from './CharWordCount'
import { ClipboardUtils } from './ClipboardUtils'
import { DiffTool } from './DiffTool'
import { EncodeDecodeUI } from './EncodeDecodeUI'
import { decodeHtml, encodeHTMLEntities } from './htmlEncodeDecode'
import { JWTParse } from './JWTParse'
import { PrettyJsonXml } from './PrettyJsonXml'
import { QueryParamParse } from './QueryParamParse'

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
}

export const WebDevUtils: React.FC = () => {
  return (
    <Stack tokens={ childrenTokens } >
      <Pivot>
        <PivotItem headerText='Base64'>
          <EncodeDecodeUI
            encodeFunc={ (val) => btoa(val) }
            decodeFunc={ (val) => atob(val) } />
        </PivotItem>
        <PivotItem headerText='URL'>
          <EncodeDecodeUI
            encodeFunc={ (val) => encodeURIComponent(val) }
            decodeFunc={ (val) => decodeURIComponent(val) } />
        </PivotItem>
        <PivotItem headerText='HTML'>
          <EncodeDecodeUI
            encodeFunc={ (val) => encodeHTMLEntities(val) }
            decodeFunc={ (val) => decodeHtml(val) } />
        </PivotItem>
        <PivotItem headerText='Query param parse'>
          <QueryParamParse />
        </PivotItem>
        <PivotItem headerText='JWT parse'>
          <JWTParse />
        </PivotItem>
        <PivotItem headerText='Clipboard utils'>
          <ClipboardUtils />
        </PivotItem>
        <PivotItem headerText='Char/word count'>
          <CharWordCount />
        </PivotItem>
        <PivotItem headerText='Pretty JSON/XML'>
          <PrettyJsonXml />
        </PivotItem>
        <PivotItem headerText='Diff tool'>
          <DiffTool />
        </PivotItem>
      </Pivot>
    </Stack>
  )
}
