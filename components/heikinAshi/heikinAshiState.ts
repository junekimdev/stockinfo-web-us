import { atom } from 'jotai';
import * as mType from './heikinAshiType';

const initDisplay: mType.Display = {
  LatestPrice: true,
  ParabolicSAR: true,
  BollingerBands: true,
};
export const display = atom(initDisplay);
