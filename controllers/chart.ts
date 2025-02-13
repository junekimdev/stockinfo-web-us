import * as d3 from 'd3';
import * as gType from './data/types';
import { to2DigitString } from './number';

export const getCandleColor = (d: gType.Price) => {
  if (d.open === d.close) return 'gray';
  return d.open > d.close ? 'blue' : 'red';
};

export const getChangeColor = (d: number) => {
  if (d === 0) return 'gray';
  return d > 0 ? 'red' : 'blue';
};

export const getHistogramColor = (d: number) => {
  if (d === 0) return 'gray';
  return d > 0 ? 'red' : 'blue';
};

export const getDateString = (d: gType.MyDate) => {
  if (d.date instanceof Date) {
    const year = d.date.getFullYear();
    const month = to2DigitString(d.date.getMonth() + 1);
    const day = to2DigitString(d.date.getDate());
    return `${year}-${month}-${day}`;
  }
  const { year, week } = d.date;
  return `${year}-w${to2DigitString(week + 1)}`;
};

export const getXCentered = (d: gType.MyDate, x: d3.ScaleBand<string>) =>
  (x(getDateString(d)) ?? 0) + x.bandwidth() / 2;

interface IChartArgs {
  id: string;
  yMin: number;
  yMax: number;
  data: gType.ChartData[];
  margin?: { top: number; bottom: number; left: number; right: number };
  chartHeight?: number;
  dataWidth?: number;
  gridColor?: string;
  showYticks?: boolean;
  showXticks?: boolean;
  tickYCount?: number;
  tickYFormat?: string;
}
export const initChart = (
  args: IChartArgs,
): {
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number, never>;
} => {
  const {
    id,
    yMin,
    yMax,
    data,
    margin = { top: 10, bottom: 10, left: 0, right: 0 },
    chartHeight = 250,
    dataWidth = 10,
    gridColor = '#D0D0D0',
    showYticks = true,
    showXticks = false,
    tickYCount = 10,
    tickYFormat = ',~r',
  } = args;
  const chartWidth = dataWidth * data.length;
  const height = chartHeight + margin.top + margin.bottom;
  const width = chartWidth + margin.left + margin.right;

  const svg = d3
    .select(`#${id}`)
    .attr('xmlns', d3.namespaces.svg)
    .attr('viewBox', [0, 0, width, height])
    .style('width', width)
    .style('height', height);

  // Clear SVG before redrawing
  svg.selectAll('*').remove();

  // Start a chart
  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Set scales
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(data.map(getDateString));
  y.domain([yMin, yMax]).nice();

  // Draw the Y Axis
  if (showYticks) {
    chart
      .append('g')
      .attr('transform', `translate(${chartWidth},0)`)
      .call(d3.axisLeft(y).tickSize(chartWidth).ticks(tickYCount, tickYFormat)); // tickSize(chartWidth) makes grid
    chart
      .append('g')
      .attr('transform', `translate(${chartWidth},0)`)
      .call(d3.axisRight(y).ticks(tickYCount, tickYFormat));
  }

  // Draw the X Axis
  if (showXticks) {
    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', `rotate(-90) translate(-10,-${(x.bandwidth() * 3) / 2})`)
      .style('text-anchor', 'end');
  }

  chart.selectAll('.domain').attr('stroke', gridColor);
  chart.selectAll('.tick line').attr('stroke', gridColor);

  return { chart, x, y };
};

export const drawCandle = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: gType.Price[],
) => {
  const candleGroup = chart.append('g').attr('class', 'candle');

  // Draw lines for candle wicks
  candleGroup
    .selectAll('line.wick')
    .data(data)
    .join('line')
    .attr('class', 'wick')
    .attr('x1', (d) => getXCentered(d, x))
    .attr('x2', (d) => getXCentered(d, x))
    .attr('y1', (d) => y(d.high))
    .attr('y2', (d) => y(d.low))
    .attr('stroke', getCandleColor);

  // Draw bars for candle body
  candleGroup
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(Math.max(d.open, d.close)))
    .attr('height', (d) =>
      d.open !== d.close ? y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close)) : 1,
    )
    .attr('width', x.bandwidth())
    .attr('fill', getCandleColor);
};

