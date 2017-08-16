import {Expr} from "src/expr/Expr";
import {ExprEnv} from "src/exprEnv";
import {ObjectLiteral} from "src/value";

export class HighExpr extends Expr {
  execute(index: number) {
    return ExprEnv.get().getDataSource().getDataAt(index).high;
  }
}
