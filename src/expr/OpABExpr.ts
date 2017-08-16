import {Expr} from "src/expr/Expr";

export abstract class OpABExpr extends Expr {
  protected _exprA: Expr;
  protected _exprB: Expr;

  constructor(a: Expr, b: Expr) {
    super()
    this._exprA = a;
    this._exprB = b;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      this._rid = rid;
      this._exprA.reserve(rid, count);
      this._exprB.reserve(rid, count);
    }
  }

  clear() {
    this._exprA.clear();
    this._exprB.clear();
  }
}
