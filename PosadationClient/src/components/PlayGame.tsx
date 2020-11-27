import * as signalR from '@aspnet/signalr'
import { Label, Persona, PersonaPresence, PersonaSize, PrimaryButton, Spinner, Stack, StackItem, Text, TextField } from '@fluentui/react'
import { toDataURL } from 'qrcode'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import * as shortId from 'shortid'

import melee from '../assets/sounds/melee/melee.wav'
import smashNo from '../assets/sounds/melee/menu-no.wav'
import smashOk from '../assets/sounds/melee/menu-ok.wav'
import toggle from '../assets/sounds/melee/menu-toggle.wav'
import { IUser } from '../shared/IUser'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'
import { createGuid } from '../shared/utils/createGuid'

type State = {
  gameMetadata?: IGameTableEntity
  error?: unknown
  connection: signalR.HubConnection | undefined
  connecting: boolean
  user: IUser | undefined
  userInTextBox: string
  gameStarted: boolean
  qrCodeDataUrl: string | undefined
}

type RouteParams = {
  gameId?: string
}

type Props = RouteComponentProps<RouteParams>

export class PlayGame extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      connecting: false,
      connection: undefined,
      user: undefined,
      gameStarted: false,
      qrCodeDataUrl: undefined,
      userInTextBox: '',
    }
  }

  async componentDidMount() {
    new Audio(melee).play()
    // if (this.state.user && this.props.match.params.id) {
    //   // If user and game is available, start game
    //   await this.makeConnection(this.state.user, this.props.match.params.id)
    // }
  }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.error(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      error,
    })
  }

  onUserTextboxKeyDown = (key: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (key.key === 'Enter') {
      this.onCreateOrStartGameClick()
    }
  }

  onCreateOrStartGameClick = async () => {
    if (!this.state.userInTextBox) {
      new Audio(smashNo).play()
      return
    }

    new Audio(smashOk).play()
    const user = {
      Id: createGuid(),
      Name: this.state.userInTextBox,
    }
    this.setState({
      user,
    })

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const gameId = this.props.match.params.gameId || shortId.generate().substr(0, 5)
    const url = `/#/g/${gameId}`
    window.location.href = url

    // If user and game is available, start game
    await this.makeConnection(user, gameId)
  }

  makeConnection = async (user: IUser, gameId: string) => {
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

      await connection.invoke('CreateOrJoinGame', gameId, user.Id, user.Name)
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

  onStartGameClick = async () => {
    new Audio(smashOk).play()
    this.state.connection?.invoke('StartGame')
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const url = window.location.protocol + '//' + window.location.host + '#/mobile/' + this.props.match.params.gameId + '/' + this.state.user?.Id
    Log.logger.info(url)
    const dataUrl = await toDataURL(canvas, url)
    this.setState({
      qrCodeDataUrl: dataUrl,
    })
  }

  render(): JSX.Element {
    if (this.props.match.params.gameId === undefined || !this.state.user) {
      return (
        <Stack padding={ 15 }>
          <StackItem align='center'>
            <Stack>
              <Text variant='xxLarge' style={ { paddingTop: '20px' } }>Game!</Text>
              <TextField onKeyDown={ this.onUserTextboxKeyDown } autoFocus={ true } placeholder='Username' value={ this.state.userInTextBox } onChange={ (_inp, val) => this.setState({ userInTextBox: val ?? '' }) } />
              <PrimaryButton disabled={ this.state.userInTextBox === '' } onClick={ this.onCreateOrStartGameClick } >Play game!</PrimaryButton>
            </Stack>
          </StackItem>
        </Stack>
      )
    }

    return (
      <Stack horizontal horizontalAlign='space-around'>
        <Stack maxWidth='900px' grow={ true }>
          <div style={ { height: '15px' } }></div>
          <Text variant='xxLarge'>Welcome, <strong>{ this.state.user.Name }!</strong>!</Text>
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
    if (navigator.clipboard !== undefined && navigator.clipboard !== null) {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  renderGameContent(gameMetadata: IGameTableEntity) {
    const users: IUser[] = JSON.parse(gameMetadata.UsersArray)

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
                  key={ u.Id }
                  size={PersonaSize.size72}
                  presence={PersonaPresence.online}
                  text={ u.Name }
                  // onRenderCoin={_onRenderCoin}
                  // imageAlt="Ted Randall, status is available at 4 PM"
                  // imageUrl={TestImages.personaMale}
                  />
              )
            }) }
          </Stack>
        </Stack>
        <div style={ { height: '15px' } }></div>
        { this.renderStartedGame(users, gameMetadata) }
      </Stack>
    )
  }

  getUserWithId = (userId: string, users: IUser[]): IUser | undefined => {
    return users.find(u => u.Id === userId)
  }

  renderStartedGame = (users: IUser[], gameMetadata: IGameTableEntity) => {
    if (gameMetadata.GameStarted) {
      return (
        <>
          <Text>Game started!!</Text>
          { this.state.qrCodeDataUrl !== undefined && <img width={ 300 } height={ 300 } src={ this.state.qrCodeDataUrl }></img> }
        </>
      )
    }

    if (users.length <= 0) { // TODO change back to 1
      return (
        <Text>Waiting for players to join...</Text>
      )
    }

    if (gameMetadata.LeaderUserId !== this.state.user?.Id) {
      return (
        <Text>Waiting for <strong>{ this.getUserWithId(gameMetadata.LeaderUserId, users)?.Name }</strong> to start game...</Text>
      )
    }

    return (
      <>
        <PrimaryButton onClick={ this.onStartGameClick }>Start game!</PrimaryButton>
      </>
    )
  }
}
