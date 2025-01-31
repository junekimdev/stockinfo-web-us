import { atom } from 'jotai';
import { MacdVTypeDisplay } from './macdVType';

const displayInit: MacdVTypeDisplay = {
  MACDV: true,
  signal: true,
  histogram: true,
  overbought: true,
  oversold: true,
  upsideMomentum: true,
  downsideMomentum: true,
};
export const MacdVStateDisplay = atom(displayInit);
