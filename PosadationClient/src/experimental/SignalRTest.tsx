import * as signalR from '@aspnet/signalr'
import { ITextField, PrimaryButton, Text, TextField } from 'office-ui-fabric-react'
import * as React from 'react'
import { DialogMessages } from '../shared/dialogs/DialogMessages'
import { getCurrentUser } from '../shared/getCurrentUser'
import { getErrorAsString } from '../shared/logging/getErrorAsString'
import { Log } from '../shared/logging/Log'

interface IProps {
}
type State = {
  message: string
  connection: signalR.HubConnection | undefined
  connecting: boolean
  messages: string[]
}

export class SignalRTest extends React.Component<IProps, State> {
  textFieldRef = React.createRef<ITextField>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      message: '',
      connection: undefined,
      messages: [],
      connecting: true,
    }
  }

  onConnectionClose = (error: Error | undefined) => {
    Log.logger.info(`Connection closed :(. Error: ${getErrorAsString(error)}`)
    this.setState({
      connection: undefined,
      connecting: false,
    })
  }

  async componentDidMount(): Promise<void> {
    await this.connect()
  }

  connect = async () => {
    try {
      this.setState({
        connecting: true,
      })
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/chatHub')
        .configureLogging(signalR.LogLevel.Information)
        .build()

      await connection.start() // Start connection
      connection.onclose(this.onConnectionClose)

      connection.on('ReceiveMessage', (message) => {
        Log.logger.info('Received message!')
        this.setState({
          messages: [...this.state.messages, message ],
        }, () => {
          // Scroll to bottom by default
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const textField = this.textFieldRef.current as any
          const textElement = textField._textElement.current
          textElement.scrollTop = textElement.scrollHeight
        })
      })

      this.setState({
        connection,
        connecting: false,
      })
    } catch (error) {
      DialogMessages.showErrorMessage(error)
      throw error
    }
  }

  sendMessage = async () => {
    if (!this.state.connection) {
      throw new Error('No connection!')
    }

    try {
      await this.state.connection.invoke('SendMessage', this.state.message)
      this.setState({
        message: '',
      })
    } catch (error) {
      DialogMessages.showErrorMessage(error)
      throw error
    }
  }

  disconnect = async () => {
    await this.state.connection?.stop()
  }

  onKeyDown = async (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.key === 'Enter') {
      await this.sendMessage()
    }
  }

  renderConnectionState() {
    if (this.state.connection) {
      return `Connected as ${getCurrentUser()?.UsuarioClave}!`
    }

    if (this.state.connecting) {
      return 'Connecting...'
    }

    return 'Not connected'
  }

  render() {
    return (
      <>
        <Text>{ this.renderConnectionState() }</Text>
        <PrimaryButton onClick={ this.sendMessage }>Send message</PrimaryButton>
        <PrimaryButton onClick={ this.disconnect } >Disconnect</PrimaryButton>
        <PrimaryButton onClick={ this.connect } >Connect</PrimaryButton>
        <TextField
          label='Type your message here:'
          onChange={ (_ev, val) => this.setState({ message: val ?? '' }) }
          value={ this.state.message }
          onKeyDown={ this.onKeyDown } />
        <TextField
          componentRef={ this.textFieldRef }
          value={ this.state.messages.join('\n') }
          rows={ 20 }
          multiline={ true } />
      </>
    )
  }
}
