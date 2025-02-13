import * as d3 from 'd3';
import { getXCentered, initChart } from '../../controllers/chart';
import * as gType from '../../controllers/data/types';

const draw = (id: string, data: gType.Atrp[], marginLeft: number) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => Math.min(d.atrp)) ?? 0;
  const yMax = d3.max(data, (d) => Math.max(d.atrp)) ?? 0;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 70;
  const lineColorAtrp = 'gray';

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    tickYCount: 5,
  });

  // Draw lines
  chart
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', lineColorAtrp)
    .attr('stroke-width', 1)
    .datum(data)
    .attr(
      'd',
      d3
        .line<gType.Atrp>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.atrp)),
    );
};

export default draw;
