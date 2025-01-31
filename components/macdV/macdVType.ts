export type MacdVTypeDisplayItem =
  | 'MACDV'
  | 'signal'
  | 'histogram'
  | 'overbought'
  | 'oversold'
  | 'upsideMomentum'
  | 'downsideMomentum';
export type MacdVTypeDisplay = Record<MacdVTypeDisplayItem, boolean>;
