import './../assets/globalStyles/App.css'

import * as React from 'react'
import { HashRouter,Route, Switch  } from 'react-router-dom'

import { SignalRTest } from '../experimental/SignalRTest'
import { Blacky } from './Blacky'
import { DebugPanel } from './DebugPanel'
import { NotFound } from './MiniComponents/NotFound'
import { MobileController } from './MobileController'
import { MyAccount } from './MyAccount'
import { PlayGame } from './PlayGame'
import { Settings } from './Settings/Settings'
import { WebDevUtils } from './Test/WebDevUtils'

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
    return (
      <HashRouter>
        {/* <NavbarContainer> */}
          <Switch>
            <Route exact={ true } path='/' component={ WebDevUtils } />
            <Route path='/playgame?' component={ PlayGame } />
            <Route path='/g/:gameId?' component={ PlayGame } />
            <Route path='/mobile/:gameId/:playerId' component={ MobileController } />

            { /* Cuenta, settings, permisos */ }
            <Route path='/myAccount' component={ MyAccount } />
            <Route path='/settings' component={ Settings } />

            { /* Admin stuff */ }

            { /* Debug/Test stuff */ }
            <Route path='/debugpanel' component={ DebugPanel } />
            <Route path='/webdevutils' component={ WebDevUtils } />
            <Route path='/test/signalr' component={ SignalRTest } />
            <Route path='/blacky' component={ Blacky } />

            <Route component={ NotFound } />
            <Route />
          </Switch>
        {/* </NavbarContainer> */}
      </HashRouter>
    )
  }
}
