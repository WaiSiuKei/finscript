import {OpAExpr} from "src/expr/OpAExpr";

export class CeilExpr extends OpAExpr {
  execute(index: number) {
    return Math.ceil(this._exprA.execute(index))
  }
}
