import {
  getTheme,
  ITheme,
  mergeStyles,
  registerOnThemeChangeCallback,
  removeOnThemeChangeCallback,
} from "@fluentui/react";
import { StackItem } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import * as React from "react";

type Props = {
  label: string;
  grow?: boolean;
  children?: React.ReactNode;
};

type State = {
  theme: ITheme;
};

export class BoxLabel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: getTheme(),
    };
  }

  onThemeupdated = (theme: ITheme) => {
    this.setState({ theme });
  };

  componentDidMount(): void {
    registerOnThemeChangeCallback(this.onThemeupdated);
  }

  componentWillUnmount(): void {
    removeOnThemeChangeCallback(this.onThemeupdated);
  }

  render() {
    const style = mergeStyles({
      marginTop: "0px",
      marginBottom: "0px",
    });
    const theme = getTheme();
    return (
      <StackItem grow={this.props.grow} styles={{ root: style }}>
        <div
          style={{
            padding: "8px",
            border: "1px solid rgb(138, 136, 134)",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <Text
            style={{
              marginTop: "-21px",
              marginBottom: "0px",
              display: "table",
              backgroundColor: theme.semanticColors.bodyBackground,
              fontWeight: "600" as any,
            }}
          >
            {this.props.label}
          </Text>
          {this.props.children}
        </div>
      </StackItem>
    );
  }
}
