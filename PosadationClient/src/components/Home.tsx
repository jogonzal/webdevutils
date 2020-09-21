import { StackItem } from 'office-ui-fabric-react/lib/Stack'
import { Text } from 'office-ui-fabric-react/lib/Text'
import * as React from 'react'
import { PrimaryButton, TextField } from 'office-ui-fabric-react'
import * as shortId from 'shortid'
import { AuthInfo } from '../shared/AuthInfo'
import { VerticalStack } from './Stacks/VerticalStack'

type State = {
  userName: string
}

type Props = {
}

export class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      userName: '',
    }
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
              <TextField placeholder='Username' value={ this.state.userName } onChange={ (_inp, val) => this.setState({ userName: val ?? '' }) } />
              <PrimaryButton disabled={ this.state.userName === '' } href={`/#/playgame/${shortId.generate().substr(0, 5)}`} >Play game!</PrimaryButton>
            </VerticalStack>
          </StackItem>
        </VerticalStack>
      </div>
    )
  }
}
