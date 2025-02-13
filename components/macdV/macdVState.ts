import { atom } from 'jotai';
import * as mType from './macdVType';

const initDisplay: mType.Display = {
  MACDV: true,
  signal: true,
  histogram: true,
  overbought: true,
  oversold: true,
  upsideMomentum: true,
  downsideMomentum: true,
};
export const display = atom(initDisplay);
