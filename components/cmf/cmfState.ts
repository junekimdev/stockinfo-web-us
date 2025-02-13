import { atom } from 'jotai';
import * as mType from './cmfType';

const initDisplay: mType.Display = { noSignalZone: true };
export const display = atom(initDisplay);
