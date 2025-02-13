import { atom } from 'jotai';
import * as mType from './adxType';

const initDisplay: mType.Display = {
  ADX: true,
  pDI: true,
  nDI: true,
  buy: true,
  sell: true,
  trendConfirm: false,
};

export const display = atom(initDisplay);
