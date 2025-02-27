import * as d3 from 'd3';
import {
  drawLatestChange,
  getChangeColor,
  getDateString,
  initChart,
} from '../../controllers/chart';
import * as gType from '../../controllers/data/types';
import * as mType from './percentChangeType';

const draw = (
  id: string,
  data: gType.PricePercentChange[],
  display: mType.Display,
  marginLeft: number,
  latestChange?: number,
) => {
  if (!data?.length) return;
  const minData = d3.min(data, (d) => d.percent_change) ?? 0;
  const maxData = d3.max(data, (d) => d.percent_change) ?? 0;
  const yMin = Math.min(minData, latestChange ?? minData);
  const yMax = Math.max(maxData, latestChange ?? maxData);
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 120;

  const { chart, x, y } = initChart({ id, yMin, yMax, data, margin, chartHeight });

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

  // Draw latest price line
  if (display.LatestPrice && latestChange !== undefined)
    drawLatestChange(chart, x, y, data[data.length - 1], latestChange);
};

export default draw;
