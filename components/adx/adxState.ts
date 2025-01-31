import { atom } from 'jotai';
import { AdxTypeDisplay } from './adxType';

const displayInit: AdxTypeDisplay = {
  ADX: true,
  pDI: true,
  nDI: true,
  buy: true,
  sell: true,
  trendConfirm: false,
};
export const AdxStateDisplay = atom(displayInit);
