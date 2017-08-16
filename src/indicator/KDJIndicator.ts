import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {HighExpr} from "src/expr/HighExpr";
import {HhvExpr} from "src/expr/HhvExpr";
import {LlvExpr} from "src/expr/LlvExpr";
import {LowExpr} from "src/expr/LowExpr";
import {SubExpr} from "src/expr/SubExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {DivExpr} from "src/expr/DivExpr";
import {MulExpr} from "src/expr/MulExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SmaExpr} from "src/expr/SmaExpr";

export class KDJIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 90, 9);
    var M1 = new ParameterExpr("M1", 2, 30, 3);
    var M2 = new ParameterExpr("M2", 2, 30, 3);
    this.addParameter(N);
    this.addParameter(M1);
    this.addParameter(M2);
    var HHV = new AssignExpr("HHV",
      new HhvExpr(new HighExpr(), N)
    );
    this.addAssign(HHV);
    var LLV = new AssignExpr("LLV",
      new LlvExpr(new LowExpr(), N));
    this.addAssign(LLV);
    var RSV = new AssignExpr("RSV",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            new CloseExpr(),
            LLV
          ),
          new SubExpr(
            HHV,
            LLV
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addAssign(RSV);
    var K = new OutputExpr("K",
      new SmaExpr(RSV, M1, new ConstExpr(1))
    );
    this.addOutput(K);
    var D = new OutputExpr("D",
      new SmaExpr(K, M2, new ConstExpr(1))
    );
    this.addOutput(D);
    var J = new OutputExpr("J",
      new SubExpr(
        new MulExpr(
          K,
          new ConstExpr(3)
        ),
        new MulExpr(
          D,
          new ConstExpr(2)
        )
      )
    );
    this.addOutput(J);
  }

  getName() {
    return "KDJ";
  }
}
