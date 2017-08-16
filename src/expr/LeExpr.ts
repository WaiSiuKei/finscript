import {OpABExpr} from "src/expr/OpABExpr";

export class LeExpr extends OpABExpr {

  execute(index) {
    return this._exprA.execute(index) <= this._exprB.execute(index) ? 1 : 0;
  }
}
