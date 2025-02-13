import { atom } from 'jotai';
import * as mType from './percentChangeType';

const initDisplay: mType.Display = {
  LatestPrice: true,
};
export const display = atom(initDisplay);
