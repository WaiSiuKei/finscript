import {Indicator} from "src/indicator/Indicator";
import {OutputExpr} from "src/expr/OutputExpr";
import {CloseExpr} from "src/expr/CloseExpr";

export class CloseIndicator extends Indicator {
  constructor() {
    super()
    this.addOutput(new OutputExpr("CLOSE",
      new CloseExpr(),
    ));
  }

  getName() {
    return "CLOSE";
  }
}
