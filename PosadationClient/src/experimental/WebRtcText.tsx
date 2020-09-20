import { ITextField, PrimaryButton, TextField } from 'office-ui-fabric-react'
import * as React from 'react'
import * as Peer from 'simple-peer'
import { Log } from '../shared/logging/Log'

interface IProps {
}
type State = {
  message: string
  messages: string[]
}

export class WebRtcTest extends React.Component<IProps, State> {
  textFieldRef = React.createRef<ITextField>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      message: '',
      messages: [],
    }
  }

  async componentDidMount(): Promise<void> {
  }

  render() {
    return (
      <>
        { this.renderContent() }
      </>
    )
  }

  onMessageKeyDown = () => {

  }

  connect = () => {
    const peer1 = new Peer({ initiator: true })
    const peer2 = new Peer()

    peer2.on('data', data => {
      // got a data channel message
      Log.logger.info('got a message from peer1: ' + data)
    })

    peer1.on('signal', data => {
      // when peer1 has signaling data, give it to peer2 somehow
      peer2.signal(data)
    })

    peer2.on('signal', data => {
      // when peer2 has signaling data, give it to peer1 somehow
      peer1.signal(data)
    })

    peer1.on('connect', () => {
      // wait for 'connect' event before using the data channel
      peer1.send('hey peer2, how is it going?')
    })
  }

  renderContent() {
    return (
      <>
        <PrimaryButton onClick={ this.connect } >Connect</PrimaryButton>
        <TextField
          label='Type your message here:'
          onChange={ (_ev, val) => this.setState({ message: val ?? '' }) }
          value={ this.state.message }
          onKeyDown={ this.onMessageKeyDown } />
        <TextField
          componentRef={ this.textFieldRef }
          value={ this.state.messages.join('\n') }
          rows={ 20 }
          multiline={ true } />
      </>
    )
  }
}
