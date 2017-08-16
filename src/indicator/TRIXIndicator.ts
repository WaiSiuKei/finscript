import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {EmaExpr} from "src/expr/EmaExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MulExpr} from "src/expr/MulExpr";
import {SubExpr} from "src/expr/SubExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {MaExpr} from "src/expr/MaExpr";
import {DivExpr} from "src/expr/DivExpr";

export class TRIXIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 100, 12);
    var M = new ParameterExpr("M", 2, 100, 9);
    this.addParameter(N);
    this.addParameter(M);
    var MTR = new AssignExpr("MTR",
      new EmaExpr(
        new EmaExpr(
          new EmaExpr(new CloseExpr(), N), N), N));
    this.addAssign(MTR);
    var TRIX = new OutputExpr("TRIX",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            MTR,
            new RefExpr(
              MTR,
              new ConstExpr(1)
            )
          ),
          new RefExpr(
            MTR,
            new ConstExpr(1)
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(TRIX);
    var MATRIX = new OutputExpr("MATRIX", new MaExpr(TRIX, M));
    this.addOutput(MATRIX);
  }

  getName() {
    return "TRIX";
  }
}
