import {RangeExpr} from "src/expr/RangeExpr";
import {ExprEnv} from "src/exprEnv";

export class StdExpr extends RangeExpr {
  private _stdBuf = [];

  calcResult(index: number, resultA: number) {
    if (this._range == 0)
      return NaN;
    var stdData = this._stdBuf[index];
    var first = ExprEnv.get().getFirstIndex()
    if (first < 0) {
      stdData.resultMA = resultA;
      return 0.0;
    }
    if (index > first) {
      var n = this._range;
      if (n >= index + 1 - first) {
        n = index + 1 - first;
        stdData.resultMA = this._stdBuf[index - 1].resultMA * (1.0 - 1.0 / n) + (resultA / n);
      } else {
        stdData.resultMA = this._stdBuf[index - 1].resultMA + (resultA - this._buf[index - n].resultA) / n;
      }
      var sum = 0;
      for (var i = index - n + 1; i <= index; i++)
        sum += Math.pow(this._buf[i].resultA - stdData.resultMA, 2);
      return Math.sqrt(sum / n);
    }
    stdData.resultMA = resultA;
    return 0.0;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      for (var c = count; c > 0; c--)
        this._stdBuf.push({resultMA: NaN});
    }
    super.reserve(rid, count);
  }

  clear() {
    super.clear()
    this._stdBuf = [];
  }
}
