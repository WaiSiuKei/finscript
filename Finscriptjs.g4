grammar Finscriptjs;

program
  : moduleItemList? EOF
  ;

moduleItemList
  : moduleItem
  | moduleItemList moduleItem
  ;

moduleItem
  : importDeclaration
  | exportDeclaration
  | sourceElements
  ;

sourceElements
  : sourceElement+
  ;

importDeclaration
  : 'import' importClause fromClause eos
  ;

importClause
  : Identifier
  | namedImports
  | Identifier ',' namedImports
  ;

namedImports
  : '{' importsList '}'
  | '{' importsList ',' '}'
  ;

importsList
  : Identifier
  | importsList ',' Identifier
  ;

fromClause
  : 'from' StringLiteral
  ;


exportDeclaration
  : 'export' declaration
  ;

sourceElement
  : declaration
  | statement
  ;

statement
  : block
  | emptyStatement
  | expressionStatement
  | ifStatement
  | iterationStatement
  | continueStatement
  | breakStatement
  | returnStatement
  | throwStatement
  | tryStatement
  | debuggerStatement
  ;

declaration
  : functionDeclaration
  | lexicalDeclaration
  ;

block
  : '{' statementList? '}'
  ;

statementList
  : statement+
  ;

emptyStatement
  : SemiColon
  ;

expressionStatement
  : {(input.LA(1) != OpenBrace) && (input.LA(1) != Function)}? expressionSequence eos
  ;

ifStatement
  : If '(' expressionSequence ')' statement ( Else statement )?
  ;

iterationStatement
  : Do statement While '(' expressionSequence ')' eos                                                 # DoStatement
  | While '(' expressionSequence ')' statement                                                        # WhileStatement
  | For '(' forBinding In expressionSequence ')' statement                               # ForVarInStatement
  ;

continueStatement
  : Continue eos
  ;

breakStatement
  : Break eos
  ;

returnStatement
  : Return (expressionSequence)? eos
  ;

throwStatement
  : Throw expressionSequence eos
  ;

tryStatement
  : Try block catchProduction
  ;

catchProduction
  : Catch '(' Identifier ')' block
  ;

debuggerStatement
  : Debugger eos
  ;

functionDeclaration
  : Function Identifier '(' formalParameterList? ')' '{' functionBody '}'
  ;

lexicalDeclaration
  : variableDelaration
  | constantDelaration
  ;

variableDelaration
  : Var lexicalBinding eos
  ;

constantDelaration
  : Const lexicalBinding eos
  ;

forBinding
  : Identifier
//    | bindingPattern
  ;

lexicalBinding
  : Identifier initialiser?
//  | bindingPattern initialiser
  ;

bindingPattern
  : objectBindingPattern
//    | arrayBindingPattern
  ;

objectBindingPattern
  : '{' bindingPropertyList '}'
  | '{' bindingPropertyList Comma '}'
  ;

bindingPropertyList
  : bindingProperty (Comma bindingProperty)*
  ;

bindingProperty
  : singleNameBinding
  | propertyName Colon bindingElement
  ;

bindingElement
  : singleNameBinding
  | bindingPattern initialiser?
  ;

singleNameBinding
  : Identifier initialiser?
  ;

//arrayBindingPattern
//    : '[' elision? bindingRestElement? ']'
//    | '[' bindingElementList ']'
//    | '[' bindingElementList elision? bindingRestElement ']'
//    ;
//
//bindingElementList
//    : bindingElisionElement
//    | bindingElementList bindingElisionElement
//    ;
//
//bindingElisionElement
//    : elision? bindingElement
//    ;

bindingRestElement
  : '...' Identifier
  ;

initialiser
  : '=' singleExpression
  ;

formalParameterList
  : functionRestParameter
  | formalsList
  | formalsList ',' functionRestParameter
  ;

formalsList
  : formalParameter
  | formalsList ',' formalParameter
  ;

functionRestParameter
  : bindingRestElement
  ;

formalParameter
  : bindingElement
  ;

functionBody
  : sourceElements?
  ;

arrayLiteral
  : '[' elementList? ','? elision? ']'
  ;

