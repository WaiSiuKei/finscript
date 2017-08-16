import {Expr} from "src/expr/Expr";

export abstract class OpABCExpr extends Expr {
  protected _exprA: Expr;
  protected _exprB: Expr;
  protected _exprC: Expr;

  constructor(a: Expr, b: Expr, c: Expr) {
    super()
    this._exprA = a;
    this._exprB = b;
    this._exprC = c;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      this._rid = rid;
      this._exprA.reserve(rid, count);
      this._exprB.reserve(rid, count);
      this._exprC.reserve(rid, count);
    }
  }

  clear() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear();
  }
}
