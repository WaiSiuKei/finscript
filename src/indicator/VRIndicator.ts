import {Indicator} from "src/indicator/Indicator";
import {ParameterExpr} from "src/expr/ParameterExpr";
import {AssignExpr} from "src/expr/AssignExpr";
import {CloseExpr} from "src/expr/CloseExpr";
import {RefExpr} from "src/expr/RefExpr";
import {ConstExpr} from "src/expr/ConstExpr";
import {SumExpr} from "src/expr/SumExpr";
import {IfExpr} from "src/expr/IfExpr";
import {GtExpr} from "src/expr/GtExpr";
import {VolumeExpr} from "src/expr/VolumeExpr";
import {LtExpr} from "src/expr/LtExpr";
import {EqExpr} from "src/expr/EqExpr";
import {OutputExpr} from "src/expr/OutputExpr";
import {AddExpr} from "src/expr/AddExpr";
import {MulExpr} from "src/expr/MulExpr";
import {MaExpr} from "src/expr/MaExpr";
import {DivExpr} from "src/expr/DivExpr";

export class VRIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 100, 26);
    var M = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(N);
    this.addParameter(M);
    var REF_CLOSE_1 = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(REF_CLOSE_1);
    var TH = new AssignExpr("TH",
      new SumExpr(
        new IfExpr(
          new GtExpr(
            new CloseExpr(),
            REF_CLOSE_1
          ),
          new VolumeExpr(),
          new ConstExpr(0)
        ),
        N
      )
    );
    this.addAssign(TH);
    var TL = new AssignExpr("TL",
      new SumExpr(
        new IfExpr(
          new LtExpr(
            new CloseExpr(),
            REF_CLOSE_1
          ),
          new VolumeExpr(),
          new ConstExpr(0)
        ),
        N
      )
    );
    this.addAssign(TL);
    var TQ = new AssignExpr("TQ",
      new SumExpr(
        new IfExpr(
          new EqExpr(
            new CloseExpr(),
            REF_CLOSE_1
          ),
          new VolumeExpr(),
          new ConstExpr(0)
        ),
        N
      )
    );
    this.addAssign(TQ);
    var VR = new OutputExpr("VR",
      new MulExpr(
        new DivExpr(
          new AddExpr(
            new MulExpr(
              TH,
              new ConstExpr(2)
            ),
            TQ
          ),
          new AddExpr(
            new MulExpr(
              TL,
              new ConstExpr(2)
            ),
            TQ
          )
        ),
        new ConstExpr(100)
      )
    );
    this.addOutput(VR);
    var MAVR = new OutputExpr("MAVR", new MaExpr(VR, M));
    this.addOutput(MAVR);
  }

  getName() {
    return "VR";
  }
}
