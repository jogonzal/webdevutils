import { Checkbox } from '@fluentui/react/lib/Checkbox'
import * as React from 'react'

import { VerticalStack } from '../../components/Stacks/VerticalStack'

type Props = {
  onChange?: (input: boolean) => void
  value: boolean
  label: string | undefined
  readOnly?: boolean
}

export class CheckboxWrapper extends React.Component<Props> {
  private onCheckboxChanged = (_formEvent: React.FormEvent<HTMLInputElement | HTMLElement> | undefined, newValue: boolean | undefined) => {
    if (newValue === null || newValue === undefined) {
      return
    }

    if (this.props.onChange) {
      this.props.onChange(newValue)
    }
  }

  render() {
    return (
      <VerticalStack verticalAllign='center'>
        <div style={ { height: '7px' } } />
        <Checkbox
          label={ this.props.label }
          onChange={ this.onCheckboxChanged }
          checked={ this.props.value }
          disabled={ this.props.readOnly } />
        <div style={ { height: '7px' } } />
      </VerticalStack>
    )
  }
}
