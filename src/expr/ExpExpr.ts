import {OpAExpr} from "src/expr/OpAExpr";

export class ExpExpr extends OpAExpr {
  execute(index: number) {
    return Math.exp(this._exprA.execute(index))
  }
}
