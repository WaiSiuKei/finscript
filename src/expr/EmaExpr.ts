import {RangeExpr} from "src/expr/RangeExpr";
import {ExprEnv} from "src/exprEnv";

export class EmaExpr extends RangeExpr {
  protected _alpha: number;

  initRange() {
    super.initRange();
    this._alpha = 2.0 / (this._range + 1);
  }

  calcResult(index: number, resultA: number) {
    if (this._range == 0)
      return NaN;
    var first = ExprEnv.get().getFirstIndex();
    if (first < 0)
      return resultA;
    if (index > first) {
      var prev = this._buf[index - 1];
      return this._alpha * (resultA - prev.result) + prev.result;
    }
    return resultA;
  }
}
