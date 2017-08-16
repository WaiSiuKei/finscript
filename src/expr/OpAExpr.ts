import {Expr} from "src/expr/Expr";

export abstract class OpAExpr extends Expr {
  protected _exprA: Expr;


  constructor(a: Expr) {
    super()
    this._exprA = a;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      this._rid = rid;
      this._exprA.reserve(rid, count);
    }
  }

  clear() {
    this._exprA.clear();
  }
}
