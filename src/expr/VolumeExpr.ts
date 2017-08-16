import {Expr} from "src/expr/Expr";
import {ExprEnv} from "src/exprEnv";

export class VolumeExpr extends Expr {
  execute(index) {
    return ExprEnv.get().getDataSource().getDataAt(index).volume;
  }
}
