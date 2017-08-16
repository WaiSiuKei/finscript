import {OpAExpr} from "src/expr/OpAExpr";

export class FloorExpr extends OpAExpr {
  execute(index: number) {
    return Math.floor(this._exprA.execute(index))
  }
}
