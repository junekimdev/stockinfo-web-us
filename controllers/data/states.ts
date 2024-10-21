import { atom, atomFamily } from 'recoil';
import {
  TypeAdx,
  TypeAdxDisplay,
  TypeAtrp,
  TypeChaikin,
  TypeChartRequest,
  TypeCMFDisplay,
  TypeCompanyTab,
  TypeIDPriceMA,
  TypeMacd,
  TypeMacdDisplay,
  TypeMacdV,
  TypeMacdVDisplay,
  TypeMovingAvg,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePriceDisplay,
  TypePricePercentChange,
  TypePriceRequest,
  TypeRsi,
  TypeRsiDisplay,
  TypeStochastic,
  TypeStochasticDisplay,
} from './types';

export const StateTabsInitiated = atom<boolean>({ key: 'StateTabsInitiated', default: false });

export const StatePriceDisplays = atomFamily<TypePriceDisplay, TypeChartRequest>({
  key: 'StatePriceDisplays',
  default: { LatestPrice: true, ParabolicSAR: true, BollingerBands: true },
});

export const StatePricePercentChange = atomFamily<TypePricePercentChange[], TypePriceRequest>({
  key: 'StatePricePercentChange',
  default: [],
});

export const StatePriceHeikinAshi = atomFamily<TypePrice[], TypePriceRequest>({
  key: 'StatePriceHeikinAshi',
  default: [],
});

export const StatePriceHeikinAshiSmoothed = atomFamily<TypePrice[], TypePriceRequest>({
  key: 'StatePriceHeikinAshiSmoothed',
  default: [],
});

export const StatePriceSAR = atomFamily<TypeParabolicSAR[], TypePriceRequest>({
  key: 'StatePriceSAR',
  default: [],
});

export const StatePriceBollingerBands = atomFamily<TypePriceBollingerBands[], TypePriceRequest>({
  key: 'StatePriceBollingerBands',
  default: [],
});

export const StateAdx = atomFamily<TypeAdx[], TypePriceRequest>({
  key: 'StateAdx',
  default: [],
});
export const StateRsi = atomFamily<TypeRsi[], TypePriceRequest>({
  key: 'StateRsi',
  default: [],
});
export const StateMacd = atomFamily<TypeMacd[], TypePriceRequest>({
  key: 'StateMacd',
  default: [],
});
export const StateMacdV = atomFamily<TypeMacdV[], TypePriceRequest>({
  key: 'StateMacdV',
  default: [],
});
export const StateAtrp = atomFamily<TypeAtrp[], TypePriceRequest>({
  key: 'StateAtrp',
  default: [],
});
export const StateChaikin = atomFamily<TypeChaikin[], TypePriceRequest>({
  key: 'StateChaikin',
  default: [],
});
export const StateStochastic = atomFamily<TypeStochastic[], TypePriceRequest>({
  key: 'StateStochastic',
  default: [],
});

export const StatePriceMA = atomFamily<TypeMovingAvg[], TypeIDPriceMA>({
  key: 'StatePriceMA',
  default: [],
});

export const StateSearchInput = atom<string>({
  key: 'StateSearchInput',
  default: '',
});

export const StateCompanyTabs = atom<TypeCompanyTab[]>({
  key: 'StateCompanyTabs',
  default: [],
});

export const StateCurrentTab = atom<TypeCompanyTab>({
  key: 'StateCurrentTab',
  default: {
    uuid: '',
    company: { cik: '', code: '', name: '' },
    mainType: 'daily',
  },
});

export const StateRecentSearchTabs = atom<TypeCompanyTab[]>({
  key: 'StateRecentSearchTabs',
  default: [],
});

export const StateDetailsOpened = atom<boolean>({
  key: 'StateDetailsOpened',
  default: false,
});

export const StateAdxDisplay = atom<TypeAdxDisplay>({
  key: 'StateAdxDisplay',
  default: { ADX: true, pDI: true, nDI: true, buy: true, sell: true, trendConfirm: false },
});
export const StateRsiDisplay = atom<TypeRsiDisplay>({
  key: 'StateRsiDisplay',
  default: { overbought: true, oversold: true },
});
export const StateMacdDisplay = atom<TypeMacdDisplay>({
  key: 'StateMacdDisplay',
  default: { MACD: true, signal: true, histogram: true },
});
export const StateMacdVDisplay = atom<TypeMacdVDisplay>({
  key: 'StateMacdVDisplay',
  default: {
    MACDV: true,
    signal: true,
    histogram: true,
    overbought: true,
    oversold: true,
    upsideMomentum: true,
    downsideMomentum: true,
  },
});
export const StateCMFDisplay = atom<TypeCMFDisplay>({
  key: 'StateCMFDisplay',
  default: { noSignalZone: true },
});
export const StateStochasticDisplay = atom<TypeStochasticDisplay>({
  key: 'StateStochasticDisplay',
  default: {
    fullK: true,
    fullD: true,
    overbought: true,
    oversold: true,
    trendConfirm: true,
  },
});
