import { Text, Separator, Icon, DefaultButton, PrimaryButton } from 'office-ui-fabric-react'
import * as React from 'react'
import { getCurrentUser } from '../shared/getCurrentUser'
import { BoxLabel } from '../shared/wrappers/BoxLabel'
import { UsuarioModel } from '../models/UsuarioModel'
import { HorizontalStack } from './Stacks/HorizontalStack'
import { VerticalStack } from './Stacks/VerticalStack'

type State = {
}

type Props = {
}

export class MyAccount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  renderCurrentUserInfoOrNotRegisteredWarning() {
    const currentUser = getCurrentUser()

    if (currentUser) {
      return (
        <>
          <Text>El usuario <em>{ currentUser.UsuarioClave }</em> si existe. Bienvenido a Posadation!</Text>
        </>
      )
    }

    return <Text variant='large'>No has seleccionado una empresa todavia.</Text>
  }

  render() {
    const currentUser = getCurrentUser()
    return (
      <VerticalStack padding={ 20 } >
        { this.renderCurrentUserInfoOrNotRegisteredWarning() }
        <Separator />
        <Separator />
        { currentUser &&
          <HorizontalStack grow={ false }>
            <VerticalStack grow={ false }>
              <DefaultButton href='/signout'><Icon iconName='ClosePane'/>Cerrar sesión</DefaultButton>
            </VerticalStack >
            <VerticalStack grow={ false }>
                <DefaultButton href='/#/settings'><Icon iconName='settings' />Configuracion</DefaultButton>
              </VerticalStack>
          </HorizontalStack>
          }
          { this.renderAdminPanel(currentUser) }
      </VerticalStack>
    )
  }

  renderAdminPanel = (currentUser: UsuarioModel | undefined) => {
    if (!currentUser) {
      return
    }

    if (!currentUser.UsuarioAccesoAdmin) {
      return null
    }

    return (
      <>
        <Separator/>
        <HorizontalStack>
          <BoxLabel label='Admin'>
            <HorizontalStack>
              <VerticalStack>
                <PrimaryButton href='/#/usuariosCaptura'>Captura usuarios</PrimaryButton>
              </VerticalStack>
              <VerticalStack grow={ false }>
                <DefaultButton href='/#/changeHistory'><Icon iconName='FullHistory'/>Historial de cambios</DefaultButton>
              </VerticalStack>
              <VerticalStack grow={ false }>
                <DefaultButton href='/#/usageAnalysis'><Icon iconName='FullHistory'/>Analysis de uso</DefaultButton>
              </VerticalStack>
              <VerticalStack grow={ false }>
                <DefaultButton href='/#/sistemaCaptura'><Icon iconName='settings'/>Sistema</DefaultButton>
              </VerticalStack>
            </HorizontalStack>
          </BoxLabel>
        </HorizontalStack>
      </>
    )
  }
}
