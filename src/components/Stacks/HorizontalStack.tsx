import { Alignment, IStackTokens, Stack } from "@fluentui/react/lib/Stack";
import * as React from "react";

type Props = {
  grow?: boolean;
  allign?: Alignment;
  wrap?: boolean;
  maxWidth?: number;
  padding?: number;
  children?: React.ReactNode;
};

export class HorizontalStack extends React.Component<Props> {
  getTokens(): IStackTokens {
    return {
      childrenGap: 30,
      maxWidth: this.props.maxWidth,
      padding: this.props.padding,
    };
  }

  render() {
    return (
      <Stack
        horizontalAlign={this.props.allign}
        tokens={this.getTokens()}
        horizontal={true}
        wrap={this.props.wrap === undefined ? true : this.props.wrap}
        grow={this.props.grow === undefined ? true : this.props.grow}
        style={{ marginBottom: "12px" }}
      >
        {this.props.children}
      </Stack>
    );
  }
}
