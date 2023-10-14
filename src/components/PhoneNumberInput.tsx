import { TextField } from '@fluentui/react'
import * as React from 'react'

import { Log } from '../shared/logging/Log'

// Only input that matters is numbers and backspace
// Print formatting characters before numbers only
// Keep cursor in the right position
// Pasting should work - best effort approach (strip all non-number characters, pick first 10 numbers)

// Maintain cursor position
  // pasting "cursor should go to the end of pasted input"
  // deleting or typing should stay in the same position

  // cursorPosition = current cursor position
  // inputLength-> = length of input (could be negative, could be both adding and removing)
  // oldLength = Old formatted length
  // newLength = New formatted length
  // formattedLengthDiff = newLength - oldLength

  // newCursorPosition = cursorPosition + formattedLengthDiff

/*

Keep only the #'s in internal state
Render numbers according to format

onChange, only pick appropiate numbers
  and leave cursor in the right position -> postpone

// On full delete, first character remains
//
*/

export const PhoneNumberInput: React.FC = () => {
  const [ phoneNumber, setPhoneNumber] = React.useState<string>('')

  const getFormattedNumber = (): string => {
    if (phoneNumber === '') {
      return ''
    }

    // Insert 'a's until completing 10 characters
    // Insert 'formatting' characters
    // ( at 0
    // (  at 4
    // - at 10

    const arr: string[] = phoneNumber.split('');

    if (phoneNumber.length > 0) {
      arr.splice(0, 0, '(')

      if (phoneNumber.length >= 4) {
        arr.splice(4, 0, ') ')
      }

      if (phoneNumber.length >= 7) {
        arr.splice(8, 0, '-')
      }
    }

    const formattedPhoneNumber = arr.join('')

    Log.logger.info(`Formatted ${phoneNumber} into ${formattedPhoneNumber}`)

    return formattedPhoneNumber
  }

  const onValueChanged = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
    value = value ?? ''
    const newValue = value.replace(/[^0-9]/g, '').substr(0, 10)
    Log.logger.info(`Replaced ${value} into ${newValue}`)

    setPhoneNumber(newValue)
  }

  return (
    <>
      <TextField label='Internal state' value={ phoneNumber } />
      <TextField placeholder='(555) 555-5555' value={ getFormattedNumber() } onChange={ onValueChanged } />
    </>
  )
}
