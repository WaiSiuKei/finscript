import {EmaExpr} from "src/expr/EmaExpr";
import {ExprEnv} from "src/exprEnv";

export class ExpmemaExpr extends EmaExpr {

  calcResult(index, resultA) {
    var first = ExprEnv.get().getFirstIndex()
    if (first < 0)
      return resultA;
    if (index > first) {
      var n = this._range;
      var prev = this._buf[index - 1];
      if (n >= index + 1 - first) {
        n = index + 1 - first;
        return prev.result * (1.0 - 1.0 / n) + (resultA / n);
      }
      return this._alpha * (resultA - prev.result) + prev.result;
    }
    return resultA;
  }
}
