import {OpABExpr} from "src/expr/OpABExpr";

export abstract class RangeExpr extends OpABExpr {
  protected _buf: Array<{ result: number; resultA: number }>
  protected _range: number;

  constructor(a, b) {
    super(a, b)
    this._range = -1;
    this._buf = [];
  }

  abstract calcResult(index: number, ra: number)

  execute(index: number) {
    if (this._range < 0)
      this.initRange();
    var rA = this._buf[index].resultA = this._exprA.execute(index);
    var r = this._buf[index].result = this.calcResult(index, rA);
    return r;
  }

  getRange() {
    return this._range;
  }

  initRange() {
    this._range = this._exprB.execute(0);
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      for (let c = count; c > 0; c--)
        this._buf.push({resultA: NaN, result: NaN});
    }
    super.reserve(rid, count);
  }

  clear() {
    super.clear()
    this._range = -1;
    this._buf = [];
  }
}
