import Dexie from 'dexie'
import { Theme } from '../theme/ThemeUtils'
import { Log } from '../logging/Log'
import { EnumValue } from '../DataTypes'

export type TableType = 'ReactTable' | 'OfficeUIFabric'
export const TableType = {
  ReactTable: new EnumValue<TableType>('ReactTable'),
  OfficeUIFabric: new EnumValue<TableType>('OfficeUIFabric'),
}

export interface IAppSettings {
  id?: number
  theme: Theme
}

const defaultSettings: IAppSettings = {
  id: 0,
  theme: Theme.Light.databaseValue,
}

let initialSettings: IAppSettings
export async function initializeSettings(): Promise<IAppSettings> {
  let initialSettingsTemp = await settingsDatabase.appSettings.get(0)

  if (!initialSettingsTemp) {
    initialSettingsTemp = defaultSettings
    Log.logger.info('Adding default settings row')
    await settingsDatabase.appSettings.add(defaultSettings)
  }

  initialSettings = initialSettingsTemp
  return initialSettings
}

export function getInitialAppSettings(): IAppSettings {
  return initialSettings
}

class SettingsDatabase extends Dexie {
  appSettings: Dexie.Table<IAppSettings, number> // number = type of the primkey
  constructor () {
    super('SettingsDatabase')
    this.version(1).stores({
      appSettings: '++id, theme',
      // other tables go here...
    })

    // Migration to V2
    this.version(2).stores({
      appSettings: '++id,theme,tableType'
    }).upgrade(trans => {
      const db = trans.db as SettingsDatabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return db.appSettings.toCollection().modify((row: any) => {
        row.tableType = TableType.ReactTable.databaseValue
      })
    })

    // Migration to V3
    this.version(3).stores({
      appSettings: '++id,theme'
    }).upgrade(trans => {
      const db = trans.db as SettingsDatabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return db.appSettings.toCollection().modify((row: any) => {
        delete row.tableType
      })
    })

    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.appSettings = this.table('appSettings')
  }
}

export const settingsDatabase = new SettingsDatabase()
