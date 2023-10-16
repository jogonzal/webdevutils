import './../assets/globalStyles/App.css'

import * as React from 'react'
import { HashRouter,Route, Switch  } from 'react-router-dom'

import { NotFound } from './MiniComponents/NotFound'
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

            <Route path='/settings' component={ Settings } />

            <Route path='/webdevutils' component={ WebDevUtils } />

            <Route component={ NotFound } />
            <Route />
          </Switch>
        {/* </NavbarContainer> */}
      </HashRouter>
    )
  }
}
