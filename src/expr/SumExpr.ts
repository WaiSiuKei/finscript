import {RangeExpr} from "src/expr/RangeExpr";
import {ExprEnv} from "src/exprEnv";

export class SumExpr extends RangeExpr {
  calcResult(index: number, resultA: number) {
    var first = ExprEnv.get().getFirstIndex()
    if (first < 0)
      return resultA;
    if (index > first) {
      var n = this._range;
      if (n == 0 || n >= index + 1 - first) {
        return this._buf[index - 1].result + resultA;
      }
      return this._buf[index - 1].result + resultA - this._buf[index - n].resultA;
    } else {
      return resultA;
    }
  }
}
