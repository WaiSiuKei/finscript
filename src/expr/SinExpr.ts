import {OpAExpr} from "src/expr/OpAExpr";

export class SinExpr extends OpAExpr {
  execute(index: number) {
    return Math.sin(this._exprA.execute(index))
  }
}
