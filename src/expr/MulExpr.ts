import {OpABExpr} from "src/expr/OpABExpr";

export class MulExpr extends OpABExpr {
  execute(index: number) {
    return this._exprA.execute(index) * this._exprB.execute(index);
  }
}
