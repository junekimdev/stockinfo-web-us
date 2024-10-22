export type TypeError = { code: number; message: string };
export type TypeRectCoordi = { x: number; y: number; w: number; h: number };

export type TypePriceRequestType = 'daily' | 'weekly' | 'latest';
export type TypeAvgMethod = 'simple' | 'exponential' | 'weighted';
export type TypePriceValue = 'close' | 'open' | 'high' | 'low';
export type TypePriceVolumeValue = TypePriceValue | 'volume';
export type TypeChart =
  | 'price'
  | 'mini-price'
  | 'volume'
  | 'percent-change'
  | 'heikin-aski'
  | 'heikin-aski-smoothed'
  | 'adx'
  | 'rsi'
  | 'macd'
  | 'macd-v'
  | 'atrp'
  | 'co'
  | 'cmf'
  | 'so';
export type TypeDartReportCode = '11011' | '11012' | '11013' | '11014';
export type TypeDartIndexCode = 'M210000' | 'M220000' | 'M230000' | 'M240000';
export type TypeDartStatementType = 'OFS' | 'CFS';

export type TypeIDWeek = { year: number; week: number };
export type TypeDate = { date: Date | TypeIDWeek };

export type TypePriceRequest = { code: string; type: TypePriceRequestType };
export type TypeChartRequest = { code: string; type: TypeChart };
export type TypeIDPriceMA = TypePriceRequest & { method: TypeAvgMethod; period: number };

export type TypeChartData =
  | TypePrice
  | TypePriceVolume
  | TypePricePercentChange
  | TypeParabolicSAR
  | TypeMovingAvg
  | TypePriceBollingerBands
  | TypeAdx
  | TypeRsi
  | TypeMacd
  | TypeMacdV
  | TypeAtrp
  | TypeChaikin
  | TypeStochastic;
export type TypePrice = TypeDate & {
  open: number;
  close: number;
  high: number;
  low: number;
};
export type TypePriceVolume = TypePrice & { volume: number };
export type TypePriceVolumeRaw = TypePriceVolume & {
  trading_value: number;
  base_stock_cnt: number;
};
export type TypePricePercentChange = TypeDate & { percent_change: number };
export type TypeParabolicSAR = TypeDate & { sar: number; isUpTrend: boolean };
export type TypeMovingAvg = TypeDate & { avg: number };
export type TypePriceBollingerBands = TypeDate & {
  upper: number;
  middle: number;
  lower: number;
};
export type TypeAdx = TypeDate & { posDI: number; negDI: number; adx: number };
export type TypeRsi = TypeDate & { rsi: number };
export type TypeMacd = TypeDate & { macd: number; signal: number; histogram: number };
export type TypeMacdV = TypeDate & { macdV: number; signal: number; histogram: number };
export type TypeAtrp = TypeDate & { atrp: number };
export type TypeChaikin = TypeDate & { cmf: number; co: number };
export type TypeStochastic = TypeDate & { fullK: number; fullD: number };

export type TypePriceDisplayItem = 'LatestPrice' | 'ParabolicSAR' | 'BollingerBands';
export type TypeAdxDisplayItem = 'ADX' | 'pDI' | 'nDI' | 'buy' | 'sell' | 'trendConfirm';
export type TypeRsiDisplayItem = 'overbought' | 'oversold';
export type TypeMacdDisplayItem = 'MACD' | 'signal' | 'histogram';
export type TypeMacdVDisplayItem =
  | 'MACDV'
  | 'signal'
  | 'histogram'
  | 'overbought'
  | 'oversold'
  | 'upsideMomentum'
  | 'downsideMomentum';
export type TypeCMFDisplayItem = 'noSignalZone';
export type TypeStochasticDisplayItem =
  | 'fullK'
  | 'fullD'
  | 'overbought'
  | 'oversold'
  | 'trendConfirm';
export type TypePriceDisplay = {
  LatestPrice: boolean;
  ParabolicSAR: boolean;
  BollingerBands: boolean;
};

export type TypeAdxDisplay = {
  ADX: boolean;
  pDI: boolean;
  nDI: boolean;
  buy: boolean;
  sell: boolean;
  trendConfirm: boolean;
};
export type TypeRsiDisplay = { overbought: boolean; oversold: boolean };
export type TypeMacdDisplay = { MACD: boolean; signal: boolean; histogram: boolean };
export type TypeMacdVDisplay = {
  MACDV: boolean;
  signal: boolean;
  histogram: boolean;
  overbought: boolean;
  oversold: boolean;
  upsideMomentum: boolean;
  downsideMomentum: boolean;
};
export type TypeCMFDisplay = { noSignalZone: boolean };
export type TypeStochasticDisplay = {
  fullK: boolean;
  fullD: boolean;
  overbought: boolean;
  oversold: boolean;
  trendConfirm: boolean;
};

export type TypeCompany = {
  cik: string;
  code: string;
  name: string;
};
export type TypeCompanyTab = {
  uuid: string;
  company: TypeCompany;
  mainType: TypePriceRequestType;
};

export type TypeEdgarStatementResRaw = {
  cik: string;
  outstandingStock: TypeEdgarStatementItemRaw[];
  assets: TypeEdgarStatementItemRaw[];
  equity: TypeEdgarStatementItemRaw[];
  liabilities: TypeEdgarStatementItemRaw[];
  revenue: TypeEdgarStatementItemRaw[];
  operatingIncome: TypeEdgarStatementItemRaw[];
  netIncome: TypeEdgarStatementItemRaw[];
  comprehensiveIncome: TypeEdgarStatementItemRaw[];
  operatingCashFlow: TypeEdgarStatementItemRaw[];
  investingCashFlow: TypeEdgarStatementItemRaw[];
  financingCashFlow: TypeEdgarStatementItemRaw[];
};
export type TypeEdgarStatementItemRaw = {
  date?: string;
  start_date?: string;
  end_date?: string;
  value: string;
};
export type TypeEdgarStatementRes = {
  cik: string;
  outstandingStock: TypeEdgarStatementItem[];
  assets: TypeEdgarStatementItem[];
  equity: TypeEdgarStatementItem[];
  liabilities: TypeEdgarStatementItem[];
  revenue: TypeEdgarStatementItem[];
  operatingIncome: TypeEdgarStatementItem[];
  netIncome: TypeEdgarStatementItem[];
  comprehensiveIncome: TypeEdgarStatementItem[];
  operatingCashFlow: TypeEdgarStatementItem[];
  investingCashFlow: TypeEdgarStatementItem[];
  financingCashFlow: TypeEdgarStatementItem[];
};
export type TypeEdgarStatementItem = {
  date: Date;
  value: number;
};
