import {OpAExpr} from "src/expr/OpAExpr";

export class RoundExpr extends OpAExpr {
  execute(index: number) {
    return Math.round(this._exprA.execute(index))
  }
}
