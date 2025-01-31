import * as d3 from 'd3';
import { getDateString, getXCentered, initChart } from '../../controllers/chart';
import { TypeStochastic } from '../../controllers/data/types';
import { StochasticTypeDisplay } from './stochasticType';

const draw = (
  id: string,
  data: TypeStochastic[],
  display: StochasticTypeDisplay,
  marginLeft: number,
) => {
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
  const lineColorConfirm = 'rgba(0,0,0,0.3)';
  const lineColorOverbought = 'red';
  const lineColorOversold = 'blue';
  const lineColorK = 'green';
  const lineColorD = 'gray';

  const overboughtValue = 80;
  const oversoldValue = 20;
  const confirmValue = 50;

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

  if (display.trendConfirm) {
    const p1: [number, number] = [0, y(confirmValue)];
    const p2: [number, number] = [w, y(confirmValue)];
    chart
      .append('path')
      .attr('d', d3.line()([p1, p2]))
      .attr('fill', 'none')
      .attr('stroke', lineColorConfirm)
      .attr('stroke-width', 1);
  }

  if (display.fullK) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorK)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeStochastic>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.fullK)),
      );
  }

  if (display.fullD) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorD)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeStochastic>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.fullD)),
      );
  }
};

export default draw;
