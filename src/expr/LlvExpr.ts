import {RangeExpr} from "src/expr/RangeExpr";
import {ExprEnv} from "src/exprEnv";

export class LlvExpr extends RangeExpr {
  calcResult(index: number, resultA: number) {
    if (this._range == 0)
      return NaN;
    var first = ExprEnv.get().getFirstIndex()
    if (first < 0)
      return resultA;
    if (index > first) {
      var n = this._range;
      var result = resultA;
      var start = index - n + 1;
      var i = Math.max(first, start);
      for (; i < index; i++) {
        var p = this._buf[i];
        if (result > p.resultA)
          result = p.resultA;
      }
      return result;
    } else {
      return resultA;
    }
  }
}
