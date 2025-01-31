import { atom } from 'jotai';
import { HeikinAshiSmoothedTypeDisplay } from './heikinAshiType';
const displayInit: HeikinAshiSmoothedTypeDisplay = {
  LatestPrice: true,
};
export const HeikinAshiSmoothedStateDisplay = atom(displayInit);
