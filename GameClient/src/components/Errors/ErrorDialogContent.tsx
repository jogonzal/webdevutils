import { DefaultButton, Link, TextField } from '@fluentui/react'
import { Text } from '@fluentui/react/lib/Text'
import * as React from 'react'

import { ApiError } from '../../shared/ApiError'
import { getCurrentMetadata, getCurrentUser } from '../../shared/getCurrentUser'
import { getErrorAsString } from '../../shared/logging/getErrorAsString'
import { Log } from '../../shared/logging/Log'
import { MessageError } from '../../shared/MessageError'
import { VerticalStack } from '../Stacks/VerticalStack'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
  showDiagnostics: boolean
}

type State = {
  showDiagnostics: boolean
  userMessage: string
}

export class ErrorDialogContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showDiagnostics: this.props.showDiagnostics,
      userMessage: '',
    }
  }

  render() {
    const error = this.props.error

    let errorDescription = 'Un error inesperado ocurrio!'
    let errorDiagnostics = `UserId: ${Log.logger.insights?.context.user.id}\n`
    errorDiagnostics += `SessionId: ${Log.logger.insights?.context.sessionManager.automaticSession.id}\n`
    if (ApiError.isApiError(error)) {
      errorDescription = 'Un error inesperado ocurrio al llamar una de nuestras APIs!'

      // Add API error specific diagnostic information
      errorDiagnostics += `RequestDescription: ${error.requestDescription}\n`
      errorDiagnostics += `ErrorStatusCode: ${error.statusCode}\n`
      errorDiagnostics += `ErrorMessage: ${error.message}\n`

      // Generic error descriptions (based on response code)
      if (error.statusCode === 404) {
        errorDescription = 'Clave no encontrada - esta clave no existe.'
      } else if (error.statusCode === 401 || error.statusCode === 403) {
        errorDescription = 'Error de permisos.'
      }

      // Specific error descriptions (based on restApiError)
      if (error.restApiError) {
        if (error.restApiError.ErrorMessage) {
          // If a message is specified, append it to error description
          errorDescription += ' ' + error.restApiError.ErrorMessage
        }

        // RestAPI error diagnostic information
        errorDiagnostics += `RestApiErrorCode: ${error.restApiError.ErrorCode}\n`
        errorDiagnostics += `RestApiErrorMessage: ${error.restApiError.ErrorMessage}\n`
        // errorDiagnostics += `RestApiFullErrorMessage: ${error.restApiError.FullErrorMessage}\n`
        errorDiagnostics += `RestApiExceptionType: ${error.restApiError.ExceptionType}\n`
        // errorDiagnostics += `RestApiInternalErrorMessage: ${error.restApiError.InternalErrorMessage}\n`

        // SQL errors
        if (error.restApiError.ErrorCode === '-2146232060' && error.restApiError.InternalErrorMessage !== undefined) {
          if (error.restApiError.InternalErrorMessage.indexOf('duplicate key') !== -1) {
            errorDescription = 'La clave que has especificado ya existe y por lo tanto no puede ser creada.'
          } else if (error.restApiError.InternalErrorMessage.indexOf('FOREIGN KEY') !== -1) {
            errorDescription = 'La clave de algun campo que especificaste no existe.'
          } else if (error.restApiError.InternalErrorMessage.indexOf('the REFERENCE constraint "FK_') !== -1) {
            errorDescription = 'La acción que tomaste afecta a otras tablas dependientes, por lo tanto no se puede completar.'
          }
        }
      }

      if (error.oDataError) {
        // OData error diagnostic information
        errorDiagnostics += `ODataErrorCode: ${error.oDataError.code}\n`
        errorDiagnostics += `ODataErrorMessage: ${error.oDataError.message}\n`
        errorDiagnostics += `ODataInnerError: ${JSON.stringify(error.oDataError.innererror)}\n`
      }
    } else if (MessageError.isMessageError(error)) {
      errorDescription = error.message
    } else {
      if (error.message) {
        errorDescription += `\n${error.message}`
      }

      // Here, we don't know anything about the error :(
      errorDiagnostics = getErrorAsString(error)
    }

    let hideShowString: string
    if (this.state.showDiagnostics) {
      hideShowString = 'Esconder detalles'
    } else {
      hideShowString = 'Ver detalles'
    }

    return (
      <VerticalStack>
        <Text variant='large'>{ errorDescription } <Link onClick={ () => this.setState({ showDiagnostics: !this.state.showDiagnostics }) }> { hideShowString }</Link></Text>
        { this.renderDetalles(errorDiagnostics, errorDescription) }
      </VerticalStack>
    )
  }

  reportError = (errorDiagnostics: string, errorDescription: string) => {
    return () => {
      const currentMetadata = getCurrentMetadata()
      const currentUserName = getCurrentUser()?.UsuarioNombre
      const emailTarget = 'support@dinlabel.com'
      const subject = 'Reporte de error en WebSocketGame'
      const content = `Vi este error: ${errorDescription}\n\nMensaje de usuario:${this.state.userMessage}\n\nMás detalles sobre el error:\n${errorDiagnostics}\n\nAtentamente, ${currentUserName}\n`
      const mailtoLink = `mailto:${encodeURIComponent(emailTarget)}?cc=${encodeURIComponent(currentMetadata.Email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`
      window.open(mailtoLink)
    }
  }

  renderDetalles = (errorDiagnostics: string, errorDescription: string) => {
    if (!this.state.showDiagnostics) {
      return null
    }

    return (
      <>
        <TextField
          multiline={ true }
          autoAdjustHeight={ true }
          readOnly={ true }
          value={ errorDiagnostics } />
        <TextField
          placeholder='Puede incluir in mensaje aqui...'
          value={ this.state.userMessage }
          onChange={ (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, content?: string) => this.setState({ userMessage: content ?? '' }) }
          multiline={ true }
          rows={ 3 } />
        <DefaultButton onClick={ this.reportError(errorDiagnostics, errorDescription) }>Reportar error</DefaultButton>
      </>
    )
  }
}
