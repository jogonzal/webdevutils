import { Text, Link, Separator, Icon, DefaultButton, PrimaryButton } from 'office-ui-fabric-react'
import * as React from 'react'
import { EnumValue } from '../shared/DataTypes'
import { getCurrentMetadata, getCurrentUser } from '../shared/getCurrentUser'
import { BoxLabel } from '../shared/wrappers/BoxLabel'
import { UsuarioModel } from '../models/UsuarioModel'
import { HorizontalStack } from './Stacks/HorizontalStack'
import { VerticalStack } from './Stacks/VerticalStack'

export type Empresa = 'CTEtiquetas' | 'Etiprint' | 'Apitsa' | 'Test' | 'Undefined'
export const Empresa = {
  CTEtiquetas: new EnumValue<Empresa>('CTEtiquetas'),
  Etiprint: new EnumValue<Empresa>('Etiprint'),
  Apitsa: new EnumValue<Empresa>('Apitsa'),
  Test: new EnumValue<Empresa>('Test'),
}

type State = {
}

type Props = {
}

export class MyAccount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  renderCurrentUserInfoOrNotRegisteredWarning() {
    const empresa = getCurrentMetadata().Empresa
    const currentUser = getCurrentUser()

    if (currentUser) {
      return (
        <>
          <Text variant='large'>La empresa que esta seleccionada actualmente es <strong>{ empresa }</strong>. El usuario <em>{ currentUser.UsuarioClave }</em> si esta registrado con esta empresa. Bienvenido a Posadation!</Text>
        </>
      )
    }

    if (empresa !== 'Undefined') {
      return (
        <>
          <Text variant='large'>El usuario <strong>{ getCurrentMetadata().Email }</strong> no esta registrado en la empresa <strong>{ getCurrentMetadata().Empresa }</strong></Text>
          <Separator />
          <Text>Para arreglar este error, contacte a el administrador de la empresa para registrarse, <Link href='/signout'>inicie sesión con una cuenta diferente</Link>, o seleccione otra empresa.</Text>
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
