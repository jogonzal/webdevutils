import { PrimaryButton, Stack, StackItem, Text } from '@fluentui/react'
import * as React from 'react'
import { useState } from 'react'

import { ProductPrice } from './ProductPrice'

export const TestWebRequest: React.FC = () => {
  const [ productId, setProductId ] = useState<number>(1)

  return (
    <Stack>
      <StackItem>
        <Text>Current product: { productId }</Text>
      </StackItem>
      <PrimaryButton label='change id' onClick={ () => setProductId(productId + 1) }>Change id</PrimaryButton>
      <StackItem>
        <ProductPrice productId={ productId } />
      </StackItem>
    </Stack>
  )
}
