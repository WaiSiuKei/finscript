import { ExpressionContext } from "gen/FinscriptParser";

export class IPrimaryValue {
  type: string;
  prototype?: any;
  value: any;
  equals?: (o: any) => Boolean;
  toString: () => string;
  createInstance?: (val) => IPrimaryValue;
}

export class IScope {
  assign: (variable: string, value: IPrimaryValue | IFunction) => void;
  resolve: (variable: string) => IPrimaryValue | Function;
  variables: Map<String, IPrimaryValue | Function>;
}

export interface IFunction extends IPrimaryValue{
  invoke(params: ExpressionContext[], functions: Map<String, IFunction>, scope: IScope): IPrimaryValue;
}

export class PrimaryValue implements IPrimaryValue {
  public value: any;
  public type: string;
  public prototype: any;

  constructor();
  constructor(val);
  constructor(val?) {
    if (val === undefined) {
      this.value = null
      this.type = 'null'
    }
    else {
      this.value = val;
      this.type = typeof val
    }
  }

  public equals(o: any) {
    if (this == o) return true;
    if (this.type != o.type) return false;

    return this.value === o.value;
  }

  public toString() {
    return this.type === 'null' ? "Null" : String(this.value);
  }
}

export const Null = new PrimaryValue()
