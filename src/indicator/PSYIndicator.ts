import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MulExpr} from "src/expr/MulExpr";
import {DivExpr} from "src/expr/DivExpr";
import {CountExpr} from "src/expr/CountExpr";
import {GtExpr} from "src/expr/GtExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {MaExpr} from "src/expr/MaExpr";

export class PSYIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 100, 12);
    var M = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(N);
    this.addParameter(M);
    var PSY = new OutputExpr("PSY",
      new MulExpr(
        new DivExpr(
          new CountExpr(
            new GtExpr(
              new CloseExpr(),
              new RefExpr(new CloseExpr(), new ConstExpr(1))
            ),
            N,
          ),
          N,
        ),
        new ConstExpr(100)
      ),
    );
    this.addOutput(PSY);
    var PSYMA = new OutputExpr("PSYMA",
      new MaExpr(PSY, M),
    );
    this.addOutput(PSYMA);
  }

  getName() {
    return "PSY";
  }
}
