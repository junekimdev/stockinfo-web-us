import * as d3 from 'd3';
import { getCandleColor, getDateString } from '../../controllers/chart';
import { TypePriceRequest, TypePriceVolume } from '../../controllers/data/types';
import styles from './volume.module.scss';

const chartHeight = 70;
const margin = { top: 10, bottom: 80 };
const barWidth = 10;
const gridColor = '#D0D0D0';

const draw = (req: TypePriceRequest, data: TypePriceVolume[], marginLeft: number) => {
  if (!data.length) return;

  const chartWidth = barWidth * data.length;
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
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(data.map(getDateString));
  y.domain([0, d3.max(data, (d) => d.volume) ?? 1]).nice();

  // Draw the Y Axis
  const tickCnt = Math.floor(chartHeight / 15);
  chart
    .append('g')
    .attr('transform', `translate(${chartWidth},0)`)
    .call(d3.axisLeft(y).tickSize(chartWidth).ticks(tickCnt)); // tickSize(chartWidth) makes grid
  chart
    .append('g')
    .attr('transform', `translate(${chartWidth},0)`)
    .call(d3.axisRight(y).ticks(tickCnt));

  // Draw bars for high and low
  chart
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(d.volume))
    .attr('height', (d) => y(0) - y(d.volume))
    .attr('width', x.bandwidth())
    .attr('fill', getCandleColor);

  // Add the X Axis
  chart
    .append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', `rotate(-90) translate(-10,-${(x.bandwidth() * 3) / 2})`)
    .style('text-anchor', 'end');

  chart.selectAll('.domain').attr('stroke', gridColor);
  chart.selectAll('.tick line').attr('stroke', gridColor);
};

export default draw;
