import { getTheme, ITheme, registerOnThemeChangeCallback, removeOnThemeChangeCallback } from '@fluentui/react'
import * as React from 'react'
import { Chart } from 'react-google-charts'
import { ChartWrapperOptions,GoogleDataTableColumn, GoogleDataTableRow } from 'react-google-charts/dist/types'

type Props = {
  rows: GoogleDataTableRow[]
  columns: GoogleDataTableColumn[]
  title: string
  disableTheme?: boolean
}

type State = {
  theme: ITheme
}

export class LineChart extends React.Component<Props, State> {
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

  getOptions(): ChartWrapperOptions['options'] {
    if (this.props.disableTheme) {
      return {
        title: this.props.title,
        vAxis: {
          baseline: 0,
        },
        titleTextStyle: {
          fontSize: 20,
        },
      }
    }

    return {
      title: this.props.title,
      backgroundColor: this.state.theme.semanticColors.bodyBackground,
      colors: [ this.state.theme.semanticColors.bodyText ],
      fontColor: this.state.theme.semanticColors.bodyText,
      hAxis: {
        textStyle: {
          color: this.state.theme.semanticColors.bodyText,
        }
      },
      vAxis: {
        textStyle: {
          color: this.state.theme.semanticColors.bodyText,
        },
        baseline: 0,
      },
      titleTextStyle: {
        color: this.state.theme.semanticColors.bodyText,
        fontSize: 20,
      },
      legendTextStyle: {
        color: this.state.theme.semanticColors.bodyText,
      }
    }
  }

  render() {
    return (
      <Chart
        height={ 300 }
        width='100%'
        chartType='AreaChart'
        legendToggle
        rows={ this.props.rows }
        columns={ this.props.columns }
        options={ this.getOptions() }
      />
    )
  }
}
