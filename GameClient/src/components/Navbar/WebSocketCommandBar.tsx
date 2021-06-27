import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar'
import * as React from 'react'

import { getCurrentUser } from '../../shared/getCurrentUser'

function createBrowseTo(to: string): string {
  return '/#/' + to
}

export class WebSocketCommandBar extends React.Component {
  public render(): JSX.Element {
    return (
      <CommandBar
        items={ this.getItems() }
        // overflowItems={ this.getOverflowItems() }
        farItems={ this.getFarItems() } />
    )
  }

  // Data for CommandBar
  // Icons here come from https://uifabricicons.azurewebsites.net/
  private getItems = (): ICommandBarItemProps[] => {
    return [
      {
        key: 'administrativo',
        name: 'Administrativo',
        iconProps: {
          iconName: 'FabricUserFolder',
        },
        subMenuProps: {
          items: [
            {
              key: 'industrias',
              name: 'Industrias',
              iconProps: {
                iconName: '',
              },
              href: createBrowseTo('zonasCaptura'),
            },
          ],
        },
      },
    ]
  }

  // private getOverflowItems = () => {
  //   return [
  //     {
  //       key: 'move',
  //       name: 'Move to...',
  //       href: () => console.log('Move to'),
  //       iconProps: {
  //         iconName: 'MoveToFolder',
  //       },
  //     },
  //   ]
  // }

  private getFarItems = () => {
    const currentUser = getCurrentUser()
    const limit = 12
    let name = 'NO REGISTRADO'
    if (currentUser) {
      name = currentUser.UsuarioNombre
      if (currentUser.UsuarioNombre.length > limit) {
        name = currentUser.UsuarioNombre.substring(0, limit - 1) + '...'
      }
    }
    return [
      {
        key: 'myAccount',
        name: name,
        iconProps: {
          iconName: 'Contact',
        },
        href: createBrowseTo('myAccount'),
      },
    ]
  }
}
