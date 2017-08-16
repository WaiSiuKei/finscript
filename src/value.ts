import { object } from "src/buitin/object";
import { PrimaryValue } from "src/base";
import { Scope } from "src/scope";


export class ReturnValue extends Error {
  public value: PrimaryValue;
}

export class ObjectLiteral extends PrimaryValue {
  public scope: Scope;

  constructor(prototype?: Scope) {
    super({})
    this.scope = new Scope(prototype)
  }

  static createInstance(val) {
    return new ObjectLiteral(object)
  }

  resolve(id) {
    return this.scope.resolve(id)
  }

  assign(id, val) {
    this.scope.assign(id, val)
  }

  toString() {
    let ret = {}
    let iterator = this.scope.variables.keys()
    let key
    while (key = iterator.next().value) {
      let val = this.resolve(key)
      ret[key] = typeof val === 'function' ? val : val.value
    }
    return JSON.stringify(ret)
  }
}

