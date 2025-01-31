export type StochasticTypeDisplayItem =
  | 'fullK'
  | 'fullD'
  | 'overbought'
  | 'oversold'
  | 'trendConfirm';
export type StochasticTypeDisplay = Record<StochasticTypeDisplayItem, boolean>;
