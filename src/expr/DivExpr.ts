import {OpABExpr} from "src/expr/OpABExpr";

export class DivExpr extends OpABExpr {
  execute(index: number) {
    var a = this._exprA.execute(index);
    var b = this._exprB.execute(index);
    if (a == 0)
      return a;
    if (b == 0)
      return (a > 0) ? 1e7 : -1e7;
    return a / b;
  }
}
