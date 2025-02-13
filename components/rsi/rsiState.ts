import { atom } from 'jotai';
import * as mType from './rsiType';

const initDisplay: mType.Display = { overbought: true, oversold: true };
export const display = atom(initDisplay);
