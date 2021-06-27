import { Image } from '@fluentui/react/lib/Image'
import { Separator } from '@fluentui/react/lib/Separator'
import { Stack, StackItem } from '@fluentui/react/lib/Stack'
import { Text } from '@fluentui/react/lib/Text'
import * as React from 'react'

import logoPng from '../assets/img/logo.png'
import { WebSocketCommandBar } from './Navbar/WebSocketCommandBar'
import { OfflineNotification } from './OfflineNotification'
import { VerticalStack } from './Stacks/VerticalStack'

interface IProps {
}

export class NavbarContainer extends React.Component<IProps> {
  onHomeClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    // CNTRL CLICK means new tab
    if (ev.ctrlKey) {
      window.open('/')
      return
    }
    window.location.href = '/'
  }

  render() {
    return (
      <VerticalStack grow={ true } verticalFill={ true } >
        <StackItem tokens={ { margin: '4px' } }>
          <OfflineNotification />
            <nav style={ { display: 'flex' } } >
              <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' } } onClick={ this.onHomeClick } >
                <Image src={ logoPng } height='44px' width='44px' style={ { paddingRight: '10px', height: '44px', width: '44px' } }/>
                <Stack style={ { paddingLeft: '10px' } } >
                  <Text variant='large'>WebSocketGame</Text>
                  <Text variant='small'>WebSocketGame</Text>
                </Stack>
              </div>
              <div style={ { flexGrow: 1 } }>
                <WebSocketCommandBar />
              </div>
            </nav>
            <Separator styles={ { root: { padding: '0px', height: '5px' } } }/>
        </StackItem>
        { this.props.children }
      </VerticalStack>
    )
  }
}
