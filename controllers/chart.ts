import * as d3 from 'd3';
import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { StateChartOverlays } from './data/states';
import {
  TypeChart,
  TypeChartOverlay,
  TypeDate,
  TypeIDWeek,
  TypeMovingAvg,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePriceVolume,
} from './data/types';

export const getCandleColor = (d: TypePrice) => {
  if (d.open === d.close) return 'gray';
  return d.open > d.close ? 'blue' : 'red';
};

export const getDateString = (d: TypeDate) => {
  if (Object.hasOwn(d.date, 'year')) {
    const { year, week } = d.date as TypeIDWeek;
    return `${year}-w${(week + 1).toString().padStart(2, '0')}`;
  } else {
    const dd = d.date as Date;
    const year = dd.getFullYear();
    const month = (dd.getMonth() + 1).toString().padStart(2, '0');
    const day = dd.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

export const getXCentered = (d: TypeDate, x: d3.ScaleBand<string>) =>
  (x(getDateString(d)) ?? 0) + x.bandwidth() / 2;

export const drawLatestPrice = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  start: TypeDate,
  end: TypeDate,
  data: TypePrice,
) => {
  const p1 = [x(getDateString(start)) ?? 0, y(data.close)];
  const p2 = [x(getDateString(end)) + x.bandwidth() ?? 0, y(data.close)];
  const group = chart.append('g').attr('class', 'latest');
  group
    .append('path')
    .attr('d', d3.line()([p1, p2]))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
};

export const drawSAR = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: TypeParabolicSAR[],
) => {
  chart
    .append('g')
    .attr('class', 'sar')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', 2)
    .attr('cx', (d) => getXCentered(d, x))
    .attr('cy', (d) => y(d.sar))
    .attr('stroke', (d) => (d.isUpTrend ? 'red' : 'blue'))
    .attr('fill', 'none');
};

export const drawMA = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: TypeMovingAvg[],
  color: string,
) => {
  const group = chart
    .append('g')
    .attr('class', 'avg')
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1);
  group
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypeMovingAvg>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.avg)),
    );
};

export const drawBollingerBands = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: TypePriceBollingerBands[],
) => {
  const bbGroup = chart
    .append('g')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1);
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.middle)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.upper)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.lower)),
    );
};

export const getMarginLeft = (data: TypePriceVolume[] | undefined) => {
  if (data && data.length) {
    const size = 8;
    const maxChar = data
      .reduce((p, v) => Math.max(p, v.high, v.volume), -Infinity)
      .toString().length;
    return (maxChar + Math.floor(maxChar / 3)) * size;
  }
  return 0;
};

export const useCheckboxChange = (code: string, type: TypeChart, overlay: TypeChartOverlay) => {
  const setState = useSetRecoilState(StateChartOverlays({ code, type }));

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [overlay]: e.currentTarget.checked }));
    },
    [code, type, overlay],
  );
};
