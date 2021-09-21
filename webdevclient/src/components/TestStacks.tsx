import { Stack, StackItem, Text } from '@fluentui/react'
import * as React from 'react'

export const TestStacks: React.FC = () => {
  return (
    <Stack verticalFill>
      <StackItem style={ { height: '60px' } } >
        <Stack horizontal verticalFill>
          <StackItem style={ { width: '110px', backgroundColor: 'blue' } } >
            <Text>Logo</Text>
          </StackItem>
          <StackItem grow style={ { backgroundColor: 'purple' } }>
            <Text>Menu</Text>
          </StackItem>
          <StackItem verticalFill align='end' style={ { width: '100px', backgroundColor: 'cyan' }}>
            <Text>Account</Text>
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem verticalFill>
        <Stack horizontal verticalFill>
          <StackItem style={ { width: '110px', backgroundColor: 'red' } }>
            <Text>Left nav</Text>
          </StackItem>
          <StackItem grow style={ { backgroundColor: 'black' } }>
            <Text>Main</Text>
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  )
}
