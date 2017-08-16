import {OpAExpr} from "src/expr/OpAExpr";

export class AtanExpr extends OpAExpr {
  execute(index: number) {
    return Math.atan(this._exprA.execute(index))
  }
}
