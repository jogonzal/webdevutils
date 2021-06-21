import { IStackTokens, Pivot, PivotItem, Stack } from '@fluentui/react'
import * as React from 'react'
import { ClipboardUtils } from './ClipboardUtils'

import { EncodeDecodeUI } from './EncodeDecodeUI'
import { JWTParse } from './JWTParse'
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
        <PivotItem headerText='URL encode/decode'>
          <EncodeDecodeUI
            encodeFunc={ (val) => encodeURIComponent(val) }
            decodeFunc={ (val) => decodeURIComponent(val) } />
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
      </Pivot>
    </Stack>
  )
}
