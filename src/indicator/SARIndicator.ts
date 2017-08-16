import {Indicator} from "src/indicator/Indicator";
import {ConstExpr} from "src/expr/ConstExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SarExpr} from "src/expr/SarExpr";

export class SARIndicator extends Indicator {
  constructor() {
    super()
    var N = new ConstExpr(4);
    var MIN = new ConstExpr(2);
    var STEP = new ConstExpr(2);
    var MAX = new ConstExpr(20);
    this.addOutput(new OutputExpr("SAR", new SarExpr(N, MIN, STEP, MAX)))
  }

  getName() {
    return "SAR";
  }
}
