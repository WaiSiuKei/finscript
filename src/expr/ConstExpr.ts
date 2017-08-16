import {Expr} from "src/expr/Expr";

export class ConstExpr extends Expr {
  _value: number;

  constructor(v: number) {
    super()
    this._value = v;
  }

  execute(index: number) {
    return this._value;
  }
}
