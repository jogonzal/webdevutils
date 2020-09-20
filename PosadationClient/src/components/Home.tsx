import { StackItem } from 'office-ui-fabric-react/lib/Stack'
import { Text } from 'office-ui-fabric-react/lib/Text'
import * as React from 'react'
import { PrimaryButton } from 'office-ui-fabric-react'
import { AuthInfo } from '../shared/AuthInfo'
import { VerticalStack } from './Stacks/VerticalStack'

type State = {
}

type Props = {
}

export class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const currentUser = AuthInfo.getUserId()

    if (!currentUser) {
       return null
    }

    return (
      <div>
        <VerticalStack padding={ 15 }>
          <StackItem align='center'>
            <VerticalStack>
              <Text variant='xxLarge' style={ { paddingTop: '20px' } }>Posadation</Text>
              <Text variant='medium'>Usuario: { currentUser }</Text>
              <PrimaryButton href='/#/playgame'>Play game!</PrimaryButton>
            </VerticalStack>
          </StackItem>
        </VerticalStack>
      </div>
    )
  }
}
