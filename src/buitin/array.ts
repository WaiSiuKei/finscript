import { ObjectLiteral } from "src/value";
import { PrimaryValue } from "src/base";

export const array = new ObjectLiteral()

export class ArrayLiteral extends PrimaryValue {
  constructor(val) {
    super(val)
    this.type = 'array'
  }

  static createInstance(val) {
    let instance = new ArrayLiteral(val)
    instance.prototype = array
    return instance
  }

  toString() {
    return `[${this.value.map(e => e.toString()).join(', ')}]`
  }
}
