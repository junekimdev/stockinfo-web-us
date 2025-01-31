import { atom } from 'jotai';
import { MacdTypeDisplay } from './macdType';

const displayInit: MacdTypeDisplay = { MACD: true, signal: true, histogram: true };
export const MacdStateDisplay = atom(displayInit);
