import { Image } from 'office-ui-fabric-react/lib/Image'
import { Separator } from 'office-ui-fabric-react/lib/Separator'
import { Stack, StackItem } from 'office-ui-fabric-react/lib/Stack'
import { Text } from 'office-ui-fabric-react/lib/Text'
import * as React from 'react'
import logoPng from '../assets/img/logo.png'
import { PosadationCommandBar } from './Navbar/PosadationCommandBar'
import { OfflineNotification } from './OfflineNotification'
import { VerticalStack } from './Stacks/VerticalStack'

type Props = {}

export class NavbarContainer extends React.Component<Props> {
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
                  <Text variant='large'>Posadation</Text>
                  <Text variant='small'>Posadation</Text>
                </Stack>
              </div>
              <div style={ { flexGrow: 1 } }>
                <PosadationCommandBar />
              </div>
            </nav>
            <Separator styles={ { root: { padding: '0px', height: '5px' } } }/>
        </StackItem>
        { this.props.children }
      </VerticalStack>
    )
  }
}
