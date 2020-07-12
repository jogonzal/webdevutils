import { Text, Image } from 'office-ui-fabric-react'
import * as React from 'react'
import blacky1 from '../assets/img/blacky/blacky1.jpeg'
import blacky2 from '../assets/img/blacky/blacky2.jpeg'
import blacky3 from '../assets/img/blacky/blacky3.jpeg'
import blacky4 from '../assets/img/blacky/blacky4.jpeg'
import blacky5 from '../assets/img/blacky/blacky5.jpeg'
import blacky6 from '../assets/img/blacky/blacky6.jpeg'
import blacky7 from '../assets/img/blacky/blacky7.jpeg'
import blacky8 from '../assets/img/blacky/blacky8.jpeg'
import blacky9 from '../assets/img/blacky/blacky9.jpeg'
import blacky10 from '../assets/img/blacky/blacky10.jpeg'
import blacky11 from '../assets/img/blacky/blacky11.jpeg'

import { VerticalStack } from './Stacks/VerticalStack'

type Props = {}
type State = {}

export class Blacky extends React.Component<Props, State> {
  render() {
    return (
      <VerticalStack padding={ 20 }>
        <Text variant='large'>En honor a Blacky, nuestro querido perro (?2005? - 06/29/2020)</Text>
        <Image src={ blacky1 } />
        <Image src={ blacky2 } />
        <Image src={ blacky3 } />
        <Image src={ blacky4 } />
        <Image src={ blacky5 } />
        <Image src={ blacky6 } />
        <Image src={ blacky7 } />
        <Image src={ blacky8 } />
        <Image src={ blacky9 } />
        <Image src={ blacky10 } />
        <Image src={ blacky11 } />

      </VerticalStack>
    )
  }
}
