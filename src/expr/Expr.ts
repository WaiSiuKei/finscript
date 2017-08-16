import { PrimaryValue } from "src/base";

export abstract class Expr extends PrimaryValue {
  protected _rid: number;

  constructor() {
    super({})
    this.type = 'expr'
    this.value = ''
    this._rid = 0
  }

  abstract execute(index: number): number;

  reserve(rid: number, count: number) {
  }

  clear() {
  }

  public toString() {
    return `[ Expr expr ]`
  }
}
