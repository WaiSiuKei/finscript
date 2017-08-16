import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {RangeOutputExpr} from "src/expr/RangeOutputExpr";
import {MaExpr} from "src/expr/MaExpr";
import {HighExpr} from "src/expr/HighExpr";
import {LowExpr} from "src/expr/LowExpr";
import {CloseExpr} from "src/expr/CloseExpr";

export class HLCIndicator extends Indicator {
  constructor() {
    super()
    var M1 = new ParameterExpr("M1", 2, 1000, 60);
    this.addParameter(M1);
    this.addOutput(new OutputExpr("HIGH", new HighExpr(),));
    this.addOutput(new OutputExpr("LOW", new LowExpr(),));
    this.addOutput(new OutputExpr("CLOSE", new CloseExpr(),));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), M1)));
  }

  getName() {
    return "CLOSE";
  }
}
