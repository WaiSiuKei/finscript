import {OpABCDExpr} from "src/expr/OpABCDExpr";
import {ExprEnv} from "src/exprEnv";

export class SarExpr extends OpABCDExpr {
  private _buf = [];
  private _range = -1;
  private _min: number;
  private _step: number;
  private _max: number;

  execute(index: number) {
    if (this._range < 0) {
      this._range = this._exprA.execute(0);
      this._min = this._exprB.execute(0) / 100.0;
      this._step = this._exprC.execute(0) / 100.0;
      this._max = this._exprD.execute(0) / 100.0;
    }
    var data = this._buf[index] || {};
    var exprEnv = ExprEnv.get();
    var first = exprEnv.getFirstIndex();
    if (first < 0) {
      data.longPos = true;
      data.sar = exprEnv.getDataSource().getDataAt(index).low;
      data.ep = exprEnv.getDataSource().getDataAt(index).high;
      data.af = 0.02;
    } else {
      var high = exprEnv.getDataSource().getDataAt(index).high;
      var low = exprEnv.getDataSource().getDataAt(index).low;
      var prev = this._buf[index - 1];
      data.sar = prev.sar + prev.af * (prev.ep - prev.sar);
      if (prev.longPos) {
        data.longPos = true;
        if (high > prev.ep) {
          data.ep = high;
          data.af = Math.min(prev.af + this._step, this._max);
        } else {
          data.ep = prev.ep;
          data.af = prev.af;
        }
        if (data.sar > low) {
          data.longPos = false;
          var i = index - this._range + 1;
          for (i = Math.max(i, first); i < index; i++) {
            var h = exprEnv.getDataSource().getDataAt(i).high;
            if (high < h) high = h;
          }
          data.sar = high;
          data.ep = low;
          data.af = 0.02;
        }
      }
      else {
        data.longPos = false;
        if (low < prev.ep) {
          data.ep = low;
          data.af = Math.min(prev.af + this._step, this._max);
        } else {
          data.ep = prev.ep;
          data.af = prev.af;
        }
        if (data.sar < high) {
          data.longPos = true;
          var i = index - this._range + 1;
          for (i = Math.max(i, first); i < index; i++) {
            var l = exprEnv.getDataSource().getDataAt(i).low;
            if (low > l) low = l;
          }
          data.sar = low;
          data.ep = high;
          data.af = 0.02;
        }
      }
    }
    return data.sar;
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      for (var c = count; c > 0; c--)
        this._buf.push({longPos: true, sar: NaN, ep: NaN, af: NaN});
    }
    super.reserve(rid, count);
  }

  clear() {
    super.clear()
    this._range = -1;
  }
}
