import {Expr} from "src/expr/Expr";
import {ExprEnv} from "src/exprEnv";
import {ObjectLiteral} from "src/value";

export class LowExpr extends Expr {
  execute(index) {
    return ExprEnv.get().getDataSource().getDataAt(index).low
  }
}
