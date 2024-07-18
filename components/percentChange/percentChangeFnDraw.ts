import * as d3 from 'd3';
import { drawLatestChange, getChangeColor, getDateString } from '../../controllers/chart';
import { TypeChartDisplay, TypePricePercentChange } from '../../controllers/data/types';

const chartHeight = 120;
const margin = { top: 10, bottom: 10 };
const barWidth = 10;
const gridColor = '#D0D0D0';

const draw = (
  chartID: string,
  data: TypePricePercentChange[],
  overlays: TypeChartDisplay,
  marginLeft: number,
  latestChange?: number,
) => {
  if (!data.length) return;

  const chartWidth = barWidth * data.length;
  const height = chartHeight + margin.top + margin.bottom;
  const width = chartWidth + marginLeft + marginLeft;

  const svg = d3.select(`#${chartID}`).attr('width', width).attr('height', height);

  // Clear SVG before redrawing
  svg.selectAll('*').remove();

  // Start a chart
  const chart = svg.append('g').attr('transform', `translate(${marginLeft},${margin.top})`);

  // Set scales
  const minData = d3.min(data, (d) => d.percent_change) ?? 0;
  const maxData = d3.max(data, (d) => d.percent_change) ?? 0;
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(data.map(getDateString));
  y.domain([
    Math.min(minData, latestChange ?? minData),
    Math.max(maxData, latestChange ?? maxData),
  ]).nice();

  // Draw the Y Axis
  chart
    .append('g')
    .attr('transform', `translate(${chartWidth},0)`)
    .call(d3.axisLeft(y).tickSize(chartWidth)); // tickSize(chartWidth) makes grid
  chart.append('g').attr('transform', `translate(${chartWidth},0)`).call(d3.axisRight(y));

  const barGroup = chart.append('g').attr('class', 'bar');

  // Draw bars
  barGroup
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(Math.max(0, d.percent_change)))
    .attr('height', (d) => y(Math.min(0, d.percent_change)) - y(Math.max(0, d.percent_change)))
    .attr('width', x.bandwidth())
    .attr('fill', (d) => getChangeColor(d.percent_change));

  if (overlays.LatestPrice)
    drawLatestChange(chart, x, y, data[0], data[data.length - 1], latestChange);

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
