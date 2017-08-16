import { ParseTree, TerminalNode } from "antlr4ts/tree";
import { BlockContext, ExpressionContext } from "gen/FinscriptParser";
import { Scope } from "src/scope";
import { size } from 'lodash'
import { EvalVisitor } from "src/visitor";
import { IScopedSymbol } from "src/symbol";
import InstanceOf = Chai.InstanceOf;
import { EvalException } from "src/exception";
import { IFunction, PrimaryValue } from "src/base";

export abstract class BaseFunction extends PrimaryValue implements IFunction {
  constructor(protected id) {
    super()
    this.type = 'function'
  }

  public abstract invoke(params: ExpressionContext[], functions: Map<String, UserFunction>, scope: Scope)
}

export class UserFunction extends BaseFunction implements IFunction, IScopedSymbol {
  protected id: string;
  protected params: TerminalNode[];
  protected block: ParseTree;
  public scope: Scope;

  constructor(id, params, block, scope) {
    super(id)
    this.id = id;
    this.params = params;
    this.block = block;
    this.scope = scope.createChild()
  }

  public invoke(params: ExpressionContext[], functions: Map<String, IFunction>, scope: Scope) {
    if (size(params) != size(this.params)) {
      throw new Error("Illegal UserFunction call");
    }
    scope = new Scope(scope); // create function scope
    const evalVisitor = new EvalVisitor(scope, functions);
    this.params.forEach((p, i) => {
      const value = evalVisitor.visit(params[i]);
      scope.assignParam(this.params[i].text, value);
    })
    return evalVisitor.visit(this.block);
  }

  public toString() {
    return `() => ${this.block.text}`
  }
}

export class ArrowFunction extends UserFunction {
  public invoke(params: ExpressionContext[], functions: Map<String, IFunction>, scope: Scope) {
    if (size(params) != size(this.params)) {
      throw new Error("Illegal UserFunction call");
    }
    scope = new Scope(scope); // create function scope
    const evalVisitor = new EvalVisitor(scope, functions);
    this.params.forEach((p, i) => {
      const value = evalVisitor.visit(params[i]);
      scope.assignParam(this.params[i].text, value);
    })
    return evalVisitor.visit(this.block);
  }
}

export abstract class BuiltInFunction extends BaseFunction {
  public toString() {
    return 'def func() { [builtin code] }'
  }
}

export abstract class MemberMethod extends BuiltInFunction {
  protected context: PrimaryValue;

  public bind(context) {
    this.context = context
  }
}
