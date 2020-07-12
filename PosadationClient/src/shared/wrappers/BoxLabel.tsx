import { mergeStyles } from '@uifabric/styling'
import { StackItem } from 'office-ui-fabric-react/lib/Stack'
import { Text } from 'office-ui-fabric-react/lib/Text'
import * as React from 'react'
import { getTheme, ITheme, registerOnThemeChangeCallback, removeOnThemeChangeCallback } from 'office-ui-fabric-react'

type Props = {
  label: string
  grow?: boolean
}

type State = {
  theme: ITheme
}

export class BoxLabel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      theme: getTheme(),
    }
  }

  onThemeupdated = (theme: ITheme) => {
    this.setState({ theme })
  }

  componentDidMount(): void {
    registerOnThemeChangeCallback(this.onThemeupdated)
  }

  componentWillUnmount(): void {
    removeOnThemeChangeCallback(this.onThemeupdated)
  }

  render() {
    const style = mergeStyles({
      marginTop: '0px',
      marginBottom: '0px',
    })
    const theme = getTheme()
    return (
      <StackItem grow={ this.props.grow } styles={ { root: style } } >
        <div style={ { padding: '8px', border: '1px solid rgb(138, 136, 134)', marginTop: '15px', marginBottom: '15px' } }>
          { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
          <Text style={ { marginTop: '-21px', marginBottom: '0px', display: 'table', backgroundColor: theme.semanticColors.bodyBackground, fontWeight:'600' as any } }>{ this.props.label }</Text>
          { this.props.children }
        </div>
      </StackItem>
    )
  }
}
