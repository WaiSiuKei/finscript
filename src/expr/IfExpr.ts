import {OpABCExpr} from "src/expr/OpABCExpr";

export class IfExpr extends OpABCExpr {
  execute(index) {
    return this._exprA.execute(index) != 0 ? this._exprB.execute(index) : this._exprC.execute(index);
  }
}
