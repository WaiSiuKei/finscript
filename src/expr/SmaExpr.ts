import {RangeExpr} from "src/expr/RangeExpr";
import {Expr} from "src/expr/Expr";
import {ExprEnv} from "src/exprEnv";

export class SmaExpr extends RangeExpr {
  private _exprC: Expr
  private _mul: number;

  constructor(a: Expr, b: Expr, c: Expr) {
    super(a, b,)
    this._exprC = c;
  }

  initRange() {
    super.initRange()
    this._mul = this._exprC.execute(0);
  }

  calcResult(index, resultA) {
    if (this._range == 0)
      return NaN;
    var first = ExprEnv.get().getFirstIndex();
    if (first < 0)
      return resultA;
    if (index > first) {
      var n = this._range;
      if (n > index + 1 - first)
        n = index + 1 - first;
      return ((n - 1) * this._buf[index - 1].result + resultA * this._mul) / n;
    }
    return resultA;
  }
}
