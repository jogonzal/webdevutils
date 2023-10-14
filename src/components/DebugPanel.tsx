import { Link, PrimaryButton, Separator,Text } from '@fluentui/react'
import * as React from 'react'

import { UsuarioModel } from '../models/UsuarioModel'
import { DialogMessages } from '../shared/dialogs/DialogMessages'
import { getCurrentSistema, getCurrentUser } from '../shared/getCurrentUser'
import { Log } from '../shared/logging/Log'
import { MessageError } from '../shared/MessageError'
import { BoxLabel } from '../shared/wrappers/BoxLabel'
import { HorizontalStack } from './Stacks/HorizontalStack'
import { VerticalStack } from './Stacks/VerticalStack'

interface IProps {
}

export class DebugPanel extends React.Component<IProps> {
  renderAdminDebugPanel(currentUser: UsuarioModel) {
    if (!currentUser?.UsuarioAccesoAdmin) {
      return null
    }

    return (
      <VerticalStack>
        <Text variant='large'>Admin debug panel</Text>
        <br />
        <HorizontalStack>
          <BoxLabel label='Test apps'>
            <ul>
              <li>
                <Link href='/#/test/signalr' >SignalR chat test app</Link>
              </li>
              <li>
                <Link href='/#/test/detailsList' >DetailsList</Link>
              </li>
              <li>
                <Link href='/testEmail/FacturaMail' target='_blank' >FacturaMail</Link>
              </li>
              <li>
                <Link href='/#/blacky' target='_blank' >Blacky</Link>
              </li>
              <li>
                <Link href='/#/webrtctest' target='_blank' >WebRtc</Link>
              </li>
              <li>
                <Link href='/#/playgame' target='_blank' >Play game</Link>
              </li>
              <li>
                <Link href='/#/webdevutils' >Web dev utils</Link>
              </li>
            </ul>
          </BoxLabel>
        </HorizontalStack>
      </VerticalStack>
    )
  }

  render() {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      return null
    }

    return (
      <VerticalStack padding={ 20 }>
        <VerticalStack grow={ false } >
          <Text variant='large'>Debug panel</Text>
          <Text>User: { currentUser.UsuarioClave }</Text>
          <Text>Empresa: { getCurrentSistema()?.SistemaNombreEmpresa }</Text>
          <Text>UserId: { Log.logger.insights?.context.user.id }</Text>
          <Text>SessionId: { Log.logger.insights?.context.sessionManager.automaticSession.id }</Text>
        </VerticalStack>
        <HorizontalStack>
          <PrimaryButton onClick={ () => DialogMessages.showErrorMessage(new MessageError('Haga click en "Reportar error" para enviar un mail con su error a los administradores.'), true) }>Reportar un error</PrimaryButton>
        </HorizontalStack>
        <Separator />
        { this.renderAdminDebugPanel(currentUser) }
      </VerticalStack>
    )
  }
}
