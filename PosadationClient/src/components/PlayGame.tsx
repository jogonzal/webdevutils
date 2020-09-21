import * as React from 'react'
import { TextField, PrimaryButton, Text, Stack, Label, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react'
import { RouteComponentProps } from 'react-router-dom'
import * as signalR from '@aspnet/signalr'
import Sound from 'react-sound'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'
import { AuthInfo } from '../shared/AuthInfo'
import countryMp3 from '../assets/music/country.mp3'

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
}

type RouteParams = {
  id: string
}

type Props = RouteComponentProps<RouteParams>

export class PlayGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      connecting: false,
      connection: undefined,
    }
  }

  async componentDidMount() {
    await this.makeConnection()
  }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.error(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      error,
    })
  }

  makeConnection = async () => {
    const id = this.props.match.params.id

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

      await connection.invoke('CreateOrJoinGame', id, AuthInfo.getUserId())
    } catch (error) {
      this.setState({
        error,
      })
      throw error
    }
  }

  onStartGameClick = () => {
    // TODO
  }

  render(): JSX.Element {
    return (
      <>
        <Sound
          url={ countryMp3 }
          playStatus={ 'PLAYING' }
          playFromPosition={ 0 /* in milliseconds */}
          // onLoading={this.handleSongLoading}
          // onPlaying={this.handleSongPlaying}
          // onFinishedPlaying={this.handleSongFinishedPlaying}
        />
        { this.renderContent() }
      </>
    )
  }

  renderContent() {
    if (this.state.error) {
      return (
        <Text>Error! {getErrorAsString(this.state.error)}</Text>
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
      <Stack horizontal horizontalAlign='space-around'>
        <Stack maxWidth='900px' grow={ true }>
          <div style={ { height: '15px' } }></div>
          <Text variant='xxLarge'>Welcome to clicking game, <strong>{AuthInfo.getUserId()}</strong>!</Text>
          { this.renderGameContent(this.state.gameMetadata) }
        </Stack>
      </Stack>
    )
  }

  onCopyInviteLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
  }

  renderGameContent(gameMetadata: IGameTableEntity) {
    const users: string[] = JSON.parse(gameMetadata.UsersArray)

    return ( <>
      <div style={ { height: '15px' } }></div>
      <Text>Copy this link and share it with other players!</Text>
      <Stack horizontal>
        <TextField
          value={ window.location.href } />
        <PrimaryButton onClick={ this.onCopyInviteLink }>Copy invite link</PrimaryButton>
      </Stack>
      <div style={ { height: '15px' } }></div>
      <Stack>
        <Label>Joined players</Label>
        <Stack horizontal wrap>
          { users.map(u => {
            return (
              <Persona
                key={ u }
                size={PersonaSize.size72}
                presence={PersonaPresence.online}
                text={ u }
                // onRenderCoin={_onRenderCoin}
                // imageAlt="Ted Randall, status is available at 4 PM"
                // imageUrl={TestImages.personaMale}
                />
            )
          }) }
        </Stack>
      </Stack>
      <div style={ { height: '15px' } }></div>
      { this.renderNeedMorePlayers(users, gameMetadata) }
    </> )
  }

  renderNeedMorePlayers = (users: string[], gameMetadata: IGameTableEntity) => {
    if (users.length <= 1) {
      return (
        <Text>Waiting for players to join...</Text>
      )
    }

    if (gameMetadata.LeaderUserId !== AuthInfo.getUserId()) {
      return (
        <Text>Waiting for <strong>{gameMetadata.LeaderUserId}</strong> to start game...</Text>
      )
    }

    return (
      <PrimaryButton>Start game!</PrimaryButton>
    )
  }
}