elementList
  : elision? singleExpression ( ',' elision? singleExpression )*
  ;

elision
  : ','+
  ;

objectLiteral
  : '{' '}'
  | '{' propertyDefinitionList  '}'
  | '{' propertyDefinitionList ','  '}'
  ;

propertyDefinitionList
  : propertyDefinition
  | propertyDefinitionList ',' propertyDefinition
  ;

propertyDefinition
  : propertyName ':' singleExpression
  | methodDefinition
  ;

methodDefinition
  : propertyName '(' formalParameterList? ')' '{' functionBody '}'
//    | getter '(' ')' '{' functionBody '}'
//    | setter '(' formalParameter ')' '{' functionBody '}'
  ;

propertyName
  : literalPropertyName
  | computedPropertyName
  ;

literalPropertyName
  : identifierName
  | StringLiteral
  | numericLiteral
  ;

computedPropertyName
  : '[' singleExpression ']'
  ;

propertySetParameterList
  : Identifier
  ;

arguments
  : '(' argumentList? ')'
  ;

argumentList
  : singleExpression ( ',' singleExpression )*
  ;

expressionSequence
  : singleExpression ( ',' singleExpression )*
  ;

singleExpression
  : Function Identifier? '(' formalParameterList? ')' '{' functionBody '}' # FunctionExpression
  | arrowFunction                                                          # ArrowFunctionExpression
  | singleExpression '[' expressionSequence ']'                            # MemberIndexExpression
  | singleExpression '.' identifierName                                    # MemberDotExpression
  | singleExpression arguments                                             # ArgumentsExpression
// | New singleExpression arguments?                                        # NewExpression
  | Delete singleExpression                                                # DeleteExpression
  | '+' singleExpression                                                   # UnaryPlusExpression
  | '-' singleExpression                                                   # UnaryMinusExpression
  | '!' singleExpression                                                   # NotExpression
  | singleExpression ( '*' | '/' | '%' | '^' ) singleExpression                  # MultiplicativeExpression
  | singleExpression ( '+' | '-' ) singleExpression                        # AdditiveExpression
  | singleExpression ( '<' | '>' | '<=' | '>=' ) singleExpression          # RelationalExpression
  | singleExpression ( '==' | '!=' ) singleExpression                      # EqualityExpression
  | singleExpression '&&' singleExpression                                 # LogicalAndExpression
  | singleExpression '||' singleExpression                                 # LogicalOrExpression
  | singleExpression '?' singleExpression ':' singleExpression             # TernaryExpression
  | singleExpression '=' singleExpression                                  # AssignmentExpression
  | singleExpression '..' singleExpression                                 # RangeExpression
  | Identifier                                                             # IdentifierExpression
  | literal                                                                # LiteralExpression
  | arrayLiteral                                                           # ArrayLiteralExpression
  | objectLiteral                                                          # ObjectLiteralExpression
  | '(' expressionSequence ')'                                             # ParenthesizedExpression
  ;


arrowFunction
  : arrowParameters '=>' conciseBody
  ;

arrowParameters
  : Identifier
  | coverParenthesizedExpressionAndArrowParameterList
  ;

coverParenthesizedExpressionAndArrowParameterList
  : '(' ')'
  | '(' bindingPropertyList ')'
  | '(' bindingPropertyList Comma ')'
  ;

conciseBody
  : { input.LA(1) != '{' }? singleExpression
  | '{' functionBody '}'
  ;

literal
  : ( NullLiteral
   | BooleanLiteral
   | StringLiteral
   )
  | numericLiteral
  ;

numericLiteral
  : DecimalLiteral
  ;

identifierName
  : Identifier
  | reservedWord
  ;

reservedWord
  : keyword
  | futureReservedWord
  | ( NullLiteral
   | BooleanLiteral
   )
  ;

keyword
  : Break
  | Do
  | Delete
// | Instanceof
// | Typeof
  | Else
  | New
  | Var
  | Catch
  | Return
  | Continue
  | For
  | While
  | Function
  | This
  | If
  | Throw
  | Delete
  | In
  | Try
  ;

