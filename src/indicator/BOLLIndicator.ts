import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {StdExpr} from "src/expr/StdExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MaExpr} from "src/expr/MaExpr";
import {AddExpr} from "src/expr/AddExpr";
import {MulExpr} from "src/expr/MulExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {SubExpr} from "src/expr/SubExpr";

export class BOLLIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 120, 20);
    this.addParameter(N);
    var STD_CLOSE_N = new AssignExpr("STD_CLOSE_N", new StdExpr(new CloseExpr(), N));
    this.addAssign(STD_CLOSE_N);
    var BOLL = new OutputExpr("BOLL", new MaExpr(new CloseExpr(), N));
    this.addOutput(BOLL);
    var UB = new OutputExpr("UB", new AddExpr(BOLL, new MulExpr(new ConstExpr(2), STD_CLOSE_N)));
    this.addOutput(UB);
    var LB = new OutputExpr("LB", new SubExpr(BOLL, new MulExpr(new ConstExpr(2), STD_CLOSE_N)));
    this.addOutput(LB);
  }

  getName() {
    return "BOLL";
  }
}
