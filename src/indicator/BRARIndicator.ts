import {Indicator} from "src/indicator/Indicator";
import {AssignExpr} from "src/expr/AssignExpr";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {RefExpr} from "src/expr/RefExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {SumExpr} from "src/expr/SumExpr";
import {MaxExpr} from "src/expr/MaxExpr";
import {SubExpr} from "src/expr/SubExpr";
import {HighExpr} from "src/expr/HighExpr";
import {LowExpr} from "src/expr/LowExpr";
import {MulExpr} from "src/expr/MulExpr";
import {DivExpr} from "src/expr/DivExpr";
import {OpenExpr} from "src/expr/OpenExpr";

export class BRARIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 120, 26);
    this.addParameter(N);
    var REF_CLOSE_1 = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(REF_CLOSE_1);
    var BR = new OutputExpr("BR",
      new MulExpr(
        new DivExpr(
          new SumExpr(
            new MaxExpr(
              new ConstExpr(0),
              new SubExpr(
                new HighExpr(),
                REF_CLOSE_1
              )
            ),
            N
          ),
          new SumExpr(
            new MaxExpr(
              new ConstExpr(0),
              new SubExpr(
                REF_CLOSE_1,
                new LowExpr()
              )
            ),
            N
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(BR);
    var AR = new OutputExpr("AR",
      new MulExpr(
        new DivExpr(
          new SumExpr(
            new SubExpr(
              new HighExpr(),
              new OpenExpr()
            ),
            N,
          ),
          new SumExpr(
            new SubExpr(
              new OpenExpr(),
              new LowExpr()
            ),
            N,
          )
        ),
        new ConstExpr(100)
      ),
    );
    this.addOutput(AR);
  }

  getName() {
    return "BRAR";
  }
}
