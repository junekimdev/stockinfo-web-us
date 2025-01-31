import { atom } from 'jotai';
import { StochasticTypeDisplay } from './stochasticType';

const displayInit: StochasticTypeDisplay = {
  fullK: true,
  fullD: true,
  overbought: true,
  oversold: true,
  trendConfirm: true,
};
export const StochasticStateDisplay = atom(displayInit);
