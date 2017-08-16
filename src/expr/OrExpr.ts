import {OpABExpr} from "src/expr/OpABExpr";

export class OrExpr extends OpABExpr {

  execute(index) {
    return (this._exprA.execute(index) != 0) || (this._exprB.execute(index) != 0) ? 1 : 0;
  }
}
