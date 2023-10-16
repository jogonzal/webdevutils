import { IStackTokens, Pivot, PivotItem, Stack } from "@fluentui/react";
import * as React from "react";

import { AnalyzeImage } from "./AnalyzeImage";
import { CharWordCount } from "./CharWordCount";
import { ClipboardUtils } from "./ClipboardUtils";
import { CSPParse } from "./CSPParse";
import { DiffTool } from "./DiffTool";
import { EncodeDecodeUI } from "./EncodeDecodeUI";
import { decodeHtml, encodeHTMLEntities } from "./htmlEncodeDecode";
import { JWTParse } from "./JWTParse";
import { PrettyJsonXml } from "./PrettyJsonXml";
import { QueryParamParse } from "./QueryParamParse";
import { useRouter } from "next/router";

// General setup
import "../../generalsetup";

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
};

export const WebDevUtils: React.FC = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  let currentTab = slug ?? "base64";

  return (
    <Stack tokens={childrenTokens}>
      <Pivot
        onLinkClick={(item) => {
          if (!item) {
            return;
          }

          router.push(`/webdevutils/${item.props.itemKey}`);
        }}
        selectedKey={currentTab}
      >
        <PivotItem headerText="Base64" itemKey="base64">
          <EncodeDecodeUI
            encodeFunc={(val) => btoa(val)}
            decodeFunc={(val) => atob(val)}
          />
        </PivotItem>
        <PivotItem headerText="URL" itemKey="url">
          <EncodeDecodeUI
            encodeFunc={(val) => encodeURIComponent(val)}
            decodeFunc={(val) => decodeURIComponent(val)}
          />
        </PivotItem>
        <PivotItem headerText="HTML" itemKey="html">
          <EncodeDecodeUI
            encodeFunc={(val) => encodeHTMLEntities(val)}
            decodeFunc={(val) => decodeHtml(val)}
          />
        </PivotItem>
        <PivotItem headerText="Query param parse" itemKey="queryparam">
          <QueryParamParse />
        </PivotItem>
        <PivotItem headerText="JWT parse" itemKey="jwt">
          <JWTParse />
        </PivotItem>
        <PivotItem headerText="Clipboard utils" itemKey="clipboard">
          <ClipboardUtils />
        </PivotItem>
        <PivotItem headerText="Char/word count" itemKey="charcount">
          <CharWordCount />
        </PivotItem>
        <PivotItem headerText="Pretty JSON/XML" itemKey="prettyjson">
          <PrettyJsonXml />
        </PivotItem>
        <PivotItem headerText="Diff tool" itemKey="difftool">
          <DiffTool />
        </PivotItem>
        <PivotItem headerText="CSP parse" itemKey="csp">
          <CSPParse />
        </PivotItem>
        <PivotItem headerText="Analyze image" itemKey="analyzeimage">
          <AnalyzeImage />
        </PivotItem>
      </Pivot>
    </Stack>
  );
};
