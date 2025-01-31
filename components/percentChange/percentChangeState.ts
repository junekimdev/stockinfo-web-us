import { atom } from 'jotai';
import { PercentChangeTypeDisplay } from './percentChangeType';

const displayInit: PercentChangeTypeDisplay = {
  LatestPrice: true,
};
export const PercentChangeStateDisplay = atom(displayInit);
