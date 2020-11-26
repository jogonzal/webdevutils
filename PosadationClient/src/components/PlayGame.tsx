import * as signalR from '@aspnet/signalr'
import { Label, Persona, PersonaPresence, PersonaSize, PrimaryButton, Spinner, Stack, StackItem, Text, TextField } from '@fluentui/react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as shortId from 'shortid'

import smashOk from '../assets/sounds/melee/menu-ok.wav'
import { AuthInfo } from '../shared/AuthInfo'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'

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
  user: string
  gameStarted: boolean
}

type RouteParams = {
  id?: string
}

type Props = RouteComponentProps<RouteParams>

export class PlayGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      connecting: false,
      connection: undefined,
      user: '',
      gameStarted: false
    }
  }

  // async componentDidMount() {
  //   if (this.state.user && this.props.match.params.id) {
  //     // If user and game is available, start game
  //     await this.makeConnection(this.state.user, this.props.match.params.id)
  //   }
  // }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.error(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      error,
    })
  }

  onCreateOrStartGameClick = async () => {
    this.setState({
      gameStarted: true,
    })

    const gameId = this.props.match.params.id || shortId.generate().substr(0, 5)
    const url = `/#/g/${gameId}`
    window.location.href = url

    if (!this.state.user) {
      throw new Error('User not defined!!')
    }

    // If user and game is available, start game
    await this.makeConnection(this.state.user, gameId)
  }

  makeConnection = async (user: string, gameId: string) => {
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

      connection.on('GameMetadataUpdate', (serializedGame: string) => {
        Log.logger.info('Received game metadata! ' + serializedGame)
        this.setState({
          gameMetadata: JSON.parse(serializedGame),
        })
      })

      this.setState({
        connection
      })

      await connection.invoke('CreateOrJoinGame', gameId, user)
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

  onStartGameClick = () => {
    // TODO!
    const audio = new Audio(smashOk)
    audio.play()
  }

  render(): JSX.Element {
    if (!this.props.match.params.id || !this.state.user || !this.state.gameStarted) {
      return (
        <Stack padding={ 15 }>
          <StackItem align='center'>
            <Stack>
              <Text variant='xxLarge' style={ { paddingTop: '20px' } }>Game!</Text>
              <TextField placeholder='Username' value={ this.state.user } onChange={ (_inp, val) => this.setState({ user: val ?? '' }) } />
              <PrimaryButton disabled={ this.state.user === '' } onClick={ this.onCreateOrStartGameClick } >Play game!</PrimaryButton>
            </Stack>
          </StackItem>
        </Stack>
      )
    }

    return (
      <Stack horizontal horizontalAlign='space-around'>
        <Stack maxWidth='900px' grow={ true }>
          <div style={ { height: '15px' } }></div>
          <Text variant='xxLarge'>Welcome, <strong>{AuthInfo.getUserId()}!</strong>!</Text>
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

    if (!this.state.gameMetadata) {
      return (
        <Spinner label='Obtaining game metadata...' />
      )
    }

    return this.renderGameContent(this.state.gameMetadata)
  }

  onCopyInviteLink = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  renderGameContent(gameMetadata: IGameTableEntity) {
    const users: string[] = JSON.parse(gameMetadata.UsersArray)

    return (
      <Stack>
        <Text>Copy this link and share it with other players!</Text>
        <div style={ { height: '15px' } }></div>
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
      </Stack>
    )
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
      <PrimaryButton onClick={ this.onStartGameClick }>Start game!</PrimaryButton>
    )
  }
}
