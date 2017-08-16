import {OpAExpr} from "src/expr/OpAExpr";

export class NegExpr extends OpAExpr {

  execute(index) {
    return -(this._exprA.execute(index));
  }
}
