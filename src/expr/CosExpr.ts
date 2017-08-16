import {OpAExpr} from "src/expr/OpAExpr";

export class CosExpr extends OpAExpr {
  execute(index: number) {
    return Math.cos(this._exprA.execute(index))
  }
}
