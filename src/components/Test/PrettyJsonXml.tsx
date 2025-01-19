import type { IStackTokens } from "@fluentui/react";
import { Stack, TextField } from "@fluentui/react";
import { j2xParser, parse } from "fast-xml-parser";
import * as React from "react";

import { getErrorAsString } from "../../shared/logging/getErrorAsString";

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
};

export const PrettyJsonXml: React.FC = () => {
  const [input, setInput] = React.useState("");

  const getCountResults = () => {
    try {
      const json = JSON.parse(input);
      return JSON.stringify(json, undefined, "\t");
    } catch (error: unknown) {
      try {
        const newJson = parse(input, {
          ignoreAttributes: false,
          ignoreNameSpace: false,
        });
        const parser = new j2xParser({
          format: true,
          ignoreAttributes: false,
        });
        const xml = parser.parse(newJson);
        if (!xml) {
          throw new Error("parsing error");
        }
        return xml;
      } catch (error2: unknown) {
        return getErrorAsString(error);
      }
    }
  };

  const onInputTextChanged = (
    _ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
    val?: string,
  ) => {
    setInput(val ?? "");
  };

  return (
    <Stack tokens={childrenTokens}>
      <TextField
        label="Input"
        onChange={onInputTextChanged}
        value={input}
        multiline={true}
        rows={10}
        autoFocus={true}
      />
      <TextField
        label="Output"
        readOnly={true}
        value={getCountResults()}
        multiline={true}
        rows={40}
      />
    </Stack>
  );
};
