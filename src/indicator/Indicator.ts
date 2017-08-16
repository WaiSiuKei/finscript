import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {ExprEnv} from "src/exprEnv";
import {BuiltInFunction} from "src/function";

export class Indicator  {

  protected _rid: number;
  protected _params: ParameterExpr[];
  protected _assigns: AssignExpr[];
  protected _outputs: OutputExpr[];
  protected _exprEnv: ExprEnv;

  constructor() {
    this._exprEnv = new ExprEnv();
    this._rid = 0;
    this._params = [];
    this._assigns = [];
    this._outputs = [];
  }

  get outputs() {
    return this._outputs
  }

  getName(): string {
    return ''
  };

  addParameter(expr: ParameterExpr) {
    this._params.push(expr);
  }

  addAssign(expr: AssignExpr) {
    this._assigns.push(expr);
  }

  addOutput(expr: OutputExpr) {
    this._outputs.push(expr);
  }

  getParameterCount() {
    return this._params.length;
  }

  getParameterAt(index) {
    return this._params[index];
  }

  getOutputCount() {
    return this._outputs.length;
  }

  getOutputAt(index) {
    return this._outputs[index];
  }

  clear() {
    this._exprEnv.setFirstIndex(-1);
    var i, cnt;
    cnt = this._assigns.length;
    for (i = 0; i < cnt; i++) {
      this._assigns[i].clear();
    }
    cnt = this._outputs.length;
    for (i = 0; i < cnt; i++) {
      this._outputs[i].clear();
    }
  }

  reserve(count) {
    this._rid++;
    var i, cnt;
    cnt = this._assigns.length;
    for (i = 0; i < cnt; i++) {
      this._assigns[i].reserve(this._rid, count);
    }
    cnt = this._outputs.length;
    for (i = 0; i < cnt; i++) {
      this._outputs[i].reserve(this._rid, count);
    }
  }

  execute(ds, index) {
    if (index < 0)
      return;
    this._exprEnv.setDataSource(ds);
    ExprEnv.set(this._exprEnv);
    try {
      var i, cnt;
      cnt = this._assigns.length;
      for (i = 0; i < cnt; i++) {
        this._assigns[i].assign(index);
      }
      cnt = this._outputs.length;
      for (i = 0; i < cnt; i++) {
        this._outputs[i].assign(index);
      }
      if (this._exprEnv.getFirstIndex() < 0)
        this._exprEnv.setFirstIndex(index);
    } catch (e) {
      if (this._exprEnv.getFirstIndex() >= 0) {
        throw e;
      }
    }
  }

  getParameters() {
    var params = [];
    var i, cnt = this._params.length;
    for (i = 0; i < cnt; i++)
      params.push(this._params[i].getValue());
    return params;
  }

  setParameters(params) {
    if ((params instanceof Array) && params.length == this._params.length) {
      for (var i in this._params)
        this._params[i].setValue(params[i]);
    }
  }
}