futureReservedWord
  : Class
  | Enum
  | Extends
  | Super
  | Const
  | Export
  | Import
  | Implements
  | Private
  | Public
  | Interface
  | Package
  | Protected
  | Static
  | Yield
  ;

getter
  : {input.LT(1).getText().equals("get")}? Identifier propertyName
  ;

setter
  : {input.LT(1).getText().equals("set")}? Identifier propertyName
  ;

eos
  : SemiColon
  | EOF
  | {input.LT(1).getType() == CloseBrace}?
  ;

eof
  : EOF
  ;

LineTerminator
  : [\r\n\u2028\u2029] -> channel(HIDDEN)
  ;

OpenBracket                : '[';
CloseBracket               : ']';
OpenParen                  : '(';
CloseParen                 : ')';
OpenBrace                  : '{';
CloseBrace                 : '}';
SemiColon                  : ';';
Comma                      : ',';
Assign                     : '=';
QuestionMark               : '?';
Colon                      : ':';
Dot                        : '.';
Plus                       : '+';
Minus                      : '-';
Not                        : '!';
Multiply                   : '*';
Divide                     : '/';
Modulus                    : '%';
LessThan                   : '<';
MoreThan                   : '>';
LessThanEquals             : '<=';
GreaterThanEquals          : '>=';
Equals                     : '==';
NotEquals                  : '!=';
And                        : '&&';
Or                         : '||';

NullLiteral
  : 'null'
  ;

BooleanLiteral
  : 'true'
  | 'false'
  ;

DecimalLiteral
  : DecimalIntegerLiteral '.' DecimalDigit* ExponentPart?
  | '.' DecimalDigit+ ExponentPart?
  | DecimalIntegerLiteral ExponentPart?
  ;

//Keyword
Break           : 'break';
Catch           : 'catch';
Const           : 'const';
Continue        : 'continue';
Debugger        : 'debugger';
Delete          : 'delete';
Do              : 'do';
Else            : 'else';
Export          : 'export';
For             : 'for';
Function        : 'function';
Finally         : 'finally';
If              : 'if';
Import          : 'import';
In              : 'in';
InstanceOf      : 'instanceof';
Return          : 'return';
Throw           : 'throw';
Try             : 'try';
Typeof          : 'typeof';
Var             : 'var';
While           : 'while';

//FutureReservedWord
Abstract        : 'abstarct';
Class           : 'class';
Enum            : 'enum';
Extends         : 'extends';
Implements      : 'implements';
Interface       : 'interface';
New             : 'new';
Override        : 'override';
Private         : 'private';
Public          : 'public';
Protected       : 'protected';
Package         : 'package';
Static          : 'static';
Super           : 'super';
This            : 'this';
Yield           : 'yield';

Identifier
  : IdentifierStart IdentifierPart*
  ;

StringLiteral
  : '"' DoubleStringCharacter* '"'
  | '\'' SingleStringCharacter* '\''
  ;

WhiteSpaces
  : [\t\u000B\u000C\u0020\u00A0]+ -> channel(HIDDEN)
  ;

MultiLineComment
  : '/*' .*? '*/' -> channel(HIDDEN)
  ;

SingleLineComment
  : '//' ~[\r\n\u2028\u2029]* -> channel(HIDDEN)
  ;

fragment DoubleStringCharacter
  : ~["\\\r\n]
  | LineContinuation
  ;

fragment SingleStringCharacter
  : ~['\\\r\n]
  | LineContinuation
  ;

fragment LineContinuation
  : '\\' LineTerminatorSequence
  ;

fragment LineTerminatorSequence
  : '\r\n'
  | LineTerminator
  ;

fragment DecimalDigit
  : [0-9]
  ;

fragment DecimalIntegerLiteral
  : '0'
  | [1-9] DecimalDigit*
  ;

fragment ExponentPart
  : [eE] [+-]? DecimalDigit+
  ;

fragment IdentifierStart
  : UnicodeLetter
  | [_]
  ;

fragment IdentifierPart
  : IdentifierStart
  | DecimalDigit
  ;

fragment UnicodeLetter
  : [\u0041-\u005A]
  | [\u0061-\u007A]
  | [\u4E00-\u9FA5] // Chinese character
  ;
