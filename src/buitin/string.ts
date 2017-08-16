import { ObjectLiteral } from "src/value";
import { PrimaryValue } from "src/base";

export const string = new ObjectLiteral()

export class StringLiteral extends PrimaryValue {
  static createInstance(val) {
    let instance = new StringLiteral(val)
    instance.prototype = string
    return instance
  }
}
