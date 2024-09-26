export type TypeError = { code: number; message: string };

export type TypePriceRequestType = 'daily' | 'weekly' | 'latest';
export type TypeAvgMethod = 'simple' | 'exponential' | 'weighted';
export type TypeAvgValue = 'close' | 'open' | 'high' | 'low';
export type TypeChart =
  | 'price'
  | 'percent-change'
  | 'heikin-aski'
  | 'heikin-aski-smoothed'
  | 'mini-price'
  | 'volume';

export type TypeIDWeek = { year: number; week: number };
export type TypeDate = { date: Date | TypeIDWeek };

export type TypePriceRequest = { code: string; type: TypePriceRequestType };
export type TypeChartRequest = { code: string; type: TypeChart };
export type TypeIDPriceMA = TypePriceRequest & { method: TypeAvgMethod; period: number };

export type TypePrice = TypeDate & {
  open: number;
  close: number;
  high: number;
  low: number;
};
export type TypePricePercentChange = TypeDate & { percent_change: number };
export type TypePriceVolume = TypePrice & { volume: number };
export type TypeParabolicSAR = TypeDate & { sar: number; isUpTrend: boolean };
export type TypeMovingAvg = TypeDate & { avg: number };
export type TypePriceBollingerBands = TypeDate & {
  upper: number;
  middle: number;
  lower: number;
};

export type TypeChartData =
  | TypePrice
  | TypePriceVolume
  | TypePricePercentChange
  | TypeParabolicSAR
  | TypeMovingAvg
  | TypePriceBollingerBands;

export type TypeChartOverlay = 'LatestPrice' | 'ParabolicSAR' | 'BollingerBands';
export type TypeChartDisplay = {
  LatestPrice: boolean;
  ParabolicSAR: boolean;
  BollingerBands: boolean;
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
