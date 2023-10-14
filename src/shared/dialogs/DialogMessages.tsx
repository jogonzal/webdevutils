import * as React from 'react'
import sweetalert2, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { ErrorDialogContent } from '../../components/Errors/ErrorDialogContent'

const swalReact = withReactContent(sweetalert2)

const dialogDelayInMs = 1100

export class DialogMessages {
  public static async showErrorMessage(error: any, showDiagnostics: boolean = false): Promise<void> {
    await swalReact.fire({
      icon:'error',
      title: 'Error',
      html: <ErrorDialogContent error={ error } showDiagnostics= { showDiagnostics } />,
    })
  }

  public static async areYouSureDeleteDialog(): Promise<SweetAlertResult> {
    return await sweetalert2.fire({
      title: 'Estas Seguro?',
      text: 'No vas a poder revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrar!',
    })
  }

  public static async yesNoDialog(title: string, text: string): Promise<SweetAlertResult> {
    return await sweetalert2.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
    })
  }

  public static async stringInputDialog(title: string, text: string, initialInputValue: string | undefined): Promise<SweetAlertResult> {
    return await sweetalert2.fire({
      title,
      text,
      input:'text',
      inputValue: initialInputValue,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
    })
  }

  public static async simpleNotificationDialog(title: string, typeIcon: SweetAlertIcon, text: string, showConfirmButton: boolean = false) {
    await sweetalert2.fire({
      title: title,
      icon: typeIcon,
      text: text,
      showConfirmButton: showConfirmButton,
      timer: !showConfirmButton ? dialogDelayInMs : undefined,
    })
  }
}
