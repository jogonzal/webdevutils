import { Link, Text, PrimaryButton, Separator } from 'office-ui-fabric-react'
import * as React from 'react'
import { getCurrentUser, getCurrentAgenteOverride, clearAgenteOverride, setAgenteOverride, getCurrentSistema } from '../shared/getCurrentUser'
import { Log } from '../shared/logging/Log'
import { MessageError } from '../shared/MessageError'
import { DialogMessages } from '../shared/dialogs/DialogMessages'
import { BoxLabel } from '../shared/wrappers/BoxLabel'
import { UsuarioModel } from '../models/UsuarioModel'
import { VerticalStack } from './Stacks/VerticalStack'
import { HorizontalStack } from './Stacks/HorizontalStack'

type Props = {}
type State = {
  agenteSeleccionado?: number
}

export class DebugPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      agenteSeleccionado: getCurrentAgenteOverride(),
    }
  }

  onAgenteChanged = (newVal: number | undefined) => {
    this.setState({ agenteSeleccionado: newVal })
  }

  onBorrarAgenteOverride = () => {
    clearAgenteOverride()
    window.location.reload()
  }

  onGrabarAgenteOverride = async () => {
    if (!this.state.agenteSeleccionado) {
      return
    }

    setAgenteOverride(this.state.agenteSeleccionado)
    await DialogMessages.simpleNotificationDialog('Override grabado!', 'success', 'Override grabado')
    window.location.reload()
  }

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
