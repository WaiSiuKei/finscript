import {OpAExpr} from "src/expr/OpAExpr";

export class AbsExpr extends OpAExpr {
  execute(index: number) {
    return Math.abs(this._exprA.execute(index))
  }
}
