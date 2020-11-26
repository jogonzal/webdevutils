import { getTheme, ITheme, registerOnThemeChangeCallback, removeOnThemeChangeCallback } from '@fluentui/react'
import * as React from 'react'
import { Chart } from 'react-google-charts'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  title: string
}
type State = {
  theme: ITheme
}

export class DonutChart extends React.Component<Props, State> {
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
    return (
      <Chart
        height={ 300 }
        width='100%'
        chartType='PieChart'
        legendToggle
        data={ this.props.data }
        options={
          {
            title: this.props.title,
            // backgroundColor: this.state.theme.semanticColors.bodyBackground,
            // colors: [ this.state.theme.semanticColors.bodyText ],
            // fontColor: this.state.theme.semanticColors.bodyText,
            // hAxis: {
            //   textStyle: {
            //     color: this.state.theme.semanticColors.bodyText,
            //   }
            // },
            // vAxis: {
            //   textStyle: {
            //     color: this.state.theme.semanticColors.bodyText,
            //   }
            // },
            // titleTextStyle: {
            //   color: this.state.theme.semanticColors.bodyText,
            //   fontSize: 20,
            // },
            // legendTextStyle: {
            //   color: this.state.theme.semanticColors.bodyText,
            // },
            pieHole: 0.4,
          }
        }
      />
    )
  }
}
