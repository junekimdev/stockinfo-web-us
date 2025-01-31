import { atom } from 'jotai';
import { HeikinAshiTypeDisplay } from './heikinAshiType';

const displayInit: HeikinAshiTypeDisplay = {
  LatestPrice: true,
  ParabolicSAR: true,
  BollingerBands: true,
};
export const HeikinAshiStateDisplay = atom(displayInit);
