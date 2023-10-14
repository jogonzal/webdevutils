import { SistemaModel } from '../models/SistemaModel'
import { UsuarioModel } from '../models/UsuarioModel'
import { shouldMockApis } from './utils/shouldMockApis'

// eslint-disable-next-line no-underscore-dangle
declare const __cloudUser__: UsuarioModel
export function getCurrentUser(): UsuarioModel | undefined {
  if (shouldMockApis()) {
    return {
      UsuarioClave:'email@gmail.com',
      UsuarioNombre:'MockNombre1',
      UsuarioAccesoAdmin:true,
      UsuarioLenguage: 'es-mx',
      LastModifiedByUser:'3',
      LastModifiedTime:'2010-10-10T00:00:00',
    }
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (__cloudUser__ && !__cloudUser__.UsuarioLenguage) {
    __cloudUser__.UsuarioLenguage = 'es-mx' // Default to ESMX
  }
  return __cloudUser__
}

interface IMetadata {
  Email: string
}

// eslint-disable-next-line no-underscore-dangle
declare const __cloudMetadata__: IMetadata
export function getCurrentMetadata(): IMetadata {
  if (shouldMockApis()) {
    return {
      Email: 'MOCKEMAIL',
    }
  }
  return __cloudMetadata__
}

// eslint-disable-next-line no-underscore-dangle
declare const __sistema__: SistemaModel | undefined
export function getCurrentSistema(): SistemaModel | undefined {
  if (shouldMockApis()) {
    return {
      SistemaClave: 1,
      SistemaNombreEmpresa: 'TEST',
    }
  }
  return __sistema__
}
