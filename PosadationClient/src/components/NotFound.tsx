import { Link, Stack } from '@fluentui/react'
import { Text } from '@fluentui/react/lib/Text'
import * as React from 'react'

export class NotFound extends React.Component {
  render(): JSX.Element {
    return (
      <Stack padding={ 15 }>
        <Text variant='xLarge'>La pagina a la que ingresaste no existe! { window.location.href }</Text>
        <Link href='/'>Regresar a home</Link>
      </Stack>
    )
  }
}
