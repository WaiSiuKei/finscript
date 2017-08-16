import {ExprEnv} from "src/exprEnv";
import {RangeExpr} from "src/expr/RangeExpr";

export class CountExpr extends RangeExpr {
  calcResult(index: number, resultA: number) {
    if (this._range == 0)
      return NaN;
    var first = ExprEnv.get().getFirstIndex();
    if (first < 0)
      return 0;
    if (index >= first) {
      var n = this._range - 1;
      if (n > index - first)
        n = index - first;
      var count = 0;
      for (; n >= 0; n--) {
        if (this._buf[index - n].resultA != 0.0)
          count++;
      }
      return count;
    } else {
      return 0;
    }
  }
}
