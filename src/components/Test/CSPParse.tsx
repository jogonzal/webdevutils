import { IStackTokens, Stack, TextField } from "@fluentui/react";
import parseCSP from "content-security-policy-parser";
import * as React from "react";

import { getErrorAsString } from "../../shared/logging/getErrorAsString";

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
};

export const CSPParse: React.FC = () => {
  const [encodeInput, setEncodeInput] = React.useState(
    "base-uri 'none'; connect-src 'self' https://api.stripe.com https://files.stripe.com https://errors.stripe.com https://r.stripe.com; default-src 'none'; form-action 'none'; img-src 'self' https://q.stripe.com https://t.stripe.com; script-src 'self'; style-src 'self'; report-uri https://q.stripe.com/csp-report",
  );

  const getEncodingResult = () => {
    try {
      const output = parseCSP(encodeInput);
      return JSON.stringify(output, undefined, "\t");
    } catch (error: unknown) {
      return getErrorAsString(error);
    }
  };

  const onInputTextChanged = (
    _ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
    val?: string,
  ) => {
    setEncodeInput(val ?? "");
  };

  return (
    <Stack tokens={childrenTokens}>
      <TextField
        label="CSP input"
        onChange={onInputTextChanged}
        value={encodeInput}
        multiline={true}
        rows={10}
        autoFocus={true}
      />
      <TextField
        label="Parsed CSP"
        readOnly={true}
        value={getEncodingResult()}
        multiline={true}
        rows={40}
      />
    </Stack>
  );
};
