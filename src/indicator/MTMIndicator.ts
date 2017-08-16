import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SubExpr} from "src/expr/SubExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {MaExpr} from "src/expr/MaExpr";

export class MTMIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 120, 12);
    var M = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(N);
    this.addParameter(M);
    var MTM = new OutputExpr("MTM",
      new SubExpr(
        new CloseExpr(),
        new RefExpr(new CloseExpr(), N),
      ),
    );
    this.addOutput(MTM);
    var MTMMA = new OutputExpr("MTMMA", new MaExpr(MTM, M));
    this.addOutput(MTMMA);
  }

  getName() {
    return "MTM";
  }
}
