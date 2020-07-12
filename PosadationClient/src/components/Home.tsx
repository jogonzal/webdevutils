import { StackItem } from 'office-ui-fabric-react/lib/Stack'
import { Text } from 'office-ui-fabric-react/lib/Text'
import * as React from 'react'
import { PrimaryButton } from 'office-ui-fabric-react'
import { getCurrentSistema, getCurrentUser } from '../shared/getCurrentUser'
import logoGrandePng from '../assets/img/logoGrande.png'
import { VerticalStack } from './Stacks/VerticalStack'
import { HorizontalStack } from './Stacks/HorizontalStack'

type State = {
}

type Props = {
  vendedorAgenteClave?: number
}

export class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  renderVendedorMessage() {
    if (!this.props.vendedorAgenteClave) {
      return null
    }

    return <Text variant='medium'>VENDEDOR (Clave { this.props.vendedorAgenteClave })</Text>
  }

  renderVendedorOptions() {
    if (!this.props.vendedorAgenteClave) {
      return null
    }

    return (
      <HorizontalStack padding={ 20 } allign='center' >
        <PrimaryButton href='/#listadofacturas'>Reporte de ventas</PrimaryButton>
        <PrimaryButton href='/#cobranzaporcliente'>Cobranza por cliente</PrimaryButton>
        <PrimaryButton href='/#listadoclientes'>Listado clientes</PrimaryButton>
        <PrimaryButton href='/#listadoetiquetas'>Listado etiquetas</PrimaryButton>
        <PrimaryButton href='/#comisiones'>Comisiones</PrimaryButton>
        <PrimaryButton href='/#listadopagos'>Comisiones pagadas</PrimaryButton>
      </HorizontalStack>
    )
  }

  render() {
    const currentUser = getCurrentUser()

    if (!currentUser) {
       return null
    }

    return (
      <div>
        <VerticalStack padding={ 15 }>
          <StackItem align='center'>
            <VerticalStack>
              <StackItem align='center'>
                <img src={ logoGrandePng } />
              </StackItem>
              <Text variant='xxLarge' style={ { paddingTop: '20px' } }>DinCloud</Text>
              <Text variant='medium'>Usuario: { currentUser.UsuarioNombre }</Text>
              <Text variant='medium'>Empresa: { getCurrentSistema()?.SistemaNombreEmpresa }</Text>
              { this.renderVendedorMessage() }
            </VerticalStack>
          </StackItem>
          { this.renderVendedorOptions() }
        </VerticalStack>
      </div>
    )
  }
}
