import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {IfExpr} from "src/expr/IfExpr";
import {GtExpr} from "src/expr/GtExpr";
import {VolumeExpr} from "src/expr/VolumeExpr";
import {NegExpr} from "src/expr/NegExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SumExpr} from "src/expr/SumExpr";
import {EqExpr} from "src/expr/EqExpr";
import {MaExpr} from "src/expr/MaExpr";
import {Indicator} from "src/indicator/Indicator";

export class OBVIndicator extends Indicator {
  constructor() {
    super()
    var M = new ParameterExpr("M", 2, 100, 30);
    this.addParameter(M);
    var REF_CLOSE_1 = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(REF_CLOSE_1);
    var VA = new AssignExpr("VA",
      new IfExpr(
        new GtExpr(new CloseExpr(), REF_CLOSE_1),
        new VolumeExpr(),
        new NegExpr(new VolumeExpr())
      )
    );
    this.addAssign(VA);
    var OBV = new OutputExpr("OBV",
      new SumExpr(
        new IfExpr(
          new EqExpr(new CloseExpr(), REF_CLOSE_1),
          new ConstExpr(0),
          VA
        ),
        new ConstExpr(0)
      )
    );
    this.addOutput(OBV);
    var MAOBV = new OutputExpr("MAOBV", new MaExpr(OBV, M),);
    this.addOutput(MAOBV);
  }

  getName() {
    return "OBV";
  }
}
