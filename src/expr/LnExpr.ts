import {OpAExpr} from "src/expr/OpAExpr";

export class LnExpr extends OpAExpr {
  execute(index: number) {
    return Math.log(this._exprA.execute(index))
  }
}
