import {AbstractParseTreeVisitor, ParseTree, TerminalNode} from "antlr4ts/tree";
import {FinscriptVisitor} from "gen/FinscriptVisitor";
import {ObjectLiteral, ReturnValue} from "src/value";
import {Scope} from "src/scope";
import {MemberMethod, UserFunction} from 'src/function'
import {
  DivideExpressionContext,
  ExpressionContext,
  FunctionCallExpressionContext,
  FunctionDeclContext,
  ListContext,
  MultiplyExpressionContext,
  NotExpressionContext,
  PowerExpressionContext,
  UnaryMinusExpressionContext,
  ListExpressionContext,
  ObjectLiteralContext,
  PropertyDefinitionListContext,
  PropertyDefinitionContext,
  ExprCallExpressionContext, PropertyContext, ArrowFunctionContext, ScriptContext,
} from "gen/FinscriptParser";
import {EvalException} from "src/exception";
import {ParserRuleContext} from "antlr4ts";
import {AssignmentContext} from "gen/FinscriptParser";
import {IdentifierFunctionCallContext} from "gen/FinscriptParser";
import {IfStatementContext} from "gen/FinscriptParser";
import {BlockContext} from "gen/FinscriptParser";
import {ForStatementContext} from "gen/FinscriptParser";
import {
  WhileStatementContext,
  ObjectLiteralExpressionContext,
  ArrowFunctionExpressionContext
} from "gen/FinscriptParser";
import {ConstExpr} from "src/expr/ConstExpr";
import {AddExpr} from "src/expr/AddExpr";
import {Expr} from "src/expr/Expr";
import {SubExpr} from "src/expr/SubExpr";
import {GeExpr} from "src/expr/GeExpr";
import {LeExpr} from "src/expr/LeExpr";
import {GtExpr} from "src/expr/GtExpr";
import {LtExpr} from "src/expr/LtExpr";
import {EqExpr} from "src/expr/EqExpr";
import {AndExpr} from "src/expr/AndExpr";
import {OrExpr} from "src/expr/OrExpr";
import {MulExpr} from "src/expr/MulExpr";
import {DivExpr} from "src/expr/DivExpr";
import {IfExpr} from "src/expr/IfExpr";
import {last} from 'lodash'
import {AssignExpr} from "src/expr/AssignExpr";
import {IFunction, Null, PrimaryValue} from "src/base";
import {ArrayLiteral} from "src/buitin/array";
import {NumberLiteral} from "src/buitin/number";
import {NegExpr} from "src/expr/NegExpr";
import {SarExpr} from "src/expr/SarExpr";

export enum EvalMode {
  Normal = 0,
  Expr = 1
}

export class EvalVisitor extends AbstractParseTreeVisitor<PrimaryValue> implements FinscriptVisitor<PrimaryValue> {
  defaultResult() {
    return Null
  }

  static returnValue = new ReturnValue();
  private scope: Scope;
  private functions: Map<String, IFunction>;
  private mode: EvalMode;

  constructor(scope, functions, mode = EvalMode.Normal) {
    super()
    this.scope = scope;
    this.functions = functions;
    this.mode = mode
  }

  public visitScript(ctx: ScriptContext) {
    if (ctx.block && ctx.block()) return this.visit(ctx.block())
    return Null
  }

  // functionDecl
  public visitFunctionDecl(ctx: FunctionDeclContext) {
    let functionName = ctx.Identifier().text
    let params: TerminalNode[] = ctx.idList() ? ctx.idList().Identifier() : [];
    let func = new UserFunction(functionName, params, ctx.block(), this.scope)
    this.functions.set(functionName, func)
    return Null;
  }

  // list: '[' exprList? ']'
  public visitList(ctx: ListContext) {
    let list = [];
    if (ctx.exprList() != null) {
      ctx.exprList().expression().forEach(ex => {
        list.push(this.visit(ex));
      })
    }
    return new ArrayLiteral(list);
  }

  // '-' expression                           #unaryMinusExpression
  public visitUnaryMinusExpression(ctx: UnaryMinusExpressionContext) {
    const v = this.visit(ctx.expression());
    if (v.type === 'number' && this.mode === EvalMode.Normal) return new PrimaryValue(-1 * v.value);
    if (v.type === 'number' && this.mode === EvalMode.Expr) return new NegExpr(new ConstExpr(-1 * v.value));
    if (v.type === 'expr') return new NegExpr(v as Expr)

    throw new EvalException(ctx);
  }

