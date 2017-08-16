import {OpABExpr} from "src/expr/OpABExpr";

export class RefExpr extends OpABExpr {
  private _offset = -1;

  execute(index: number) {
    if (this._offset < 0) {
      this._offset = this._exprB.execute(index);
      if (this._offset < 0)
        throw "offset < 0";
    }
    index -= this._offset;
    if (index < 0)
      throw "index < 0";
    var result = this._exprA.execute(index);
    if (isNaN(result))
      throw "NaN";
    return result;
  }
}
