import * as d3 from 'd3';
import {
  addClipPathAsShowWindow,
  getDateString,
  getXCentered,
  initChart,
} from '../../controllers/chart';
import { TypeRectCoordi, TypeRsi } from '../../controllers/data/types';
import { RsiTypeDisplay } from './rsiType';

const draw = (id: string, data: TypeRsi[], display: RsiTypeDisplay, marginLeft: number) => {
  if (!data?.length) return;
  const yMin = 0;
  const yMax = 100;
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };
  const chartHeight = 120;
  const lineColorOverbought = 'red';
  const lineColorOversold = 'blue';
  const lineColorRsi = 'gray';
  const areaColorOverbought = 'rgba(255,0,0,0.7)';
  const areaColorOversold = 'rgba(0,0,255,0.7)';

  const overboughtValue = 70;
  const oversoldValue = 30;

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    tickYCount: 5,
  });

  const w = (x(getDateString(data[data.length - 1])) ?? 0) + x.bandwidth();

  // Add clip path
  const coordiOverbought: TypeRectCoordi = { x: 0, y: 0, w, h: y(overboughtValue) };
  const coordiOversold: TypeRectCoordi = {
    x: 0,
    y: y(oversoldValue),
    w,
    h: Math.abs(y(oversoldValue) - y(yMin)),
  };
  const clipIdOverbought = addClipPathAsShowWindow(chart, id, coordiOverbought, 'overbought');
  const clipIdOversold = addClipPathAsShowWindow(chart, id, coordiOversold, 'oversold');

  // Draw lines
  if (display.overbought) {
    chart
      .append('path')
      .attr('fill', areaColorOverbought)
      .attr('stroke', 'none')
      .attr('clip-path', `url(${clipIdOverbought})`)
      .datum(data)
      .attr(
        'd',
        d3
          .area<TypeRsi>()
          .x((d) => getXCentered(d, x))
          .y1((d) => y(d.rsi))
          .y0(y(yMin)),
      );

    const p1: [number, number] = [0, y(overboughtValue)];
    const p2: [number, number] = [w, y(overboughtValue)];
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorOverbought)
      .attr('stroke-width', 1)
      .attr('d', d3.line()([p1, p2]));
  }

  if (display.oversold) {
    chart
      .append('path')
      .attr('fill', areaColorOversold)
      .attr('stroke', 'none')
      .attr('clip-path', `url(${clipIdOversold})`)
      .datum(data)
      .attr(
        'd',
        d3
          .area<TypeRsi>()
          .x((d) => getXCentered(d, x))
          .y1((d) => y(d.rsi))
          .y0(y(yMax)),
      );

    const p1: [number, number] = [0, y(oversoldValue)];
    const p2: [number, number] = [w, y(oversoldValue)];
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorOversold)
      .attr('stroke-width', 1)
      .attr('d', d3.line()([p1, p2]));
  }

  chart
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', lineColorRsi)
    .attr('stroke-width', 1)
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypeRsi>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.rsi)),
    );
};

export default draw;
