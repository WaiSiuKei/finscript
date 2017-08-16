grammar Finscript;

script
 : block EOF
 ;

block
 : (statement | functionDecl)* (Return expression)?
 ;

statement
 : assignment
 | functionCall
 | ifStatement
 | forStatement
 | whileStatement
 ;

assignment
 : Identifier indexes? '=' expression
 ;

functionCall
 : Identifier ('.' Identifier)* '(' exprList? ')'   #identifierFunctionCall
 ;

ifStatement
 : ifStat elseIfStat* elseStat? End
 ;

ifStat
 : If expression ':' block
 ;

elseIfStat
 : Else If expression ':' block
 ;

elseStat
 : Else ':' block
 ;

functionDecl
 : Def Identifier '(' idList? ')' ':' block End
 ;

forStatement
 : For Identifier In Identifier ':' block End
 ;

whileStatement
 : While expression ':' block End
 ;

idList
 : Identifier (',' Identifier)*
 ;

exprList
 : expression (',' expression)*
 ;

expression
 : '-' expression                           #unaryMinusExpression
 | arrowFunction                            #arrowFunctionExpression
 | Excl expression                          #notExpression
 | expression '^' expression                #powerExpression
 | expression '*' expression                #multiplyExpression
 | expression '/' expression                #divideExpression
 | expression '%' expression                #modulusExpression
 | expression '+' expression                #addExpression
 | expression '-' expression                #subtractExpression
 | expression '>=' expression               #gtEqExpression
 | expression '<=' expression               #ltEqExpression
 | expression '>' expression                #gtExpression
 | expression '<' expression                #ltExpression
 | expression '==' expression               #eqExpression
 | expression '!=' expression               #notEqExpression
 | expression And expression                #andExpression
 | expression Or expression                 #orExpression
 | expression '?' expression ':' expression #ternaryExpression
 | NumberLiteral                            #numberExpression
 | BoolLiteral                              #boolExpression
 | NullLiteral                              #nullExpression
 | HexColorLiteral                          #hexColorExpression
 | IndicatorExpr ('(' exprList? ')')?       #exprCallExpression
 | functionCall indexes?                    #functionCallExpression
 | list indexes?                            #listExpression
 | Identifier indexes?                      #identifierExpression
 | StringLiteral indexes?                   #stringExpression
 | objectLiteral indexes?                   #objectLiteralExpression
 | '(' expression ')' indexes?              #expressionExpression
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

bindingPropertyList
  : Identifier (Comma Identifier)*
  ;

conciseBody
  : '{' block '}'
  | { this._input.LT(1).text != '{' }? expression
  ;

list
 : '[' exprList? ']'
 ;

indexes
 : ('.' property)+
 | ('[' expression ']')+
 ;

property
  : Identifier
  ;

Def      : 'def';
If       : 'if';
Else     : 'else';
Return   : 'return';
For      : 'for';
While    : 'while';
To       : 'to';
End      : 'end';
In       : 'in';


And      : 'and';
Or       : 'or';
Excl     : 'not';
Equals   : '==';
NEquals  : '!=';
GTEquals : '>=';
LTEquals : '<=';
Pow      : '^';
GT       : '>';
LT       : '<';
Add      : '+';
Subtract : '-';
Multiply : '*';
Divide   : '/';
Modulus  : '%';
OBrace   : '{';
CBrace   : '}';
OBracket : '[';
CBracket : ']';
OParen   : '(';
CParen   : ')';
SColon   : ';';
Assign   : '=';
Comma    : ',';
QMark    : '?';
Colon    : ':';

objectLiteral
  : '{' '}'
  | '{' propertyDefinitionList  '}'
  | '{' propertyDefinitionList ','  '}'
  ;

propertyDefinitionList
  : propertyDefinition (',' propertyDefinition)*
  ;

propertyDefinition
  : Identifier (':' expression)?
  ;

BoolLiteral
 : 'true'
 | 'false'
 ;

NullLiteral     : 'null';

NumberLiteral
 : Int ('.' Digit*)?
 ;

Identifier
 : [a-zA-Z_]* [a-z_0-9] [a-zA-Z_0-9]*
 ;

IndicatorExpr
  :[A-Z]+
  ;

StringLiteral
 : ["] (~["\r\n] | '\\\\' | '\\"')* ["]
 | ['] (~['\r\n] | '\\\\' | '\\\'')* [']
 ;

HexColorLiteral
  : [#] HexDigit HexDigit HexDigit
  | [#] HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit
  | [#] HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit HexDigit
  ;

Comment
 : ('//' ~[\r\n]* | '/*' .*? '*/') -> skip
 ;
Space
 : [ \t\r\n\u000C] -> skip
 ;
fragment Int
 : [1-9] Digit*
 | '0'
 ;

fragment Digit
 : [0-9]
 ;

fragment HexDigit
 : [0-9a-fA-F]
 ;
