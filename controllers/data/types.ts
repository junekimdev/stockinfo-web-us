export type TypeError = { code: number; message: string };

export type TypePriceRequestType = 'daily' | 'weekly' | 'latest';
export type TypeAvgMethod = 'simple' | 'exponential' | 'weighted';
export type TypeAvgValue = 'close' | 'open' | 'high' | 'low';
export type TypeChart = 'price' | 'heikin-aski' | 'heikin-aski-smoothed';
export type TypeDartReportCode = '11011' | '11012' | '11013' | '11014';
export type TypeDartIndexCode = 'M210000' | 'M220000' | 'M230000' | 'M240000';
export type TypeDartStatementType = 'OFS' | 'CFS';

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

export type TypeChartOverlay = 'LatestPrice' | 'ParabolicSAR' | 'BollingerBands';
export type TypeChartDisplay = {
  LatestPrice: boolean;
  ParabolicSAR: boolean;
  BollingerBands: boolean;
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
};

export type TypeEdgarStatementItem = {
  date: Date;
  value: number;
};
