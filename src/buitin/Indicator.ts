import { ExpressionContext } from "gen/FinscriptParser";
import { Scope } from "src/scope";
import { EvalVisitor } from "src/visitor";
import { Indicator } from "src/indicator/Indicator";
import { BuiltInFunction } from "src/function";
import { IFunction, Null } from "src/base";

export class Output extends BuiltInFunction {
  static ID = 'output'

  constructor() {
    super(Output.ID)
  }

  public invoke(params: ExpressionContext[], functions: Map<String, IFunction>, scope: Scope) {
    let paramsToInvoke = []
    let indicator = new Indicator()
    const evalVisitor = new EvalVisitor(scope, functions);
    params.forEach((p, i) => {
      const value = evalVisitor.visit(params[i]);
      paramsToInvoke.push(value)
    })

    console.log(...paramsToInvoke.map(p => p.toString()))

    return Null
  }
}
