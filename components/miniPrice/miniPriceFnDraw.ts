import * as d3 from 'd3';
import { getXCentered, initChart } from '../../controllers/chart';
import { TypePrice } from '../../controllers/data/types';

const draw = (id: string, data: TypePrice[]) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => d.low) ?? 0;
  const yMax = d3.max(data, (d) => d.high) ?? 1;
  const margin = { top: 4, bottom: 4, left: 4, right: 4 };
  const chartHeight = 40;
  const dataWidth = 3;
  const lineColor = '#808080';

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    dataWidth,
    showYticks: false,
  });

  // Add attributes
  chart
    .attr('class', 'mini')
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 1);

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
