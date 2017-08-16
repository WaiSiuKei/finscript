import {OutputExpr} from "src/expr/OutputExpr";

export class RangeOutputExpr extends OutputExpr {
  getName() {
    return this._name + (<any>this._exprA).getRange();
  }
}
