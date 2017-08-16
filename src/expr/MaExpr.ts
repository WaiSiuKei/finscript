import {RangeExpr} from "src/expr/RangeExpr";
import {ExprEnv} from "src/exprEnv";

export class MaExpr extends RangeExpr {
  calcResult(index: number, resultA: number) {
    if (this._range == 0)
      return NaN;
    var first = ExprEnv.get().getFirstIndex();
    if (first < 0)
      return resultA;
    if (index > first) {
      var n = this._range;
      if (n >= index + 1 - first) {
        n = index + 1 - first;
        return this._buf[index - 1].result * (1.0 - 1.0 / n) + (resultA / n);
      }
      return this._buf[index - 1].result + (resultA - this._buf[index - n].resultA) / n;
    } else {
      return resultA;
    }
  }
}