  // '!' expression                           #notExpression
  public visitNotExpression(ctx: NotExpressionContext) {
    let v = this.visit(ctx.expression());
    if (v.type !== 'boolean') {
      throw new EvalException(ctx);
    }
    return new PrimaryValue(!v);
  }

  // expression '^' expression                #powerExpression
  public visitPowerExpression(ctx: PowerExpressionContext) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (lhs.type === 'number' && rhs) {
      return new PrimaryValue(Math.pow(lhs.value, rhs.value));
    }
    throw new EvalException(ctx);
  }

  // expression '*' expression                #multiplyExpression
  public visitMultiplyExpression(ctx: MultiplyExpressionContext) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));

    if (this.mode === EvalMode.Normal) {
      // number * number
      if (lhs.type === 'number' && rhs.type === 'number') {
        return new PrimaryValue(lhs.value * rhs.value);
      }
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new MulExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new MulExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new MulExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new MulExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '/' expression                #divideExpression
  public visitDivideExpression(ctx: DivideExpressionContext) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') {
        return new PrimaryValue(lhs.value / rhs.value);
      }
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new DivExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new DivExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new DivExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new DivExpr(new ConstExpr(lhs.value), rhs as Expr)
    throw new EvalException(ctx);
  }

  // expression '%' expression                #modulusExpression
  public visitModulusExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (lhs.type === 'number' && rhs.type === 'number') {
      return new PrimaryValue(lhs.value % rhs.value);
    }
    throw new EvalException(ctx);
  }

  // expression '+' expression                #addExpression
  public visitAddExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));

    if (this.mode == EvalMode.Normal) {
      // number + number
      if (lhs.type === 'number' && rhs.type === 'number') {
        return new PrimaryValue(lhs.value + rhs.value);
      }

      // list + any
      if (lhs.type === 'array' && rhs.type === 'array') {
        return new PrimaryValue(lhs.value.concat(rhs.value));
      }

      // string + any
      if (lhs.type === 'string' && rhs.type === 'string') {
        return new PrimaryValue(lhs.value + rhs.value);
      }
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new AddExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new AddExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new AddExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new AddExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '-' expression                #subtractExpression
  public visitSubtractExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') {
        return new PrimaryValue(lhs.value - rhs.value);
      }
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new SubExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new SubExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new SubExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new SubExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '>=' expression               #gtEqExpression
  public visitGtEqExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') return new PrimaryValue(lhs.value >= rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new GeExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new GeExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new GeExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new GeExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '<=' expression               #ltEqExpression
  public visitLtEqExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') return new PrimaryValue(lhs.value <= rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new LeExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new LeExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new LeExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new LeExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '>' expression                #gtExpression
  public visitGtExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') return new PrimaryValue(lhs.value > rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new GtExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new GtExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new GtExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new GtExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '<' expression                #ltExpression
  public visitLtExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) {
      if (lhs.type === 'number' && rhs.type === 'number') return new PrimaryValue(lhs.value < rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new LtExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new LtExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new LtExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new LtExpr(new ConstExpr(lhs.value), rhs as Expr)

    throw new EvalException(ctx);
  }

  // expression '==' expression               #eqExpression
  public visitEqExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    if (this.mode === EvalMode.Normal) return new PrimaryValue(lhs.equals(rhs));
    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new EqExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new EqExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new EqExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new EqExpr(new ConstExpr(lhs.value), rhs as Expr)
    throw new EvalException(ctx);
  }

  // expression '!=' expression               #notEqExpression
  public visitNotEqExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));
    return new PrimaryValue(!lhs.equals(rhs));
  }

  // expression '&&' expression               #andExpression
  public visitAndExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));

    if (this.mode === EvalMode.Normal) {
      if (lhs.type !== 'boolean' || rhs.type !== 'boolean') {
        throw new EvalException(ctx);
      }
      return new PrimaryValue(lhs.value && rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new AndExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new AndExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new AndExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new AndExpr(new ConstExpr(lhs.value), rhs as Expr)
    throw new EvalException(ctx);
  }

  // expression '||' expression               #orExpression
  public visitOrExpression(ctx) {
    let lhs = this.visit(ctx.expression(0));
    let rhs = this.visit(ctx.expression(1));

    if (this.mode === EvalMode.Normal) {
      if (lhs.type !== 'boolean' || rhs.type !== 'boolean') {
        throw new EvalException(ctx);
      }
      return new PrimaryValue(lhs.value || rhs.value);
    }

    if (this.mode === EvalMode.Expr) {
      if (lhs.type === 'number' && rhs.type === 'number') return new OrExpr(new ConstExpr(lhs.value), new ConstExpr(rhs.value))
    }

    if (lhs.type === 'expr' && rhs.type === 'expr') return new OrExpr(lhs as Expr, rhs as Expr)
    if (lhs.type === 'expr' && rhs.type === 'number') return new OrExpr(lhs as Expr, new ConstExpr(rhs.value))
    if (lhs.type === 'number' && rhs.type === 'expr') return new OrExpr(new ConstExpr(lhs.value), rhs as Expr)
    throw new EvalException(ctx);

  }

  // expression '?' expression ':' expression #ternaryExpression
  public visitTernaryExpression(ctx) {
    let condition = this.visit(ctx.expression(0));
    let vala = this.visit(ctx.expression(1))
    let valb = this.visit(ctx.expression(2))

    if (this.mode === EvalMode.Expr) {
      if (condition.type === 'boolean') condition = new ConstExpr(1)
      if (vala.type === 'number') vala = new ConstExpr(vala.value)
      if (valb.type === 'number') valb = new ConstExpr(valb.value)
    }

    if (condition.type === 'expr' || vala.type === 'expr' || valb.type === 'expr') {
      if (condition.type === 'boolean') condition = new ConstExpr(1)
      if (vala.type === 'number') vala = new ConstExpr(vala.value)
      if (valb.type === 'number') valb = new ConstExpr(valb.value)
      if (condition.type === 'expr' && vala.type === 'expr' && valb.type === 'expr') return new IfExpr(condition as Expr, vala as Expr, valb as Expr)
    }

    if (this.mode === EvalMode.Normal) {
      if (condition.value) {
        return new PrimaryValue(vala);
      } else {
        return new PrimaryValue(valb);
      }
    }

    throw new EvalException(ctx);
  }

  // Number                                   #numberExpression
  public visitNumberExpression(ctx) {
    if (this.mode === EvalMode.Normal) return NumberLiteral.createInstance(Number(ctx.text));
    return new ConstExpr(Number(ctx.text))
  }

  // Bool                                     #boolExpression
  public visitBoolExpression(ctx) {
    return new PrimaryValue(Boolean(ctx.text));
  }

  // Null                                     #nullExpression
  public visitNullExpression(ctx) {
    return Null;
  }

  private resolveIndexes(ctx: ParserRuleContext, val: PrimaryValue, indexes: ExpressionContext[]) {
    indexes.forEach(ec => {
      let idx = this.visit(ec);
      if (idx.type === 'string' && val instanceof ObjectLiteral) {
        val = val.resolve(idx) as PrimaryValue
      }
      if (idx.type === 'number' && (val.type === 'array' || val.type === 'string')) {
        let i = idx.value
        if (val.type === 'string') {
          val = new PrimaryValue(val.value.substring(i, i + 1));
        } else {
          val = val.value[i];
        }
      }
      throw new EvalException(ec);
    })
    return val;
  }

  private setAtIndex(ctx: ParserRuleContext, indexes: ExpressionContext[], val: PrimaryValue, newVal: PrimaryValue) {
    let idx, ec
    if (val.type === 'array') {
      for (let i = 0; i < indexes.length - 1; i++) {
        ec = indexes[i]
        idx = this.visit(ec)
        if (idx.type !== 'number') throw new EvalException(ec);
        val = val.value[idx.value]
      }

      idx = this.visit(last(indexes))
      if (idx.type === 'number') {
        val.value[idx.value] = newVal
        return Null
      }
    }

    if (val instanceof ObjectLiteral) {
      for (let i = 0; i < indexes.length - 1; i++) {
        ec = indexes[i]
        idx = this.visit(ec)
        if (idx.type !== 'string') throw new EvalException(ec);
        val = (<ObjectLiteral>val).resolve(idx.value) as PrimaryValue
      }

      idx = this.visit(last(indexes))
      if (idx.type === 'string') {
        (<ObjectLiteral>val).assign(idx.value, newVal)
        return Null
      }
    }

    throw new EvalException(ctx);
  }

  // functionCall indexes?                    #functionCallExpression
  public visitFunctionCallExpression(ctx: FunctionCallExpressionContext) {
    let val = this.visit(ctx.functionCall());
    if (ctx.indexes()) {
      let exps = ctx.indexes().expression();
      val = this.resolveIndexes(ctx, val, exps);
    }
    return val;
  }

  // list indexes?                            #listExpression
  public visitListExpression(ctx: ListExpressionContext) {
    let val = this.visit(ctx.list());
    if (ctx.indexes() != null) {
      let exps = ctx.indexes().expression();
      val = this.resolveIndexes(ctx, val, exps);
    }
    return val;
  }

  // Identifier indexes?                      #identifierExpression
  public visitIdentifierExpression(ctx) {
    let id = ctx.Identifier().text;
    let val = this.scope.resolve(id) as PrimaryValue;

    if (ctx.indexes() != null) {
      let exps = ctx.indexes().expression();
      val = this.resolveIndexes(ctx, val, exps);
    }
    return val;
  }

  // String indexes?                          #stringExpression
  public visitStringExpression(ctx) {
    let text = ctx.text;
    text = text.substring(1, text.length - 1);
    let val = new PrimaryValue(text);
    if (ctx.indexes() != null) {
      let exps = ctx.indexes().expression();
      val = this.resolveIndexes(ctx, val, exps);
    }
    return val;
  }

  // objectLiteral indexes?
  public visitObjectLiteralExpression(ctx: ObjectLiteralExpressionContext): PrimaryValue {
    let val = this.visitObjectLiteral(ctx.objectLiteral())
    if (ctx.indexes() != null) {
      let exps = ctx.indexes().expression();
      return this.resolveIndexes(ctx, val, exps);
    }
    return val
  }

  // '(' expression ')' indexes?              #expressionExpression
  public visitExpressionExpression(ctx) {
    let val = this.visit(ctx.expression());
    if (ctx.indexes() != null) {
      let exps = ctx.indexes().expression();
      val = this.resolveIndexes(ctx, val, exps);
    }
    return val;
  }

  // assignment
  // : Identifier indexes? '=' expression
  // ;
  public visitAssignment(ctx: AssignmentContext) {
    let newVal = this.visit(ctx.expression());
    if (ctx.indexes()) {
      let val = this.scope.resolve(ctx.Identifier().text) as PrimaryValue;
      if (val.type === 'array') this.setAtIndex(ctx, ctx.indexes().expression(), val, newVal);
      if (val.type === 'object') this.setAtIndex(ctx, ctx.indexes().property(), val, newVal);
    } else {
      let id = ctx.Identifier().text;
      if (newVal.type === 'expr' && !(newVal instanceof ConstExpr) /*&& !(newVal instanceof SarExpr)*/) {
        newVal = new AssignExpr(id, newVal as Expr)
      }
      this.scope.assign(id, newVal);
    }
    return Null;
  }

  // Identifier '(' exprList? ')' #identifierFunctionCall
  public visitIdentifierFunctionCall(ctx: IdentifierFunctionCallContext) {
    let params: ExpressionContext[] = ctx.exprList() ? ctx.exprList().expression() : [];

    let func
    if (ctx.Identifier().length === 1) {
      let id = ctx.Identifier()[0].text;
      func = this.functions.get(id) || this.scope.resolve(id)
    } else {
      let objName = ctx.Identifier()[0].text;
      let obj = this.scope.resolve(objName)
      if (obj instanceof ObjectLiteral) {
        let target: PrimaryValue;
        for (let i = 1; i < ctx.Identifier().length; i++) {
          target = (<ObjectLiteral>obj).resolve(ctx.Identifier()[i].text) as PrimaryValue
          if (target.type === 'object') obj = target as ObjectLiteral
        }
        func = target
      } else if (obj.prototype) {
        func = obj.prototype.resolve(ctx.Identifier()[1].text) as MemberMethod
        func.bind(obj)
      }
    }

    if (func) {
      return func.invoke(params, this.functions, this.scope);
    }
    throw new EvalException(ctx);
  }

  // ifStatement
  //  : ifStat elseIfStat* elseStat? End
  //  ;
  //
  // ifStat
  //  : If expression Do block
  //  ;
  //
  // elseIfStat
  //  : Else If expression Do block
  //  ;
  //
  // elseStat
  //  : Else Do block
  //  ;
  public visitIfStatement(ctx: IfStatementContext) {

    // if ...
    if (this.visit(ctx.ifStat().expression()).value) {
      return this.visit(ctx.ifStat().block());
    }

    // else if ...
    for (let i = 0; i < ctx.elseIfStat().length; i++) {
      if (this.visit(ctx.elseIfStat(i).expression()).value) {
        return this.visit(ctx.elseIfStat(i).block());
      }
    }

    // else ...
    if (ctx.elseStat() != null) {
      return this.visit(ctx.elseStat().block());
    }

    return Null;
  }

  // block
  // : (statement | functionDecl)* (Return expression)?
  // ;
  public visitBlock(ctx: BlockContext) {
    this.scope = new Scope(this.scope); // create new local scope
    ctx.functionDecl().forEach(fd => {
      this.visitFunctionDecl(fd)
    })
    ctx.statement().forEach(sx => {
      this.visit(sx);
    })
    if (ctx.expression && ctx.expression()) {
      let ret = this.visit(ctx.expression());
      this.scope = this.scope.parent();
      return ret
    } else {
      this.scope = this.scope.parent();
      return Null;
    }
  }

  // forStatement
  // : For Identifier '=' expression To expression OBrace block CBrace
  // ;
  public visitForStatement(ctx: ForStatementContext) {
    let binding = ctx.Identifier(0).text;
    let array = this.scope.resolve(ctx.Identifier(1).text) as PrimaryValue;
    for (let i = 0; i <= array.value.length; i++) {
      this.scope.assign(binding, new PrimaryValue());
      this.visit(ctx.block());
    }
    return Null;
  }

  // whileStatement
  // : While expression OBrace block CBrace
  // ;
  public visitWhileStatement(ctx: WhileStatementContext) {
    while (this.visit(ctx.expression()).value) {
      this.visit(ctx.block());
    }
    return null;
  }


  /**
   * Visit a parse tree produced by `FinscriptParser.objectLiteral`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  public visitObjectLiteral(ctx: ObjectLiteralContext) {
    let obj = new ObjectLiteral();
    this.scope.push('object', obj)
    this.visit(ctx.propertyDefinitionList())
    return obj;
  };

  /**
   * Visit a parse tree produced by `FinscriptParser.propertyDefinitionList`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  public visitPropertyDefinitionList(ctx: PropertyDefinitionListContext) {
    ctx.propertyDefinition().forEach(def => {
      this.visit(def)
    })
    return Null;
  };

  /**
   * Visit a parse tree produced by `FinscriptParser.propertyDefinition`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  public visitPropertyDefinition(ctx: PropertyDefinitionContext) {
    let obj = this.scope.peek('object') as ObjectLiteral

    if (ctx.expression && ctx.expression()) obj.assign(ctx.Identifier(), this.visit(ctx.expression()))
    else {
      let val = this.scope.resolve(ctx.Identifier().text)
      if (!val) throw new EvalException(ctx);
      obj.assign(ctx.Identifier(), val)
    }
    return Null
  };

  /**
   * Visit a parse tree produced by the `exprCallExpression`
   * labeled alternative in `FinscriptParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  public visitExprCallExpression(ctx: ExprCallExpressionContext) {
    let exprName = ctx.IndicatorExpr().text
    let ind = this.scope.resolve(exprName) as any
    if (!ctx.exprList()) {
      return new ind()
    }
    let params: ExpressionContext[] = ctx.exprList().expression()

    if (exprName === 'CONST') {
      let exprs = this.invokeExprCall(params, EvalMode.Normal)
      return new ind(exprs.value[0].value)
    } else {
      let exprs = this.invokeExprCall(params, EvalMode.Expr)
      return new ind(...exprs.value)
    }
  };

  private invokeExprCall(params: ExpressionContext[], mode = EvalMode.Expr) {
    const evalVisitor = new EvalVisitor(this.scope, this.functions, mode);
    let exprs = params.map(param => evalVisitor.visit(param))
    return new PrimaryValue(exprs);
  }

  public visitProperty(ctx: PropertyContext) {
    return new PrimaryValue(ctx.Identifier().text)
  };

  public visitArrowFunctionExpression(ctx: ArrowFunctionExpressionContext) {
    return this.visit(ctx.arrowFunction())
  };

  public visitArrowFunction(ctx: ArrowFunctionContext) {
    let params: TerminalNode[]
    if (ctx.arrowParameters().coverParenthesizedExpressionAndArrowParameterList && ctx.arrowParameters().coverParenthesizedExpressionAndArrowParameterList()) {
      let parenthesized = ctx.arrowParameters().coverParenthesizedExpressionAndArrowParameterList()
      if (parenthesized.bindingPropertyList && parenthesized.bindingPropertyList()) {
        let bindings = parenthesized.bindingPropertyList()
        params = bindings.Identifier ? bindings.Identifier() || [] : []
      } else {
        params = []
      }
    } else {
      params = [ctx.arrowParameters().Identifier()]
    }
    let block: ParseTree
    if (ctx.conciseBody().block && ctx.conciseBody().block()) {
      block = ctx.conciseBody().block()
    } else {
      block = ctx.conciseBody().getChild(0)
    }
    return new UserFunction('', params, block, this.scope)
  };
}

