import {Expr} from "src/expr/Expr";
import {ExprEnv} from "src/exprEnv";

export class CloseExpr extends Expr {
  execute(index: number) {
    return ExprEnv.get().getDataSource().getDataAt(index).close
  }
}
