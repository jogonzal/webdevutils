import * as signalR from '@aspnet/signalr'
import { Spinner, Stack, Text, TextField } from '@fluentui/react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import melee from '../assets/sounds/melee/melee.wav'
import smashNo from '../assets/sounds/melee/menu-no.wav'
import toggle from '../assets/sounds/melee/menu-toggle.wav'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'

type State = {
  error?: unknown
  connection: signalR.HubConnection | undefined
  connecting: boolean
}

type RouteParams = {
  gameId: string
  playerId: string
}

type Props = RouteComponentProps<RouteParams>

export class MobileController extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      connecting: false,
      connection: undefined,
    }
  }

  async componentDidMount() {
    await this.makeConnection(this.props.match.params.playerId, this.props.match.params.gameId)
    new Audio(melee).play()
  }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.error(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      error,
    })
  }

  makeConnection = async (userId: string, gameId: string) => {
    try {
      this.setState({
        connecting: true,
      })

      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/game')
        .configureLogging(signalR.LogLevel.Information)
        .build()

      await connection.start() // Start connection
      connection.onclose(this.onConnectionClose)

      connection.on('PlayerJoined', () => {
        new Audio(toggle).play()
      })

      connection.on('GameStarted', () => {
        new Audio(toggle).play()
      })

      connection.on('GameEnded', () => {
        new Audio(smashNo).play()
      })

      this.setState({
        connection
      })

      await connection.invoke('ControllerJoin', gameId, userId)
    } catch (error: unknown) {
      this.setState({
        error,
      })
      throw error
    } finally {
      this.setState({
        connecting: false,
      })
    }
  }

  render(): JSX.Element {
    return (
      <Stack horizontal horizontalAlign='space-around'>
        <Stack maxWidth='900px' grow={ true }>
          <div style={ { height: '15px' } }></div>
          <Text variant='xxLarge'><strong>Use the phone to control the bar in the game!</strong></Text>
          { this.renderContent() }
        </Stack>
      </Stack>
    )
  }

  renderContent() {
    if (this.state.error) {
      return (
        <>
          <Text>Something went wrong!</Text>
          <TextField multiline={ true } rows={ 2 } disabled={ true }> { getErrorAsString(this.state.error) } </TextField>
        </>
      )
    }

    if (!this.state.connection) {
      return (
        <Spinner label='Connecting...' />
      )
    }

    return <Text>Connected!</Text>
  }
}
