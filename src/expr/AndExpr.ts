import {OpABExpr} from "src/expr/OpABExpr";

export class AndExpr extends OpABExpr {
  execute(index: number) {
    return (this._exprA.execute(index) != 0) && (this._exprB.execute(index) != 0) ? 1 : 0;
  }
}
