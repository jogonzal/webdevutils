import { Text } from '@fluentui/react'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { delay } from '../shared/utils/Delay'

interface IProps {
  productId: number
}

export const ProductPrice: React.FC<IProps> = (props: IProps) => {
  const [ price, setPrice ] = useState<number | undefined>(undefined)

  useEffect(() => {
    let isUnmounted = false
    const productId = props.productId
    // Make web request for this productId

    const asyncCallback = async () => {
      // eslint-disable-next-line no-console
      console.log(`Making a request for ${productId}`)
      const response = await fetch('/')
      await response.text()
      await delay(Math.random() * 10000);
      // eslint-disable-next-line no-console
      console.log(`ID ${productId} just came back. isUnmounted: ${isUnmounted}. Current productId ${props.productId}`)

      if (isUnmounted) {
        return
      }

      setPrice(productId)
    }
    setPrice(undefined)
    asyncCallback()

    return () => {
      isUnmounted = true
    }
  }, [ props.productId ])

  if (price === undefined) {
    return <Text>Loading...</Text>
  }

  return (
    <Text>Price is { price }</Text>
  )
}
