import {Expr} from "src/expr/Expr";

export class ParameterExpr extends Expr {
  private _name: string;
  private _minValue: number;
  private _maxValue: number;
  private _defaultValue: number;
  private _value: number;

  constructor(name: string, minValue: number, maxValue: number, defaultValue: number) {
    super()
    this._name = name;
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._value = this._defaultValue = defaultValue;
  }

  execute(index: number) {
    return this._value;
  }

  getMinValue() {
    return this._minValue;
  }

  getMaxValue() {
    return this._maxValue;
  }

  getDefaultValue() {
    return this._defaultValue;
  }

  getValue() {
    return this._value;
  }

  setValue(v) {
    if (v == 0)
      this._value = 0;
    else if (v < this._minValue)
      this._value = this._minValue;
    else if (v > this._maxValue)
      this._value = this._maxValue;
    else
      this._value = v;
  }
}
