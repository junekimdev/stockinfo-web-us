export type DisplayItem =
  | 'MACDV'
  | 'signal'
  | 'histogram'
  | 'overbought'
  | 'oversold'
  | 'upsideMomentum'
  | 'downsideMomentum';
export type Display = Record<DisplayItem, boolean>;
