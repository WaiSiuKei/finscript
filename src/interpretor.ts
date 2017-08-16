import {FinscriptLexer} from "../gen/FinscriptLexer";
import {ANTLRInputStream, CommonTokenStream} from 'antlr4ts'
import {FinscriptParser} from "../gen/FinscriptParser";
import {Scope} from "src/scope";
import {EvalVisitor} from "src/visitor";
import {Log} from "src/buitin/console";
import {CloseExpr} from "src/expr/CloseExpr";
import {ObjectLiteral} from "src/value";
import {DataSource} from "src/dataSource";
import {OpenExpr} from "src/expr/OpenExpr";
import {HighExpr} from "src/expr/HighExpr";
import {LowExpr} from "src/expr/LowExpr";
import {VolumeExpr} from "src/expr/VolumeExpr";
import {AddExpr} from "src/expr/AddExpr";
import {AbsExpr} from "src/expr/AbsExpr";
import {AndExpr} from "src/expr/AndExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {CountExpr} from "src/expr/CountExpr";
import {DivExpr} from "src/expr/DivExpr";
import {EmaExpr} from "src/expr/EmaExpr";
import {EqExpr} from "src/expr/EqExpr";
import {ExpmemaExpr} from "src/expr/ExpmemaExpr";
import {GeExpr} from "src/expr/GeExpr";
import {GtExpr} from "src/expr/GtExpr";
import {HhvExpr} from "src/expr/HhvExpr";
import {IfExpr} from "src/expr/IfExpr";
import {LeExpr} from "src/expr/LeExpr";
import {LlvExpr} from "src/expr/LlvExpr";
import {LtExpr} from "src/expr/LtExpr";
import {MaExpr} from "src/expr/MaExpr";
import {MaxExpr} from "src/expr/MaxExpr";
import {MulExpr} from "src/expr/MulExpr";
import {NegExpr} from "src/expr/NegExpr";
import {OrExpr} from "src/expr/OrExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {RefExpr} from "src/expr/RefExpr";
import {SarExpr} from "src/expr/SarExpr";
import {SmaExpr} from "src/expr/SmaExpr";
import {StdExpr} from "src/expr/StdExpr";
import {SubExpr} from "src/expr/SubExpr";
import {SumExpr} from "src/expr/SumExpr";
import {Expr} from "src/expr/Expr";
import {Indicator} from "src/indicator/Indicator";
import {RangeOutputExpr} from "src/expr/RangeOutputExpr";
import {IFunction, PrimaryValue} from "src/base";
import {AtanExpr} from "src/expr/AtanExpr";
import {CeilExpr} from "src/expr/CeilExpr";
import {CosExpr} from "src/expr/CosExpr";
import {ExpExpr} from "src/expr/ExpExpr";
import {FloorExpr} from "src/expr/FloorExpr";
import {LnExpr} from "src/expr/LnExpr";
import {LogExpr} from "src/expr/LogExpr";
import {MinExpr} from "src/expr/MinExpr";
import {PowExpr} from "src/expr/PowExpr";
import {RoundExpr} from "src/expr/RoundExpr";
import {SinExpr} from "src/expr/SinExpr";
import {SqrtExpr} from "src/expr/SqtrExpr";
import {TanExpr} from "src/expr/TanExpr";
import {FinscriptErrorListener} from "src/errorListener";

export class Interpretor {
  private scope: Scope;
  private functions: Map<String, IFunction>;

  init() {
    this._initGlobalScope()
    this._initGlobalFunctions()
  }

  private _initGlobalScope() {
    this.scope = new Scope(null);
    this._assignExprs()
    this._assignConsole()
  }

