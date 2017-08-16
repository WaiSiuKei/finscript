import {OpABExpr} from "src/expr/OpABExpr";

export class EqExpr extends OpABExpr {

  execute(index) {
    return this._exprA.execute(index) == this._exprB.execute(index) ? 1 : 0;
  }
}
