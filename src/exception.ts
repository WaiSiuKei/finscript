import {ParserRuleContext} from "antlr4ts";

export class EvalException extends Error {
  constructor(ctx: ParserRuleContext);
  constructor(ctx: ParserRuleContext, msg: string);
  constructor(ctx: ParserRuleContext, msg?: string) {
    super(msg || "Illegal expression: " + ctx.text + '\nlineNumber:' + ctx.start.line);
  }
}
