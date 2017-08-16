import {OpAExpr} from "./OpAExpr";
import {ExprEnv} from "../exprEnv";
import {Expr} from "./Expr";

export class AssignExpr extends OpAExpr {
  protected _name: string;
  public _buf: number[];

  constructor(name: string, a: Expr) {
    super(a)
    this._name = name;
    this._buf = [];
  }

  execute(index: number) {
    if (!this._buf[index] || isNaN(this._buf[index])) this.assign(index)
    return this._buf[index];
  }

  getName() {
    return this._name
  }

  assign(index: number) {
    this._buf[index] = this._exprA.execute(index);
    if (ExprEnv.get().getFirstIndex() >= 0)
      if (isNaN(this._buf[index]) && !isNaN(this._buf[index - 1]))
        throw this._name + ".assign(" + index + "): NaN";
  }

  reserve(rid: number, count: number) {
    if (this._rid < rid) {
      for (var c = count; c > 0; c--) {
        this._buf.push(NaN);
      }
    }
    super.reserve(rid, count);
  }

  clear() {
    super.clear()
    this._buf = [];
  }
}
