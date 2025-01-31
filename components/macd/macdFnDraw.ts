import * as d3 from 'd3';
import { getDateString, getHistogramColor, getXCentered, initChart } from '../../controllers/chart';
import { TypeMacd } from '../../controllers/data/types';
import { MacdTypeDisplay } from './macdType';

const draw = (id: string, data: TypeMacd[], display: MacdTypeDisplay, marginLeft: number) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => Math.min(d.macd, d.signal, d.histogram)) ?? 0;
  const yMax = d3.max(data, (d) => Math.max(d.macd, d.signal, d.histogram)) ?? 0;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 180;
  const lineColorMacd = 'blue';
  const lineColorSignal = 'gray';

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
  });

  // Draw histogram
  if (display.histogram) {
    const histoGroup = chart.append('g').attr('class', 'histogram');
    histoGroup
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('fill', (d) => getHistogramColor(d.histogram))
      .attr('x', (d) => x(getDateString(d)) ?? 0)
      .attr('y', (d) => (d.histogram > 0 ? y(d.histogram) : y(0)))
      .attr('height', (d) => Math.abs(y(0) - y(d.histogram)))
      .attr('width', x.bandwidth());
  }

  // Draw lines
  if (display.signal) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorSignal)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeMacd>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.signal)),
      );
  }

  if (display.MACD) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorMacd)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeMacd>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.macd)),
      );
  }
};

export default draw;
