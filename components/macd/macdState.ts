import { atom } from 'jotai';
import * as mType from './macdType';

const initDisplay: mType.Display = { MACD: true, signal: true, histogram: true };
export const display = atom(initDisplay);
