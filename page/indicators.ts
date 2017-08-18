export const BOLL = `n = CONST(20)
std_close_n = STD(C, n)
boll = MA(C, n)
ub = boll + n * std_close_n
lb = boll - n * std_close_n
return { boll, ub, lb }
`

export const BRAR = `n = CONST(26)
ref_close_1 = REF(CLOSE, 1)
br = SUM(MAX(H - ref_close_1, 0), n) / SUM(MAX(ref_close_1 - L, 0), n) * 100
ar = SUM(H - O, n) / SUM(O - L, n) * 100
return { br, ar }
`

export const CLOSE = `c = C
return c`

export const DMA = `n1 = CONST(10)
n2 = CONST(50)
m = CONST(10)
dif = MA(C, n1) - MA(C, n2)
difma = MA(dif, m)
return { dif, difma }
`

export const DMI = `n = CONST(14)
m = CONST(6)
mtr = EXPMEMA(MAX(H - L, ABS(H - REF(C, 1)), ABS(REF(C, 1) - L)), n)
hd = H - REF(H, 1)
ld = REF(L, 1) - L
dmp = EXPMEMA(hd > 0 and hd > ld ? hd : 0, n)
dmm = EXPMEMA(ld > 0 and ld > hd ? ld : 0, n)
pdi = dmp / mtr * 100
mdi = dmm / mtr * 100
adx = EXPMEMA(ABS(mdi - pdi) / (mdi + pdi) * 100, m)
adxr = EXPMEMA(adx, m)
return { pdi, mdi, adx, adxr }`

export const EMA = `ema5 = EMA(C, 5)
ema20 = EMA(C, 20)
return { ema5, ema20 }`

export const EMV = `n = CONST(14)
vol = MA(V, n) / V
hl = H + L
mid = (hl - REF(hl, 1)) / hl *100
emv = MA(mid * (V * (H - L)) / MA(H - L, n), n)
return emv
`

export const HLC = `h = H
l = L
c = C
return { h, l, c}`

export const KDJ = `n = CONST(9)
m1 = CONST(3)
m2 = CONST(3)
hhv = HHV(H, n)
llv = LLV(L, n)
rsv = (C - llv) / (hhv - llv) * 100
k = EMA(rsv, m1 * 2 - 1)
d = EMA(k, m2 * 2 - 1)
j = k * 3 - d * 2
return { k, d, j }
`

export const MACD = `short = CONST(12)
long = CONST(26)
mid = CONST(9)
dif = EMA(C, short) - EMA(C, long)
dea = EMA(dif, mid)
macd = (dif - dea) * 2
return { dif, dea, macd }
`

export const MA = `ma5 = MA(C, 5)
ma20 = MA(C, 20)
return { ma5, ma20 }
`

export const MTM = `n = CONST(12)
mtm = C - REF(C, n)
return mtm
`

export const OBV = `ref_close_1 = REF(C, 1)
va = C > ref_close_1 ? V : -V
obv = SUM(C == ref_close_1 ? va : 0, 0)
return obv
`

export const PSY = `n = CONST(12)
psy = COUNT(C > REF(C, 1), n) / n * 100
return psy
`

export const ROS = `n = CONST(12)
ref_close_n = REF(C, n)
roc = (C - ref_close_n) / ref_close_n * 100
return roc
`
export const RSI = `n1 = CONST(6)
n2 = CONST(12)
n3 = CONST(24)
lc = REF(C, 1)
close_lc = C - lc
rsiExpr = n => SMA(MAX(close_lc, 0), n, 1) / SMA(ABS(close_lc), n, 1)
rsi1 = rsiExpr(n1)
rsi2 = rsiExpr(n2)
rsi3 = rsiExpr(n3)
return { rsi1, rsi2, rsi3 }
`

export const SAR = `n = CONST(4)
min = CONST(2)
step = CONST(2)
max = CONST(20)
sar = SAR(n, min, step, max)
return sar
`

export const STOCHRSI = `n = CONST(14)
m = CONST(14)
p1 = CONST(3)
lc = REF(C, 1)
close_lc = C - lc
rsi = SMA(MAX(close_lc, 0), n, 1) / SMA(ABS(close_lc), n, 1)
stochrsi = MA(rsi - LLV(rsi, m), p1) / MA(HHV(rsi, m) - LLV(rsi, m), p1) * 100
return stochrsi
`

export const TRIX = `n = CONST(12)
mtr = EMA(EMA(EMA(C, n), n), n)
last_mtr = REF(mtr, 1)
trix = (mtr - last_mtr) / last_mtr * 100
return trix
`

export const VOLUME = `v = V
return v`

export const VR = `n = CONST(26)
m = CONST(6)
lc = REF(C, 1)
th = SUM(C > lc ? V : 0, n)
tl = SUM(C < lc ? V : 0, n)
tq = SUM(C == lc ? V : 0, n)
vr = (th * 2 + tq) / (tl * 2 + tq) * 100
return vr
`

export const WR = `n = CONST(10)
hhv = HHV(H, n)
llv = LLV(L, n)
wr = (hhv - C) / (hhv - llv) * 100
return wr
`
