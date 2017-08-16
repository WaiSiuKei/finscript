import { size } from 'lodash'
import { BuiltInFunction, MemberMethod } from "src/function";
import { ExpressionContext } from "gen/FinscriptParser";
import { ObjectLiteral, ReturnValue } from "src/value";
import { EvalVisitor } from "src/visitor";
import { PrimaryValue } from "src/base";

// Static methods
export class ParseInt extends BuiltInFunction {
  static ID = 'parseInt'

  constructor() {
    super(ParseInt.ID)
  }

  public invoke(params: ExpressionContext[], functions, scope) {
    if (!size(params)) return new ReturnValue()
    const evalVisitor = new EvalVisitor(scope, functions);
    const string = evalVisitor.visit(params[0]).value;
    const radix = size(params) > 1 ? evalVisitor.visit(params[1]).value : 10
    return new PrimaryValue(Number.parseInt(string, radix))
  }
}

export class ParseFloat extends BuiltInFunction {
  static ID = 'parseFloat'

  constructor() {
    super(ParseFloat.ID)
  }

  public invoke(params: ExpressionContext[], functions, scope) {
    if (!size(params)) return new ReturnValue()
    const evalVisitor = new EvalVisitor(scope, functions);
    const string = evalVisitor.visit(params[0]).value;
    return new PrimaryValue(Number.parseFloat(string))
  }
}

// Prototype methods
export class ToExponential extends MemberMethod {
  static ID = 'toExponential'

  constructor() {
    super(ToExponential.ID)
  }

  public invoke(params: ExpressionContext[], functions, scope) {
    if (!size(params)) return new ReturnValue()
    const evalVisitor = new EvalVisitor(scope, functions);
    const fractionDigits = size(params) ? evalVisitor.visit(params[0]).value : undefined;
    return new PrimaryValue(this.context.value.toExponential(fractionDigits))
  }
}

export class ToFixed extends MemberMethod {
  static ID = 'toFixed'

  constructor() {
    super(ToFixed.ID)
  }

  public invoke(params: ExpressionContext[], functions, scope) {
    if (!size(params)) return new ReturnValue()
    const evalVisitor = new EvalVisitor(scope, functions);
    const digits = size(params) ? evalVisitor.visit(params[0]).value : undefined;
    return new PrimaryValue(this.context.value.toExponential(digits))
  }
}

export class ToPrecision extends MemberMethod {
  static ID = 'toPrecision'

  constructor() {
    super(ToPrecision.ID)
  }

  public invoke(params: ExpressionContext[], functions, scope) {
    if (!size(params)) return new ReturnValue()
    const evalVisitor = new EvalVisitor(scope, functions);
    const precision = size(params) ? evalVisitor.visit(params[0]).value : undefined;
    return new PrimaryValue(this.context.value.toExponential(precision))
  }
}

export const number = new ObjectLiteral()
const prototype = new ObjectLiteral()

number.assign(ParseInt.ID, new ParseInt())
number.assign(ParseFloat.ID, new ParseFloat())

prototype.assign(ToExponential.ID, new ToExponential())
prototype.assign(ToFixed.ID, new ToFixed())
prototype.assign(ToPrecision.ID, new ToPrecision())

export class NumberLiteral extends PrimaryValue {
  equals(o) {
    if (this == o) return true;
    if (this.type != o.type) return false;

    let diff = Math.abs(this.value - o.value);
    return diff < 0.00000000001;
  }

  static createInstance(val) {
    let instance = new NumberLiteral(val)
    instance.prototype = prototype
    return instance
  }
}
