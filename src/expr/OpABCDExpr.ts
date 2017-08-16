import {Expr} from "src/expr/Expr";

export abstract class OpABCDExpr extends Expr {
  protected _exprA: Expr;
  protected _exprB: Expr;
  protected _exprC: Expr;
  protected _exprD: Expr;

  constructor(a: Expr, b: Expr, c: Expr, d: Expr) {
    super()
    this._exprA = a;
    this._exprB = b;
    this._exprC = c;
    this._exprD = d;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      this._rid = rid;
      this._exprA.reserve(rid, count);
      this._exprB.reserve(rid, count);
      this._exprC.reserve(rid, count);
      this._exprD.reserve(rid, count);
    }
  }

  clear() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear();
    this._exprD.clear();
  }
}
