import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {MaExpr} from "src/expr/MaExpr";
import {DivExpr} from "src/expr/DivExpr";
import {VolumeExpr} from "src/expr/VolumeExpr";
import {SubExpr} from "src/expr/SubExpr";
import {AddExpr} from "src/expr/AddExpr";
import {HighExpr} from "src/expr/HighExpr";
import {LowExpr} from "src/expr/LowExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {MulExpr} from "src/expr/MulExpr";

export class EMVIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 90, 14);
    var M = new ParameterExpr("M", 2, 60, 9);
    this.addParameter(N);
    this.addParameter(M);
    var VOLUME = new AssignExpr("VOLUME",
      new DivExpr(
        new MaExpr(new VolumeExpr(), N),
        new VolumeExpr()
      )
    );
    this.addAssign(VOLUME);
    var MID = new AssignExpr("MID",
      new MulExpr(
        new DivExpr(
          new SubExpr(
            new AddExpr(new HighExpr(), new LowExpr()),
            new RefExpr(
              new AddExpr(new HighExpr(), new LowExpr()),
              new ConstExpr(1)
            )
          ),
          new AddExpr(new HighExpr(), new LowExpr())
        ),
        new ConstExpr(100)
      )
    );
    this.addAssign(MID);
    var EMV = new OutputExpr("EMV",
      new MaExpr(
        new DivExpr(
          new MulExpr(
            MID,
            new MulExpr(
              VOLUME,
              new SubExpr(new HighExpr(), new LowExpr())
            )
          ),
          new MaExpr(
            new SubExpr(new HighExpr(), new LowExpr()),
            N
          )
        ),
        N
      )
    );
    this.addOutput(EMV);
    var MAEMV = new OutputExpr("MAEMV", new MaExpr(EMV, M));
    this.addOutput(MAEMV);
  }

  getName() {
    return "EMV";
  }
}
