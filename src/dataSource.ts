
export interface IDataPoint {
  [key: string]: number
}

export class DataSource {
  protected _dataItems: IDataPoint[];

  constructor(data: IDataPoint[]) {
    this._dataItems = data
  }

  getDataCount() {
    return this._dataItems.length;
  }

  getDataAt(index) {
    return this._dataItems[index];
  }

  toString() {
    return JSON.stringify(this._dataItems)
    // return String(this._dataItems);
  }
}
