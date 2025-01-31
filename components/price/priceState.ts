import { atom } from 'jotai';
import { PriceTypeDisplay } from './priceType';

const displayInit: PriceTypeDisplay = {
  LatestPrice: true,
  ParabolicSAR: true,
  BollingerBands: true,
};
export const PriceStateDisplay = atom(displayInit);
