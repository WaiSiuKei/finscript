import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {HighExpr} from "src/expr/HighExpr";
import {HhvExpr} from "src/expr/HhvExpr";
import {LlvExpr} from "src/expr/LlvExpr";
import {LowExpr} from "src/expr/LowExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MulExpr} from "src/expr/MulExpr";
import {DivExpr} from "src/expr/DivExpr";
import {SubExpr} from "src/expr/SubExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {ConstExpr} from "src/expr/ConstExpr";

export class WRIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 100, 10);
    var N1 = new ParameterExpr("N1", 2, 100, 6);
    this.addParameter(N);
    this.addParameter(N1);
    var HHV = new AssignExpr("HHV", new HhvExpr(new HighExpr(), N));
    this.addAssign(HHV);
    var HHV1 = new AssignExpr("HHV1", new HhvExpr(new HighExpr(), N1));
    this.addAssign(HHV1);
    var LLV = new AssignExpr("LLV", new LlvExpr(new LowExpr(), N));
    this.addAssign(LLV);
    var LLV1 = new AssignExpr("LLV1", new LlvExpr(new LowExpr(), N1));
    this.addAssign(LLV1);
    var WR1 = new OutputExpr("WR1",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            HHV,
            new CloseExpr()
          ),
          new SubExpr(
            HHV,
            LLV
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(WR1);
    var WR2 = new OutputExpr("WR2",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            HHV1,
            new CloseExpr()
          ),
          new SubExpr(
            HHV1,
            LLV1
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(WR2);
  }

  getName() {
    return "WR";
  }
}
