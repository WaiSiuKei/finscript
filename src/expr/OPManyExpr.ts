import {Expr} from "src/expr/Expr";

export abstract class OPManyExpr extends Expr {
  protected _exprs: Expr[]

  constructor(...exprs) {
    super()
    this._exprs = exprs
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      this._rid = rid;
      this._exprs.forEach(e => e.reserve(rid, count))
    }
  }

  clear() {
    this._exprs.forEach(e => e.clear())
  }
}