  private _assignExprs() {
    this.scope.assign('ABS', AbsExpr)
    this.scope.assign('ADD', AddExpr)
    this.scope.assign('AND', AndExpr)
    this.scope.assign('ASSIGN', AssignExpr)
    this.scope.assign('ATAN', AtanExpr)
    this.scope.assign('C', CloseExpr) // alias
    this.scope.assign('CEIL', CeilExpr) // alias
    this.scope.assign('CLOSE', CloseExpr)
    this.scope.assign('CONST', ConstExpr)
    this.scope.assign('COS', CosExpr)
    this.scope.assign('COUNT', CountExpr)
    this.scope.assign('DIV', DivExpr)
    this.scope.assign('EMA', EmaExpr)
    this.scope.assign('EQ', EqExpr)
    this.scope.assign('EXPMEMA', ExpmemaExpr)
    this.scope.assign('EXP', ExpExpr)
    this.scope.assign('FLOOR', FloorExpr)
    this.scope.assign('GE', GeExpr)
    this.scope.assign('GT', GtExpr)
    this.scope.assign('HHV', HhvExpr)
    this.scope.assign('H', HighExpr) // alias
    this.scope.assign('HIGH', HighExpr)
    this.scope.assign('IF', IfExpr)
    this.scope.assign('LE', LeExpr)
    this.scope.assign('LLV', LlvExpr)
    this.scope.assign('LN', LnExpr)
    this.scope.assign('L', LowExpr) // alias
    this.scope.assign('LOG', LogExpr)
    this.scope.assign('LOW', LowExpr)
    this.scope.assign('LT', LtExpr)
    this.scope.assign('MA', MaExpr)
    this.scope.assign('MAX', MaxExpr)
    this.scope.assign('MIN', MinExpr)
    this.scope.assign('MUL', MulExpr)
    this.scope.assign('NEG', NegExpr)
    this.scope.assign('O', OpenExpr) // alias
    this.scope.assign('OPEN', OpenExpr)
    this.scope.assign('OR', OrExpr)
    this.scope.assign('OUTPUT', OutputExpr)
    this.scope.assign('POW', PowExpr)
    this.scope.assign('REF', RefExpr)
    this.scope.assign('ROUND', RoundExpr)
    this.scope.assign('SAR', SarExpr)
    this.scope.assign('SIN', SinExpr)
    this.scope.assign('SMA', SmaExpr)
    this.scope.assign('SQRT', SqrtExpr)
    this.scope.assign('STD', StdExpr)
    this.scope.assign('SUB', SubExpr)
    this.scope.assign('SUM', SumExpr)
    this.scope.assign('TAN', TanExpr)
    this.scope.assign('V', VolumeExpr) // alias
    this.scope.assign('VOL', VolumeExpr) // alias
    this.scope.assign('VOLUME', VolumeExpr)
  }

  private _assignConsole() {
    let console = new ObjectLiteral()
    console.assign('log', new Log())

    this.scope.assign('Console', console)
  }

  private _initGlobalFunctions() {
    this.functions = new Map<String, IFunction>();
    this.functions.set('output', new Log())
  }

  eval(input) {
    this.init()

    const inputStream = new ANTLRInputStream(input);
    const lexer = new FinscriptLexer(inputStream);
    const lexerErrorListener = new FinscriptErrorListener();
    lexer.addErrorListener(lexerErrorListener)
    const commonTokenStream = new CommonTokenStream(lexer);
    const parser = new FinscriptParser(commonTokenStream);
    const parserErrorListener = new FinscriptErrorListener();
    parser.addErrorListener(parserErrorListener)
    const tree = parser.script();

    const visitor = new EvalVisitor(this.scope, this.functions);
    try {
      let ret = visitor.visit(tree);
      if (!lexerErrorListener.isValid)return new Error(lexerErrorListener.errorMessage)
      if (!parserErrorListener.isValid) return new Error(parserErrorListener.errorMessage)
      return ret
    } catch (e) {
      console.log(e)
      if (!lexerErrorListener.isValid)return new Error(lexerErrorListener.errorMessage)
      if (!parserErrorListener.isValid) return new Error(parserErrorListener.errorMessage)
      return e
    }
  }

  calculateIndicator(val: ObjectLiteral | Expr, ds: DataSource) {
    let indicator = new Indicator()
    if (val.type === 'object') {
      let iterator = (<ObjectLiteral>val).scope.variables.keys()
      let key
      while (key = iterator.next().value) {
        let prop = (<ObjectLiteral>val).resolve(key) as PrimaryValue
        if (prop.type === 'expr') {
          if (prop instanceof AssignExpr) indicator.addAssign(prop as AssignExpr)
          if (prop instanceof RangeOutputExpr) indicator.addOutput(new RangeOutputExpr(key, prop as Expr))
          else indicator.addOutput(new OutputExpr(key, prop as Expr))
        }
      }
    }
    if (val.type === 'expr') {
      if (val instanceof AssignExpr) indicator.addAssign(val as AssignExpr)
      if (val instanceof RangeOutputExpr) indicator.addOutput(new RangeOutputExpr('default', val as Expr))
      else indicator.addOutput(new OutputExpr('default', val as Expr))
    }

    let count = ds.getDataCount()
    indicator.clear();
    indicator.reserve(count);
    for (let i = 0; i < count; i++) {
      indicator.execute(ds, i)
    }

    let outputCount = indicator.getOutputCount()
    let outputs = {}
    for (let i = 0; i < outputCount; i++) {
      let out = indicator.getOutputAt(i)
      outputs[out.getName()] = out._buf
    }
    return outputs
  }
}
