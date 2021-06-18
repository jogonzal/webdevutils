import { Alignment, IStackTokens, Stack } from '@fluentui/react/lib/Stack'
import * as React from 'react'

type Props = {
  grow?: boolean
  verticalAllign?: Alignment
  maxWidth?: number
  maxHeight?: number
  verticalFill?: boolean
  height?: number
  padding?: number
}

export class VerticalStack extends React.Component<Props> {
  getTokens(): IStackTokens {
    return {
      childrenGap: 4,
      maxWidth: this.props.maxWidth,
      maxHeight: this.props.maxHeight,
      padding: this.props.padding,
    }
  }

  render() {
    return (
      <Stack
        styles={ { root: { height: this.props.height } } }
        verticalFill={ this.props.verticalFill }
        tokens={ this.getTokens() }
        verticalAlign={ this.props.verticalAllign }
        horizontal={ false }
        grow={ this.props.grow === undefined ? true : this.props.grow }
        style={ { marginBottom:'0' } } >
       { this.props.children }
      </Stack>
    )
  }
}
