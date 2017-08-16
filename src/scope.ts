import { IPrimaryValue, IScope, Null } from "src/base";

export class Scope implements IScope{

  private _parent: Scope;
  public variables: Map<String, IPrimaryValue | Function>;
  private stack: Map<String, IPrimaryValue[]>;

  constructor();
  constructor(p: Scope);
  constructor(p: Scope = null) {
    this._parent = p;
    this.variables = new Map<String, IPrimaryValue | Function>();
    this.stack = new Map<String, IPrimaryValue[]>();
  }

  public assignParam(variable: string, value: IPrimaryValue | Function): void {
    this.variables.set(variable, value);
  }

  public assign(variable: string, value: IPrimaryValue | Function): void {
    if (this.resolve(variable)) {
      // There is already such a variable, re-assign it
      this.reAssign(variable, value);
    }
    else {
      // A newly declared variable
      this.variables.set(variable, value);
    }
  }

  public copy(): Scope {
    let s = new Scope();
    s.variables = new Map<String, IPrimaryValue | Function>(this.variables);
    s.parent = this.parent;
    return s;
  }

  public createChild(): Scope {
    return new Scope(this)
  }

  public isGlobalScope(): boolean {
    return !this._parent;
  }

  public parent(): Scope {
    return this._parent;
  }

  private reAssign(identifier: string, value: IPrimaryValue | Function): void {
    if (this.variables.has(identifier)) {
      // The variable is declared in this scope
      this.variables.set(identifier, value);
    }
    else if (this.parent != null) {
      // The variable was not declared in this scope, so let
      // the parent scope re-assign it
      this._parent.reAssign(identifier, value);
    }
  }

  public resolve(variable: string): IPrimaryValue | Function {
    let value = this.variables.get(variable);
    if (value != null) {
      // The variable resides in this scope
      return value;
    }
    else if (!this.isGlobalScope()) {
      // Let the parent scope look for the variable
      return this._parent.resolve(variable);
    }
    else {
      // Unknown variable
      return null;
    }
  }

  public push(type: string, val: IPrimaryValue): void {
    if (!this.stack.has(type)) this.stack.set(type, [])
    this.stack.get(type).push(val)
  }

  public pop(type: string): IPrimaryValue | Function {
    if (!this.stack.has(type)) return Null
    return this.stack.get(type).pop()
  }

  public peek(type: string): IPrimaryValue | Function {
    if (!this.stack.has(type)) return Null
    let arr = this.stack.get(type)
    return arr[arr.length - 1]
  }

  public clear(type: string): void {
    if (!this.stack.has(type)) return
    this.stack.set(type, [])
  }
}
