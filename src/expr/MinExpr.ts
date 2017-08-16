import { OPManyExpr } from "src/expr/OPManyExpr";

export class MinExpr extends OPManyExpr {

  execute(index: number) {
    let vals = this._exprs.map(e => e.execute(index))
    return Math.min.apply(null, vals)
  }
}
