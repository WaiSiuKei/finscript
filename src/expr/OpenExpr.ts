import {ExprEnv} from "src/exprEnv";
import {Expr} from "src/expr/Expr";
import {ObjectLiteral} from "src/value";

export class OpenExpr extends Expr {
  execute(index) {
    return ExprEnv.get().getDataSource().getDataAt(index).open
  }
}
