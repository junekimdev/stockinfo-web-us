import * as d3 from 'd3';
import { getXCentered, initChart } from '../../controllers/chart';
import { TypeChaikin } from '../../controllers/data/types';

const draw = (id: string, data: TypeChaikin[], marginLeft: number) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => d.co) ?? 0;
  const yMax = d3.max(data, (d) => d.co) ?? 0;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 70;
  const lineColorCO = 'gray';
  const areaColorCO = '#87CEEB';

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    tickYCount: 5,
    tickYFormat: '~s',
  });

  // Draw area
  chart
    .append('path')
    .attr('fill', areaColorCO)
    .attr('stroke', 'none')
    .datum(data)
    .attr(
      'd',
      d3
        .area<TypeChaikin>()
        .x((d) => getXCentered(d, x))
        .y1((d) => y(d.co))
        .y0(y(0)),
    );

  // Draw lines
  chart
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', lineColorCO)
    .attr('stroke-width', 1)
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypeChaikin>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.co)),
    );
};

export default draw;