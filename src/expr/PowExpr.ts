import {OpABExpr} from "src/expr/OpABExpr";

export class PowExpr extends OpABExpr {
  execute(index: number) {
    return Math.pow(this._exprA.execute(index), this._exprB.execute(index))
  }
}
