import * as React from 'react'
import { TextField, PrimaryButton, Text } from 'office-ui-fabric-react'
import { RouteComponentProps } from 'react-router-dom'
import * as signalR from '@aspnet/signalr'
import { createGuid } from '../shared/utils/createGuid'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'
import { AuthInfo } from '../shared/AuthInfo'

interface IGameTableEntity {
  PartitionKey: string
  RowKey: string
  LeaderUserId: string
  UsersArray: string
  GameEnded: boolean
}

type State = {
  gameMetadata?: IGameTableEntity
  error?: unknown
  connection: signalR.HubConnection | undefined
  connecting: boolean
  username: string
}

type RouteParams = {
  id: string | undefined
}

type Props = RouteComponentProps<RouteParams>

export class PlayGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      connecting: false,
      username: AuthInfo.getUserId(),
      connection: undefined,
    }
  }

  async componentDidMount() {
    await this.makeConnection()
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.match.params.id && !oldProps.match.params.id) {
      await this.makeConnection()
    }
  }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.error(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      error,
    })
  }

  makeConnection = async () => {
    const id = this.props.match.params.id
    if (!id) {
      return
    }

    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/game')
        .configureLogging(signalR.LogLevel.Information)
        .build()

      await connection.start() // Start connection
      connection.onclose(this.onConnectionClose)

      connection.on('GameMetadataUpdate', (serializedGame: string) => {
        Log.logger.info('Received game metadata! ' + serializedGame)
        this.setState({
          gameMetadata: JSON.parse(serializedGame),
        })
      })

      this.setState({
        connection,
        connecting: false,
      })

      await connection.invoke('CreateOrJoinGame', id, this.state.username)
    } catch (error) {
      this.setState({
        error,
      })
      throw error
    }
  }

  onStartGameClick = () => {
    const myGuid = createGuid()
    window.location.href = '/#/playgame/' + myGuid
  }

  render(): JSX.Element {
    if (this.state.error) {
      return (
        <Text>Error! {getErrorAsString(this.state.error)}</Text>
      )
    }

    if (!this.props.match.params.id) {
      return (
        <>
          <Text>Click here to start a game!</Text>
          <PrimaryButton onClick={ this.onStartGameClick }>Start game!</PrimaryButton>
        </>
      )
    }

    if (!this.state.connection) {
      return (
        <Text>Connecting...</Text>
      )
    }

    if (!this.state.gameMetadata) {
      return (
        <Text>Waiting for game metadata...</Text>
      )
    }

    if (this.state.gameMetadata.GameEnded) {
      return (
        <Text>The game has ended!</Text>
      )
    }

    return (
      <>
        <TextField
          label='Leader'
          value={ this.state.gameMetadata.LeaderUserId } />
        <TextField
          label='Current user'
          value={ AuthInfo.getUserId() } />
        <TextField
          label='Users'
          value={ this.state.gameMetadata.UsersArray } />
        <TextField
          label='Link for game'
          value={ window.location.href } />
      </>
    )
  }
}