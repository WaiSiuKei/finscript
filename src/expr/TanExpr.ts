import {OpAExpr} from "src/expr/OpAExpr";

export class TanExpr extends OpAExpr {
  execute(index: number) {
    return Math.tan(this._exprA.execute(index))
  }
}
