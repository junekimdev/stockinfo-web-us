import * as d3 from 'd3';
import { getDateString, getHistogramColor, getXCentered, initChart } from '../../controllers/chart';
import { TypeMacdV } from '../../controllers/data/types';
import { MacdVTypeDisplay } from './macdVType';

const draw = (id: string, data: TypeMacdV[], display: MacdVTypeDisplay, marginLeft: number) => {
  if (!data?.length) return;
  const yMin = d3.min(data, (d) => Math.min(d.macdV, d.signal, d.histogram, -150)) ?? 0;
  const yMax = d3.max(data, (d) => Math.max(d.macdV, d.signal, d.histogram, 150)) ?? 0;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 180;
  const lineColorMacdV = 'blue';
  const lineColorSignal = 'gray';
  const lineColorOverbought = 'red';
  const lineColorOversold = 'blue';
  const rectColorUpside = 'rgba(255,0,0,0.2)';
  const rectColorDownside = 'rgba(0,0,255,0.2)';

  const overboughtValue = 150;
  const oversoldValue = -150;
  const upsideStartValue = 50;
  const downsideStartValue = -50;

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
  });

  // Draw boundaries
  const w = (x(getDateString(data[data.length - 1])) ?? 0) + x.bandwidth();

  if (display.overbought) {
    const p1: [number, number] = [0, y(overboughtValue)];
    const p2: [number, number] = [w, y(overboughtValue)];
    chart
      .append('path')
      .attr('d', d3.line()([p1, p2]))
      .attr('fill', 'none')
      .attr('stroke', lineColorOverbought)
      .attr('stroke-width', 1);
  }

  if (display.oversold) {
    const p1: [number, number] = [0, y(oversoldValue)];
    const p2: [number, number] = [w, y(oversoldValue)];
    chart
      .append('path')
      .attr('d', d3.line()([p1, p2]))
      .attr('fill', 'none')
      .attr('stroke', lineColorOversold)
      .attr('stroke-width', 1);
  }

  if (display.upsideMomentum) {
    chart
      .append('rect')
      .attr('x', 0)
      .attr('y', y(overboughtValue))
      .attr('width', w)
      .attr('height', Math.abs(y(overboughtValue) - y(upsideStartValue)))
      .attr('fill', rectColorUpside)
      .attr('stroke', 'none');
  }

  if (display.downsideMomentum) {
    chart
      .append('rect')
      .attr('x', 0)
      .attr('y', y(downsideStartValue))
      .attr('width', w)
      .attr('height', Math.abs(y(downsideStartValue) - y(oversoldValue)))
      .attr('fill', rectColorDownside)
      .attr('stroke', 'none');
  }

  // Draw histogram
  if (display.histogram) {
    const histoGroup = chart.append('g').attr('class', 'histogram');
    histoGroup
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d) => x(getDateString(d)) ?? 0)
      .attr('y', (d) => (d.histogram > 0 ? y(d.histogram) : y(0)))
      .attr('height', (d) => Math.abs(y(0) - y(d.histogram)))
      .attr('width', x.bandwidth())
      .attr('fill', (d) => getHistogramColor(d.histogram));
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
          .line<TypeMacdV>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.signal)),
      );
  }

  if (display.MACDV) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorMacdV)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeMacdV>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.macdV)),
      );
  }
};

export default draw;
