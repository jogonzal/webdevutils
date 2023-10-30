import { IStackTokens, Stack, TextField } from "@fluentui/react";
import * as React from "react";

const childrenTokens: IStackTokens = {
  childrenGap: 10,
  padding: 5,
};

export const checkIsFontSupported = (fontFamily: string) => {
  try {
    // This is a basic "I am able to render" check
    const supported = document.fonts.check(`12px ${fontFamily}`);

    if (supported) {
      return {
        font: fontFamily,
        message: "true" as const,
      };
    } else {
      return {
        font: fontFamily,
        message: "false" as const,
      };
    }
  } catch (error: any) {
    return {
      font: fontFamily,
      message: "false - " + error?.message,
    };
  }
};

export const cleanFontFamily = (fontFamily: string) => {
  return fontFamily
    .trim() // Remove spaces
    .replace("'", ""); // Take out the '
};

export const CheckFontSupport: React.FC = () => {
  const [input, setInput] = React.useState("");

  const getFontResults = () => {
    if (input === "") return "";

    const fontFamilies = input.split("\n");
    console.log("Evaluating fonts", fontFamilies);

    const output = fontFamilies.map((fontFamily) => {
      const listOfFontFamilies = fontFamily.split(","); // Use the first font family in the list
      const mostPreferredFontFamily = cleanFontFamily(listOfFontFamilies[0]);

      const isMostPreferredSupported = checkIsFontSupported(
        mostPreferredFontFamily
      );
      if (isMostPreferredSupported.message === "true") {
        return isMostPreferredSupported;
      }

      // If the most preferred font is not supported, try the fallback fonts
      for (const fallbackFontFamily of listOfFontFamilies.slice(1)) {
        const fallbackFont = cleanFontFamily(fallbackFontFamily);
        const isFallbackSupported = checkIsFontSupported(fallbackFont);
        if (isFallbackSupported.message === "true") {
          isFallbackSupported.message = `true - fallback font (${fallbackFont})`;
          return isFallbackSupported;
        }
      }

      return {
        font: mostPreferredFontFamily,
        message: "false",
      };
    });

    return output.map((o) => o.message).join("\n");
  };

  const onInputTextChanged = (
    _ev?: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
    val?: string
  ) => {
    setInput(val ?? "");
  };

  return (
    <Stack tokens={childrenTokens}>
      <TextField
        label="Enter font families separated by newline"
        onChange={onInputTextChanged}
        value={input}
        multiline={true}
        rows={50}
        autoFocus={true}
      />
      <TextField
        label="Output"
        readOnly={true}
        value={getFontResults()}
        multiline={true}
        rows={50}
      />
    </Stack>
  );
};
