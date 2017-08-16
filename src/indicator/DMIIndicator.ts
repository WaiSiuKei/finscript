import { Indicator } from "src/indicator/Indicator";
import { ParameterExpr } from "src/expr/ParameterExpr";
import { AssignExpr } from "src/expr/AssignExpr";
import { ExpmemaExpr } from "src/expr/ExpmemaExpr";
import { MaxExpr } from "src/expr/MaxExpr";
import { SubExpr } from "src/expr/SubExpr";
import { HighExpr } from "src/expr/HighExpr";
import { LowExpr } from "src/expr/LowExpr";
import { AbsExpr } from "src/expr/AbsExpr";
import { RefExpr } from "src/expr/RefExpr";
import { CloseExpr } from "src/expr/CloseExpr";
import { ConstExpr } from "src/expr/ConstExpr";
import { IfExpr } from "src/expr/IfExpr";
import { AndExpr } from "src/expr/AndExpr";
import { GtExpr } from "src/expr/GtExpr";
import { OutputExpr } from "src/expr/OutputExpr";
import { MulExpr } from "src/expr/MulExpr";
import { DivExpr } from "src/expr/DivExpr";
import { AddExpr } from "src/expr/AddExpr";
export class DMIIndicator extends Indicator {
  constructor() {
    super()
    var N = new ParameterExpr("N", 2, 90, 14);
    var MM = new ParameterExpr("MM", 2, 60, 6);
    this.addParameter(N);
    this.addParameter(MM);
    var MTR = new AssignExpr("MTR",
      new ExpmemaExpr(
        new MaxExpr(
          new MaxExpr(
            new SubExpr(new HighExpr(), new LowExpr()),
            new AbsExpr(
              new SubExpr(
                new HighExpr(),
                new RefExpr(new CloseExpr(), new ConstExpr(1))
              )
            )
          ),
          new AbsExpr(
            new SubExpr(
              new RefExpr(new CloseExpr(), new ConstExpr(1)),
              new LowExpr()
            )
          )
        ),
        N
      )
    );
    this.addAssign(MTR);
    var HD = new AssignExpr("HD",
      new SubExpr(
        new HighExpr(),
        new RefExpr(new HighExpr(), new ConstExpr(1))
      )
    );
    this.addAssign(HD);
    var LD = new AssignExpr("LD",
      new SubExpr(
        new RefExpr(new LowExpr(), new ConstExpr(1)),
        new LowExpr()
      )
    );
    this.addAssign(LD);
    var DMP = new AssignExpr("DMP",
      new ExpmemaExpr(
        new IfExpr(
          new AndExpr(
            new GtExpr(HD, new ConstExpr(0)),
            new GtExpr(HD, LD)
          ),
          HD,
          new ConstExpr(0)
        ),
        N
      )
    );
    this.addAssign(DMP);
    var DMM = new AssignExpr("DMM",
      new ExpmemaExpr(
        new IfExpr(
          new AndExpr(
            new GtExpr(LD, new ConstExpr(0)),
            new GtExpr(LD, HD)
          ),
          LD,
          new ConstExpr(0)
        ),
        N
      )
    );
    this.addAssign(DMM);
    var PDI = new OutputExpr("PDI",
      new MulExpr(
        new DivExpr(DMP, MTR),
        new ConstExpr(100)
      )
    );
    this.addOutput(PDI);
    var MDI = new OutputExpr("MDI",
      new MulExpr(
        new DivExpr(DMM, MTR),
        new ConstExpr(100)
      )
    );
    this.addOutput(MDI);
    var ADX = new OutputExpr("ADX",
      new ExpmemaExpr(
        new MulExpr(
          new DivExpr(
            new AbsExpr(
              new SubExpr(MDI, PDI)
            ),
            new AddExpr(MDI, PDI)
          ),
          new ConstExpr(100)
        ),
        MM
      )
    );
    this.addOutput(ADX);
    var ADXR = new OutputExpr("ADXR",
      new ExpmemaExpr(ADX, MM)
    );
    this.addOutput(ADXR);
  }

  getName() {
    return "DMI";
  }
}
