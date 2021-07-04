import { Link } from '@fluentui/react'
import { Text } from '@fluentui/react/lib/Text'
import * as React from 'react'

import { VerticalStack } from '../Stacks/VerticalStack'

export class NotFound extends React.Component {
  render() {
    return (
      <VerticalStack padding={ 15 }>
        <Text variant='xLarge'>La pagina a la que ingresaste no existe! { window.location.href }</Text>
        <Link href='/'>Regresar a home</Link>
      </VerticalStack>
    )
  }
}
