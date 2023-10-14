export type EnumValueType = string | number

export class EnumValue<TDatabaseValueType extends EnumValueType> {
  public readonly databaseValue: TDatabaseValueType
  public readonly niceDisplayString?: string
  constructor(databaseValue: TDatabaseValueType, niceDisplayString?: string) {
    this.databaseValue = databaseValue
    this.niceDisplayString = niceDisplayString
  }
}

export type EnumClass<TDatabaseValue extends EnumValueType> = {[ key: string ]: EnumValue<TDatabaseValue>}

export function lookupEnumString<TDatabaseValue extends EnumValueType>(enumList: EnumClass<TDatabaseValue>, value: TDatabaseValue | undefined): string | undefined {
  if (value === undefined) {
    return 'VALOR INVALIDO'
  }
  for (const key of Object.keys(enumList)) {
    const enumObj = enumList[key]
    if (enumObj.databaseValue === value) {
      return enumObj.niceDisplayString ?? enumObj.databaseValue.toString()
    }
  }

  return undefined
}
