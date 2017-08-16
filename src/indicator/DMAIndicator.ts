import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SubExpr} from "src/expr/SubExpr";
import {MaExpr} from "src/expr/MaExpr";
import {CloseExpr} from "src/expr/CloseExpr";

export class DMAIndicator extends Indicator {
  constructor() {
    super()
    var N1 = new ParameterExpr("N1", 2, 60, 10);
    var N2 = new ParameterExpr("N2", 2, 250, 50);
    var M = new ParameterExpr("M", 2, 100, 10);
    this.addParameter(N1);
    this.addParameter(N2);
    this.addParameter(M);
    var DIF = new OutputExpr("DIF",
      new SubExpr(
        new MaExpr(new CloseExpr(), N1),
        new MaExpr(new CloseExpr(), N2)
      )
    );
    this.addOutput(DIF);
    var DIFMA = new OutputExpr("DIFMA",
      new MaExpr(DIF, M)
    );
    this.addOutput(DIFMA);
  }

  getName() {
    return "DMA";
  }
}
