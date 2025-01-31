import { atom } from 'jotai';
import { CmfTypeDisplay } from './cmfType';

const displayInit: CmfTypeDisplay = { noSignalZone: true };
export const CmfStateDisplay = atom(displayInit);
