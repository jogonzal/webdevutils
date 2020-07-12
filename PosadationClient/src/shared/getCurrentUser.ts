import { Empresa } from '../components/MyAccount'
import { UsuarioModel } from '../models/UsuarioModel'
import { SistemaModel } from '../models/SistemaModel'
import { shouldMockApis } from './utils/shouldMockApis'

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
  if (__cloudUser__ && !__cloudUser__.UsuarioLenguage) {
    __cloudUser__.UsuarioLenguage = 'es-mx' // Default to ESMX
  }
  return __cloudUser__
}

interface IMetadata {
  Empresa: Empresa
  Email: string
}

declare const __cloudMetadata__: IMetadata
export function getCurrentMetadata(): IMetadata {
  if (shouldMockApis()) {
    return {
      Empresa: 'Test',
      Email: 'MOCKEMAIL',
    }
  }
  return __cloudMetadata__
}

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


const agenteLocalStorageKey = 'AgenteOverride'
export function getCurrentAgenteOverride(): number | undefined {
  const sContent = localStorage.getItem(agenteLocalStorageKey)
  if (!sContent) {
    return undefined
  }
  return parseInt(sContent, 10)
}

export function setAgenteOverride(agenteNumber: number) {
  localStorage.setItem(agenteLocalStorageKey, agenteNumber?.toString())
}

export function clearAgenteOverride() {
  localStorage.removeItem(agenteLocalStorageKey)
}
