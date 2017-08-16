import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MulExpr} from "src/expr/MulExpr";
import {DivExpr} from "src/expr/DivExpr";
import {SubExpr} from "src/expr/SubExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {MaExpr} from "src/expr/MaExpr";

export class ROCIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 120, 12);
    var M = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(N);
    this.addParameter(M);
    var REF_CLOSE_N = new AssignExpr("REF_CLOSE_N",
      new RefExpr(new CloseExpr(), N));
    this.addAssign(REF_CLOSE_N);
    var ROC = new OutputExpr("ROC",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            new CloseExpr(),
            REF_CLOSE_N
          ),
          REF_CLOSE_N
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(ROC);
    var MAROC = new OutputExpr("MAROC", new MaExpr(ROC, M));
    this.addOutput(MAROC);
  }

  getName() {
    return "ROC";
  }
}
