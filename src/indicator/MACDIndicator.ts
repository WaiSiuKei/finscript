import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SubExpr} from "src/expr/SubExpr";
import {EmaExpr} from "src/expr/EmaExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {MulExpr} from "src/expr/MulExpr";
import {ConstExpr} from "src/expr/ConstExpr";

export class MACDIndicator extends Indicator {
  constructor() {
    super()
    var SHORT = new ParameterExpr("SHORT", 2, 200, 12);
    var LONG = new ParameterExpr("LONG", 2, 200, 26);
    var MID = new ParameterExpr("MID", 2, 200, 9);
    this.addParameter(SHORT);
    this.addParameter(LONG);
    this.addParameter(MID);
    var DIF = new OutputExpr("DIF",
      new SubExpr(
        new EmaExpr(new CloseExpr(), SHORT),
        new EmaExpr(new CloseExpr(), LONG)
      )
    );
    this.addOutput(DIF);
    var DEA = new OutputExpr("DEA", new EmaExpr(DIF, MID));
    this.addOutput(DEA);
    var MACD = new OutputExpr("MACD",
      new MulExpr(
        new SubExpr(DIF, DEA),
        new ConstExpr(2)
      ));
    this.addOutput(MACD);
  }

  getName() {
    return "MACD";
  }
}
