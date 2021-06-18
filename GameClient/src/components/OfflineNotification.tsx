import * as React from 'react'

interface IProps {
}

interface IState {
  isOffline: boolean
}

export class OfflineNotification extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      isOffline: false,
    }
  }

  updateOnlineStatus = () => {
    const isOnline = navigator.onLine

    this.setState({
      isOffline: !isOnline,
    })
  }

  componentDidMount(): void {
    window.addEventListener('load', () => {
      this.updateOnlineStatus()
      window.addEventListener('online',  this.updateOnlineStatus)
      window.addEventListener('offline', this.updateOnlineStatus)
    })
  }

  componentWillUnmount() {
    window.removeEventListener('online',  this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  }

  render() {
    if (!this.state.isOffline) {
      return null
    }

    return (
      <div>
        <h4 className='text-warning'>La aplicación no se puede conectar con el servidor!!</h4>
      </div>
    )
  }
}
