export type MyError = { code: number; message: string };
export type RectCoordi = { x: number; y: number; w: number; h: number };

export type PriceRequestType = 'daily' | 'weekly' | 'latest';
export type AvgMethod = 'simple' | 'exponential' | 'weighted';
export type PriceItem = 'close' | 'open' | 'high' | 'low';
export type PriceVolumeItem = PriceItem | 'volume';

export type IDWeek = { year: number; week: number };
export type MyDate = { date: Date | IDWeek };
export type PriceRequest = { code: string; type: PriceRequestType };
export type IDPriceMA = PriceRequest & { method: AvgMethod; period: number };

export type Price = MyDate & Record<PriceItem, number>;
export type PriceVolume = MyDate & Record<PriceVolumeItem, number>;
export type PriceVolumeRaw = PriceVolume & {
  trading_value: number;
  base_stock_cnt: number;
};
export type PricePercentChange = MyDate & { percent_change: number };
export type ParabolicSAR = MyDate & { sar: number; isUpTrend: boolean; distance: number };
export type MovingAvg = MyDate & { avg: number };
export type PriceBollingerBands = MyDate & {
  upper: number;
  middle: number;
  lower: number;
};
export type Adx = MyDate & { posDI: number; negDI: number; adx: number };
export type Rsi = MyDate & { rsi: number };
export type Macd = MyDate & { macd: number; signal: number; histogram: number };
export type MacdV = MyDate & { macdV: number; signal: number; histogram: number };
export type Atrp = MyDate & { atrp: number };
export type Chaikin = MyDate & { cmf: number; co: number };
export type Stochastic = MyDate & { fullK: number; fullD: number };
export type ChartData =
  | Price
  | PriceVolume
  | PricePercentChange
  | ParabolicSAR
  | MovingAvg
  | PriceBollingerBands
  | Adx
  | Rsi
  | Macd
  | MacdV
  | Atrp
  | Chaikin
  | Stochastic;

export type CompanyRaw = {
  cik_str?: string;
  ticker?: string;
  title?: string;
};
export type Company = {
  name: string;
  fullName: string;
  codePrice: string;
  codeReport: string;
  mkt: string;
};
export type CompanyTab = {
  uuid: string;
  company: Company;
  mainType: PriceRequestType;
};

export type EdgarStatementResRaw = {
  cik: string;
  outstandingStock: EdgarStatementItemRaw[];
  assets: EdgarStatementItemRaw[];
  equity: EdgarStatementItemRaw[];
  liabilities: EdgarStatementItemRaw[];
  revenue: EdgarStatementItemRaw[];
  operatingIncome: EdgarStatementItemRaw[];
  netIncome: EdgarStatementItemRaw[];
  comprehensiveIncome: EdgarStatementItemRaw[];
  operatingCashFlow: EdgarStatementItemRaw[];
  investingCashFlow: EdgarStatementItemRaw[];
  financingCashFlow: EdgarStatementItemRaw[];
};
export type EdgarStatementItemRaw = {
  date?: string;
  start_date?: string;
  end_date?: string;
  value: string;
};
export type EdgarStatementRes = {
  cik: string;
  outstandingStock: EdgarStatementItem[];
  assets: EdgarStatementItem[];
  equity: EdgarStatementItem[];
  liabilities: EdgarStatementItem[];
  revenue: EdgarStatementItem[];
  operatingIncome: EdgarStatementItem[];
  netIncome: EdgarStatementItem[];
  comprehensiveIncome: EdgarStatementItem[];
  operatingCashFlow: EdgarStatementItem[];
  investingCashFlow: EdgarStatementItem[];
  financingCashFlow: EdgarStatementItem[];
};
export type EdgarStatementItem = {
  date: Date;
  value: number;
};
