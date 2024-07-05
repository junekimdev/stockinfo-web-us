import * as d3 from 'd3';
import {
  drawBollingerBands,
  drawLatestPrice,
  drawSAR,
  getCandleColor,
  getDateString,
  getXCentered,
} from '../../controllers/chart';
import {
  TypeChartDisplay,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePriceRequest,
} from '../../controllers/data/types';
import styles from './price.module.scss';

const chartHeight = 250;
const margin = { top: 10, bottom: 10 };
const barWidth = 10;
const gridColor = '#D0D0D0';

const draw = (
  req: TypePriceRequest,
  candleData: TypePrice[],
  sarData: TypeParabolicSAR[],
  bandData: TypePriceBollingerBands[],
  overlays: TypeChartDisplay,
  marginLeft: number,
  latestPriceData?: TypePrice,
) => {
  if (!candleData.length) return;

  const chartWidth = barWidth * candleData.length;
  const height = chartHeight + margin.top + margin.bottom;
  const width = chartWidth + marginLeft + marginLeft;

  const svg = d3
    .select(`#${styles.chart}-${req.code}-${req.type}`)
    .attr('width', width)
    .attr('height', height);

  // Clear SVG before redrawing
  svg.selectAll('*').remove();

  // Start a chart
  const chart = svg.append('g').attr('transform', `translate(${marginLeft},${margin.top})`);

  // Set scales
  const minData = d3.min(candleData, (d) => d.low) ?? 0;
  const maxData = d3.max(candleData, (d) => d.high) ?? 0;
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(candleData.map(getDateString));
  y.domain([
    Math.min(minData, latestPriceData?.close ?? minData),
    Math.max(maxData, latestPriceData?.close ?? maxData),
  ]).nice();

  // Draw the Y Axis
  chart
    .append('g')
    .attr('transform', `translate(${chartWidth},0)`)
    .call(d3.axisLeft(y).tickSize(chartWidth)); // tickSize(chartWidth) makes grid
  chart.append('g').attr('transform', `translate(${chartWidth},0)`).call(d3.axisRight(y));

  const candleGroup = chart.append('g').attr('class', 'candle');

  // Draw lines for candle wicks
  candleGroup
    .selectAll('line.wick')
    .data(candleData)
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
    .data(candleData)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(Math.max(d.open, d.close)))
    .attr('height', (d) =>
      d.open !== d.close ? y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close)) : 1,
    )
    .attr('width', x.bandwidth())
    .attr('fill', getCandleColor);

  if (overlays.LatestPrice && latestPriceData)
    drawLatestPrice(chart, x, y, candleData[0], candleData[candleData.length - 1], latestPriceData);

  // Draw Parabolic SAR
  if (overlays.ParabolicSAR && sarData.length) drawSAR(chart, x, y, sarData);

  // Draw Bollinger Bands
  if (overlays.BollingerBands && bandData.length) drawBollingerBands(chart, x, y, bandData);

  // Draw the X Axis
  // svg
  //   .append('g')
  //   .attr('transform', `translate(0,${chartHeight})`)
  //   .call(d3.axisBottom(x))
  //   .selectAll('text')
  //   .attr('transform', `rotate(-90) translate(-10,-${(x.bandwidth() * 3) / 2})`)
  //   .style('text-anchor', 'end');

  chart.selectAll('.domain').attr('stroke', gridColor);
  chart.selectAll('.tick line').attr('stroke', gridColor);
};

export default draw;
