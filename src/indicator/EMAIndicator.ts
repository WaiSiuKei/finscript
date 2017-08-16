import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {RangeOutputExpr} from "src/expr/RangeOutputExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {EmaExpr} from "src/expr/EmaExpr";

export class EMAIndicator extends Indicator {
  constructor() {
    super()
    var M1 = new ParameterExpr("M1", 2, 1000, 7);
    var M2 = new ParameterExpr("M2", 2, 1000, 30);
    var M3 = new ParameterExpr("M3", 2, 1000, 0);
    var M4 = new ParameterExpr("M4", 2, 1000, 0);
    this.addParameter(M1);
    this.addParameter(M2);
    this.addParameter(M3);
    this.addParameter(M4);
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), M1)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), M2)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), M3)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), M4)));
  }

  getName() {
    return "EMA";
  }
}
