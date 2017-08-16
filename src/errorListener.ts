import {ParserErrorListener} from "antlr4ts";

export class FinscriptErrorListener implements ParserErrorListener{

  private _isValid = true;
  private _errorMessage: string;

  public get isValid() {
    return this._isValid;
  }


  public get errorMessage() {
    return this._errorMessage;
  }

  public syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
    this._isValid = false;
    this._errorMessage = `line ${line}:${column} ${msg}`;
  }

  /**
   * Method stub - does nothing
   * @param recognizer
   * @param dfa
   * @param startIndex
   * @param stopIndex
   * @param exact
   * @param ambigAlts
   * @param configs
   */
  public reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
  };

  /**
   * Method stub - does nothing
   * @param recognizer
   * @param dfa
   * @param startIndex
   * @param stopIndex
   * @param conflictingAlts
   * @param configs
   */
  public reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
  };

  /**
   * Method stub - does nothing
   * @param recognizer
   * @param dfa
   * @param startIndex
   * @param stopIndex
   * @param prediction
   * @param configs
   */
  public reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
  };
}