export const drawLatestPrice = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  end: gType.MyDate,
  data: gType.Price,
) => {
  const w = (x(getDateString(end)) ?? 0) + x.bandwidth();
  const p1: [number, number] = [0, y(data.close)];
  const p2: [number, number] = [w, y(data.close)];
  const group = chart.append('g').attr('class', 'latest');
  group
    .append('path')
    .attr('d', d3.line()([p1, p2]))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
};

export const drawLatestChange = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  end: gType.MyDate,
  data: number,
) => {
  const w = (x(getDateString(end)) ?? 0) + x.bandwidth();
  const p1: [number, number] = [0, y(data)];
  const p2: [number, number] = [w, y(data)];
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
  data: gType.ParabolicSAR[],
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
  data: gType.MovingAvg[],
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
        .line<gType.MovingAvg>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.avg)),
    );
};

export const drawBollingerBands = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: gType.PriceBollingerBands[],
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
        .line<gType.PriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.middle)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<gType.PriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.upper)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<gType.PriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.lower)),
    );
};

/**
 * Adds Up Arrow Symbol to SVG
 * @param chart d3 Selection object
 * @param chartId chart ID
 * @param color fill-color
 * @returns #ID (id of the symbol prefixed with hash tag)
 */
export const addSymbolUpArrow = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  chartId: string,
  color: string,
) => {
  const id = `${chartId}-upArrow`;
  chart
    .append('symbol')
    .attr('id', id)
    .attr('viewBox', '0 0 4 4')
    .attr('fill', color)
    .attr('stroke', 'none')
    .append('path')
    .attr(
      'd',
      d3.line()([
        [2, 0],
        [0, 2],
        [1, 2],
        [1, 4],
        [3, 4],
        [3, 2],
        [4, 2],
        [2, 0],
      ]),
    );
  return `#${id}`;
};

/**
 * Adds Down Arrow Symbol to SVG
 * @param chart d3 Selection object
 * @param chartId chart ID
 * @param color fill-color
 * @returns #ID (id of the symbol prefixed with hash tag)
 */
export const addSymbolDownArrow = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  chartId: string,
  color: string,
) => {
  const id = `${chartId}-downArrow`;
  chart
    .append('symbol')
    .attr('id', id)
    .attr('viewBox', '0 0 4 4')
    .append('path')
    .attr('fill', color)
    .attr('stroke', 'none')
    .attr(
      'd',
      d3.line()([
        [2, 4],
        [0, 2],
        [1, 2],
        [1, 0],
        [3, 0],
        [3, 2],
        [4, 2],
        [2, 4],
      ]),
    );
  return `#${id}`;
};

/**
 * Adds clipPath to SVG
 * @param chart d3 Selection object
 * @param chartId chart ID
 * @param clipArea coordinate of rect
 * @param name name of the clipPath
 * @returns #ID (id of the clipPath prefixed with hash tag)
 */
export const addClipPathAsShowWindow = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  chartId: string,
  clipArea: gType.RectCoordi,
  name: string,
) => {
  const id = `${chartId}-clip-${name}`;
  const { x, y, w, h } = clipArea;
  chart
    .append('clipPath')
    .attr('id', id)
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', w)
    .attr('height', h);
  return `#${id}`;
};

export const getMarginLeft = (data: gType.PriceVolume[] | undefined) => {
  if (data && data.length) {
    const size = 8;
    const minLen = 5;
    const maxChar = data.reduce((p, v) => Math.max(p, Math.floor(v.high)), 0).toString().length;
    const len = maxChar + Math.floor(maxChar / 3);
    return Math.max(minLen, len) * size;
  }
  return 0;
};
