import { atom } from 'jotai';
import * as mType from './heikinAshiType';

const initDisplay: mType.Display = {
  LatestPrice: true,
};
export const display = atom(initDisplay);
