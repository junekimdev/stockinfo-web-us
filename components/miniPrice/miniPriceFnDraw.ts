import * as d3 from 'd3';
import { getDateString, getXCentered } from '../../controllers/chart';
import { TypePrice } from '../../controllers/data/types';

const chartHeight = 40;
const margin = { top: 4, bottom: 4, left: 4, right: 4 };
const gap = 3;
const lineColor = '#808080';

const draw = (chartID: string, data: TypePrice[]) => {
  if (!data.length) return;

  const chartWidth = gap * data.length;
  const height = chartHeight + margin.top + margin.bottom;
  const width = chartWidth + margin.left + margin.right;

  const svg = d3.select(`#${chartID}`).attr('width', width).attr('height', height);

  // Clear SVG before redrawing
  svg.selectAll('*').remove();

  // Start a chart
  const chart = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'mini')
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 1);

  // Set scales
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(data.map(getDateString));
  y.domain([d3.min(data, (d) => d.low) ?? 0, d3.max(data, (d) => d.high) ?? 1]).nice();

  // Draw line
  chart
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePrice>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.close)),
    );
};

export default draw;
