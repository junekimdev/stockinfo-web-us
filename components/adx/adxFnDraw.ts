import * as d3 from 'd3';
import {
  addSymbolDownArrow,
  addSymbolUpArrow,
  getDateString,
  getXCentered,
  initChart,
} from '../../controllers/chart';
import { TypeAdx, TypeAdxDisplay } from '../../controllers/data/types';

const draw = (id: string, data: TypeAdx[], display: TypeAdxDisplay, marginLeft: number) => {
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
  const lineColorPdi = 'red';
  const lineColorNdi = 'blue';
  const lineColorAdx = '#13c743';
  const sigSize = 10;
  const upArrowColor = 'rgba(255,0,0,0.7)';
  const downArrowColor = 'rgba(0,0,255,0.7)';

  const confirmValue = 25;

  const { chart, x, y } = initChart({
    id,
    yMin,
    yMax,
    data,
    margin,
    chartHeight,
    tickYCount: 5,
  });

  // Add arrow symbols for signals
  const upArrowHashId = addSymbolUpArrow(chart, id, upArrowColor);
  const downArrowHashId = addSymbolDownArrow(chart, id, downArrowColor);

  // Draw lines
  if (display.trendConfirm) {
    const w = (x(getDateString(data[data.length - 1])) ?? 0) + x.bandwidth();
    const p1: [number, number] = [0, y(confirmValue)];
    const p2: [number, number] = [w, y(confirmValue)];
    chart
      .append('path')
      .attr('d', d3.line()([p1, p2]))
      .attr('fill', 'none')
      .attr('stroke', lineColorConfirm)
      .attr('stroke-width', 1);
  }

  if (display.pDI) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorPdi)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeAdx>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.posDI)),
      );
  }

  if (display.nDI) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorNdi)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeAdx>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.negDI)),
      );
  }

  if (display.ADX) {
    chart
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', lineColorAdx)
      .attr('stroke-width', 1)
      .datum(data)
      .attr(
        'd',
        d3
          .line<TypeAdx>()
          .x((d) => getXCentered(d, x))
          .y((d) => y(d.adx)),
      );
  }

  // Draw symbols
  const buySellDiff = data.map((d) => (d.posDI >= d.negDI ? true : false));
  if (display.buy) {
    const buySig = data.filter(
      (d, i) => i && buySellDiff[i - 1] !== buySellDiff[i] && d.posDI >= d.negDI,
    );
    chart
      .append('g')
      .attr('class', 'buy')
      .selectAll('use')
      .data(buySig)
      .join('use')
      .attr('href', upArrowHashId)
      .attr('x', (d) => getXCentered(d, x) - sigSize / 2)
      .attr('y', (d) => y(d.posDI) + 1)
      .attr('width', sigSize)
      .attr('height', sigSize);
  }

  if (display.sell) {
    const sellSig = data.filter(
      (d, i) => i && buySellDiff[i - 1] !== buySellDiff[i] && d.posDI < d.negDI,
    );
    chart
      .append('g')
      .attr('class', 'sell')
      .selectAll('use')
      .data(sellSig)
      .join('use')
      .attr('href', downArrowHashId)
      .attr('x', (d) => getXCentered(d, x) - sigSize / 2)
      .attr('y', (d) => y(d.negDI) - sigSize - 1)
      .attr('width', sigSize)
      .attr('height', sigSize);
  }
};

export default draw;
