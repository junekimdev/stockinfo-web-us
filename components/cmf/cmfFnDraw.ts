import * as d3 from 'd3';
import { getDateString, getXCentered, initChart } from '../../controllers/chart';
import { TypeChaikin } from '../../controllers/data/types';
import { CmfTypeDisplay } from './cmfType';

const draw = (id: string, data: TypeChaikin[], display: CmfTypeDisplay, marginLeft: number) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => Math.min(d.cmf, -0.05)) ?? 0;
  const yMax = d3.max(data, (d) => Math.max(d.cmf, 0.05)) ?? 0;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 70;
  const lineColorCMF = 'gray';

  const noSignalZone_y1 = 0.05;
  const noSignalZone_y2 = -0.05;

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    tickYCount: 5,
  });

  chart
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', lineColorCMF)
    .attr('stroke-width', 1)
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypeChaikin>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.cmf)),
    );

  if (display.noSignalZone) {
    const w = (x(getDateString(data[data.length - 1])) ?? 0) + x.bandwidth();
    chart
      .append('rect')
      .attr('x', 0)
      .attr('y', y(noSignalZone_y1))
      .attr('width', w)
      .attr('height', Math.abs(y(noSignalZone_y1) - y(noSignalZone_y2)))
      .attr('fill', lineColorCMF)
      .attr('stroke', 'none');
  }
};

export default draw;
