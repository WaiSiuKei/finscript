import { OPManyExpr } from "src/expr/OPManyExpr";

export class MaxExpr extends OPManyExpr {

  execute(index: number) {
    let vals = this._exprs.map(e => e.execute(index))
    return Math.max.apply(null, vals);
  }
}
