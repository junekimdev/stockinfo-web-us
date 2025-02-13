import { atom } from 'jotai';
import * as mType from './stochasticType';

const initDisplay: mType.Display = {
  fullK: true,
  fullD: true,
  overbought: true,
  oversold: true,
  trendConfirm: true,
};
export const display = atom(initDisplay);
