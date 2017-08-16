import { ExpressionContext } from "gen/FinscriptParser";
import { Scope } from "src/scope";
import { EvalVisitor } from "src/visitor";
import { BuiltInFunction } from "src/function";
import { IFunction, Null } from "src/base";

export class Log extends BuiltInFunction {
  static ID = 'log'

  constructor() {
    super(Log.ID)
  }

  public invoke(params: ExpressionContext[], functions: Map<String, IFunction>, scope: Scope) {
    let paramsToInvoke = []
    const evalVisitor = new EvalVisitor(scope, functions);
    params.forEach((p, i) => {
      const value = evalVisitor.visit(params[i]);
      paramsToInvoke.push(value)
    })
    console.log(paramsToInvoke)
    console.log(...paramsToInvoke.map(p => p.toString()))

    return Null
  }
}
