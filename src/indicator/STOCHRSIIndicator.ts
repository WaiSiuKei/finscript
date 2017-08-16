import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {SubExpr} from "src/expr/SubExpr";
import {DivExpr} from "src/expr/DivExpr";
import {MulExpr} from "src/expr/MulExpr";
import {SmaExpr} from "src/expr/SmaExpr";
import {MaxExpr} from "src/expr/MaxExpr";
import {AbsExpr} from "src/expr/AbsExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MaExpr} from "src/expr/MaExpr";
import {LlvExpr} from "src/expr/LlvExpr";
import {HhvExpr} from "src/expr/HhvExpr";
import {RangeOutputExpr} from "src/expr/RangeOutputExpr";

export class STOCHRSIIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 3, 100, 14);
    var M = new ParameterExpr("M", 3, 100, 14);
    var P1 = new ParameterExpr("P1", 2, 50, 3);
    var P2 = new ParameterExpr("P2", 2, 50, 3);
    this.addParameter(N);
    this.addParameter(M);
    this.addParameter(P1);
    this.addParameter(P2);
    var LC = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(LC);
    var CLOSE_LC = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), LC));
    this.addAssign(CLOSE_LC);
    var RSI = new AssignExpr("RSI",
      new MulExpr(
        new DivExpr(
          new SmaExpr(new MaxExpr(CLOSE_LC, new ConstExpr(0)), N, new ConstExpr(1)),
          new SmaExpr(new AbsExpr(CLOSE_LC), N, new ConstExpr(1))
        ),
        new ConstExpr(100)
      )
    );
    this.addAssign(RSI);
    var STOCHRSI = new OutputExpr("STOCHRSI",
      new MulExpr(
        new DivExpr(
          new MaExpr(
            new SubExpr(
              RSI,
              new LlvExpr(RSI, M)
            ),
            P1
          ),
          new MaExpr(
            new SubExpr(
              new HhvExpr(RSI, M),
              new LlvExpr(RSI, M)
            ),
            P1
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(STOCHRSI);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(STOCHRSI, P2)));
  }

  getName() {
    return "StochRSI";
  }
}
