import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {VolumeExpr} from "src/expr/VolumeExpr";
import {RangeOutputExpr} from "src/expr/RangeOutputExpr";
import {MaExpr} from "src/expr/MaExpr";

export class VOLUMEIndicator extends Indicator {
  constructor() {
    super()
    var M1 = new ParameterExpr("M1", 2, 500, 5);
    var M2 = new ParameterExpr("M2", 2, 500, 10);
    this.addParameter(M1);
    this.addParameter(M2);
    var VOLUME = new OutputExpr("VOLUME", new VolumeExpr());
    this.addOutput(VOLUME);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(VOLUME, M1)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(VOLUME, M2)));
  }

  getName() {
    return "VOLUME";
  }
}
