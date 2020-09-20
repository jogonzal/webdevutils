import * as React from 'react'
import { Route, Switch , HashRouter } from 'react-router-dom'
import { SignalRTest } from '../experimental/SignalRTest'
import './../assets/scss/App.scss'
import { getCurrentUser } from '../shared/getCurrentUser'
import { WebRtcTest } from '../experimental/WebRtcText'
import { DebugPanel } from './DebugPanel'
import { Home } from './Home'
import { NotFound } from './MiniComponents/NotFound'
import { MyAccount } from './MyAccount'
import { NavbarContainer } from './NavbarContainer'
import { Settings } from './Settings/Settings'
import { Blacky } from './Blacky'
import { PlayGame } from './PlayGame'

type State = {
}

type Props = {
}

export class App extends React.Component<Props, State> {
  componentDidMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  }

  onDocumentKeyDown = (keyEvent: KeyboardEvent) => {
    if (keyEvent.altKey && keyEvent.ctrlKey && keyEvent.key === 'd') {
      window.location.href = '/#/debugpanel'
    }
  }

  render() {
    const currentUser = getCurrentUser()
    // Si el usuario no esta registrado en la empresa, tiene que primero escoger empresa
    if (!currentUser) {
      return <MyAccount />
    }

    return (
      <HashRouter>
        <NavbarContainer>
          <Switch>
            <Route exact={ true } path='/' component={ Home } />

            { /* Cuenta, settings, permisos */ }
            <Route path='/myAccount' component={ MyAccount } />
            <Route path='/settings' component={ Settings } />

            { /* Admin stuff */ }

            { /* Debug/Test stuff */ }
            <Route path='/debugpanel' component={ DebugPanel } />
            <Route path='/test/signalr' component={ SignalRTest } />
            <Route path='/blacky' component={ Blacky } />
            <Route path='/webrtctest' component={ WebRtcTest } />
            <Route path='/playgame/:id?' component={ PlayGame } />

            <Route component={ NotFound } />
            <Route />
          </Switch>
        </NavbarContainer>
      </HashRouter>
    )
  }
}
