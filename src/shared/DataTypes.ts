type EnumValueType = string | number;

export class EnumValue<TDatabaseValueType extends EnumValueType> {
  public readonly databaseValue: TDatabaseValueType;
  public readonly niceDisplayString?: string;
  constructor(databaseValue: TDatabaseValueType, niceDisplayString?: string) {
    this.databaseValue = databaseValue;
    this.niceDisplayString = niceDisplayString;
  }
}
