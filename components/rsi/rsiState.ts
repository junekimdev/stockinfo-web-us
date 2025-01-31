import { atom } from 'jotai';
import { RsiTypeDisplay } from './rsiType';

const displayInit: RsiTypeDisplay = { overbought: true, oversold: true };
export const RsiStateDisplay = atom(displayInit);
