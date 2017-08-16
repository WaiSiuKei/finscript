import {OpAExpr} from "src/expr/OpAExpr";

export class SqrtExpr extends OpAExpr {
  execute(index: number) {
    return Math.sqrt(this._exprA.execute(index))
  }
}
