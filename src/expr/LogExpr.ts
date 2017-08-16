import {OpAExpr} from "src/expr/OpAExpr";

export class LogExpr extends OpAExpr {
  execute(index: number) {
    return Math.log10(this._exprA.execute(index))
  }
}
