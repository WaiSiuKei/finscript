import {DataSource} from "src/dataSource";

export class ExprEnv {
  private _ds: DataSource;
  private _firstIndex: number;

  static inst: ExprEnv;

  constructor() {

  }

  static get() {
    return ExprEnv.inst;
  }

  static set(env) {
    ExprEnv.inst = env
  }

  getDataSource(): DataSource {
    return this._ds;
  }

  setDataSource(ds: DataSource) {
    this._ds = ds;
  }

  getFirstIndex(): number {
    return this._firstIndex;
  }

  setFirstIndex(n: number) {
    this._firstIndex = n
  }
}
