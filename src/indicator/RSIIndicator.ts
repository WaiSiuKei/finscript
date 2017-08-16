import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {SubExpr} from "src/expr/SubExpr";
import {MulExpr} from "src/expr/MulExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {DivExpr} from "src/expr/DivExpr";
import {SmaExpr} from "src/expr/SmaExpr";
import {MaxExpr} from "src/expr/MaxExpr";
import {AbsExpr} from "src/expr/AbsExpr";

export class RSIIndicator extends Indicator {
  constructor() {
    super()
    var N1 = new ParameterExpr("N1", 2, 120, 6);
    var N2 = new ParameterExpr("N2", 2, 250, 12);
    var N3 = new ParameterExpr("N3", 2, 500, 24);
    this.addParameter(N1);
    this.addParameter(N2);
    this.addParameter(N3);
    var LC = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(LC);
    var CLOSE_LC = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), LC));
    this.addAssign(CLOSE_LC);
    this.addOutput(new OutputExpr("RSI1",
      new MulExpr(
        new DivExpr(
          new SmaExpr(new MaxExpr(CLOSE_LC, new ConstExpr(0)), N1, new ConstExpr(1)),
          new SmaExpr(new AbsExpr(CLOSE_LC), N1, new ConstExpr(1))
        ),
        new ConstExpr(100)
      )
    ));
    this.addOutput(new OutputExpr("RSI2",
      new MulExpr(
        new DivExpr(
          new SmaExpr(new MaxExpr(CLOSE_LC, new ConstExpr(0)), N2, new ConstExpr(1)),
          new SmaExpr(new AbsExpr(CLOSE_LC), N2, new ConstExpr(1))
        ),
        new ConstExpr(100)
      )
    ));
    this.addOutput(new OutputExpr("RSI3",
      new MulExpr(
        new DivExpr(
          new SmaExpr(new MaxExpr(CLOSE_LC, new ConstExpr(0)), N3, new ConstExpr(1)),
          new SmaExpr(new AbsExpr(CLOSE_LC), N3, new ConstExpr(1))
        ),
        new ConstExpr(100)
      )
    ));
  }

  getName() {
    return "RSI";
  }
}
