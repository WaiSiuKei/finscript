# Finscript

Technical analysis domain specific language for creating reusable indicator calculator


## Demo
- [playground](https://waisiukei.github.io/finscript)

## Doc
###  Primitive types
- Number：
``` finscript
a = 1
b = 2.3
```

- Boolean
``` finscript
a = true
b = false
```

- String
``` finscript
a = 'blah blah'
b = "blah blah"
c = '中文'
```

- Object
``` finscript
a = {}
b = { a: 1, b: 2 }
c = { a, b }
d = { c, f: {} }
```

- Array
```finscript
a = [1, 2, 3]
b = [{ open: 10, close: 12 }, { open: 12, close: 14 }]
```

- Color
``` finscript
a = #fff
b = #123456
c = #123456ff
```

- Null
``` finscript
a = null
```

### Comment
- Single-line comment
``` finscript
// FIXME
```

- Multi-line comment
``` finscript
/*
  blah
  blah
  blah
*/
```

### Operator
- Assign：`=`
- Add：`+`
- Subtract：`-`
- Multiply：`*`
- Divide：`/`
- Modulus：`%`
- Pow：`^`
- Greater than：`>`
- Less than：`<`
- Greater than or equal：`>=`
- Less than or equal：`<=`
- Equal：`==`
- Not equal：`!==`
- And：`and`
- Or：`or`
- Not：`not`
- Conditional operator： `condition ? expression : expression`

### statement
- `if` statement: 
``` finscript
if a ==1 :
  // do something
else if a == 2:
  // do something
end
```

- For loop:
``` finscript
for i in array:
  // do something
end
```

- While loop:
``` finscript
while true:
  // do something
end
```

### Function
- Function declaration: 
``` finscript
def print(a):
  Console.log(a)
end
```

- Arrow function: 
``` finscript
add = (a, b) => a + b
inc = a => a + 1
```
- Function call: 
``` finscript
Console.log(1)
```



### Indicator operator

- Open price：`OPEN` `O`
- Close price：`CLOSE` `C`
- High price：`HIGH` `H`
- Low price：`LOW` `L`
- Bar volume：`VOLUME` `V` `VOL`

- Absolute value：`ABS`
``` finscript
ABS(O - C)
```

- Arctangent：`ATAN`
``` finscript
ATAN(C)
```

- Ceil: `CEIL`
``` finscript
CEIL(2.3) // 3 
```

- Constant：`CONST`
``` finscript
CONST(1)
```

- Cosine：`COS`
``` finscript
COS(C)
```

- Count bars if condition is true：`COUNT`
``` finscript
COUNT(CLOSE > OPEN, 10)
```

- Exponentially weighted moving average：`EMA`
``` finscript
EMA(C, 10)
```

- Exponential Function: `EXP`
``` finscript
EXP(2) // e^2
```

- Expmema: `EXPMEMA`
``` finscript
EXPMEMA(C, 10)
```

- Floor: `FLOOR`
``` finscript
FLOOR(2.5) // 2
```

- Max value of n bars：`HHV`
``` finscript
HHV(MAX(O, C), 60)
```

- Min value of n bars：`LLV`
``` finscript
LLV(MIN(O, C), 60)
```

- Natural logarithm：`LN`
``` finscript
LN(C)
```

- Base-10 logarithmic：`LOG`
``` finscript
LOG(C)
```

- Moving average：`MA`
``` finscript
MA(C, 60)
```

- Greater of two or more values：`MAX`
``` finscript
MAX(O, C)
MAX(O, C, 100)
```

- Smaller of two or more values：`MIN`
``` finscript
MIN(O, C)
MIN(O, C, 100, REF(C, 1))
```

- Mathematical power function: `POW`
``` finscript
POW(C, 2)
```

- Round: `ROUND`
``` finscript
ROUND(C)
```

- Previous values ：`REF`
``` finscript
REF(C, 10)
```

- Sar：`SAR`
``` finscript
step = 2
```

- Sine：`COS`
``` finscript
SIN(C)
```

- Simple moving average：`SMA`
``` finscript
SMA(C, 10)
```

- Square root ：`SQRT`
``` finscript
SQRT(C)
```

- Standard deviation：`STD`
``` finscript
STD(C, 10)
```

- Sliding sum: `SUM`
``` finscript
SUM(C, 10)
```

- Trigonometric tangent：`TAN`
``` finscript
TAN(C)
```

### Creating new operator
```finscript
prevClose = REF(C, 1)
prevLow = REF(L, 1)
true_range = MAX(H - L, H - prevLow, L - prevClose)
```

### Indicator

Checkout [demo](https://github.com/finscript/src/page/indicators.ts)

### Built-in funciton
#### Number
- Number.parseInt
- Number.parseFloat
- Number.prototype.toExponential
- Number.prototype.toFixed
- Number.prototype.toPrecision
### Console
- Console.log
