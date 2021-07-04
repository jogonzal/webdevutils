import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown'
import * as React from 'react'

import { EnumClass, EnumValueType, lookupEnumString } from '../DataTypes'
import { Log } from '../logging/Log'

type Props<T extends EnumValueType> = {
  label: string | undefined
  onChange?: (input: T) => void
  value: T
  optionsEnum: EnumClass<T>
  readonly?: boolean
}

export class SelectInputWrapper<T extends EnumValueType> extends React.Component<Props<T>> {

  private handleChangeInputInternal = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (!option) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key: T = option.data as any
    if (this.props.onChange) {
      this.props.onChange(key)
    }
  }

  private getOptions(): IDropdownOption[] {
    const keys =  Object.keys(this.props.optionsEnum)
    const arr: IDropdownOption[] = []

    for (const key of keys) {
      const enumValue = this.props.optionsEnum[key]
      const dropdownOption: IDropdownOption = {
        key: enumValue.databaseValue,
        data: enumValue.databaseValue,
        text: enumValue.niceDisplayString ?? enumValue.databaseValue.toString(),
      }
      arr.push(dropdownOption)
    }

    return arr
  }

  render() {
    // Log warning if value is not within options in enum
    const val = lookupEnumString(this.props.optionsEnum, this.props.value)
    if (val === undefined) {
      Log.logger.warn(`Item ${this.props.value} was not found in enum ${this.props.label}`)
    }

    return (
      <Dropdown
        label={ this.props.label }
        onChange={ this.handleChangeInputInternal }
        options={ this.getOptions() }
        selectedKey={ this.props.value }
        disabled={ this.props.readonly } />
    )
  }
}
