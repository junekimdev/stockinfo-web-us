import * as d3 from 'd3';
import {
  drawBollingerBands,
  drawCandle,
  drawLatestPrice,
  drawSAR,
  initChart,
} from '../../controllers/chart';
import { TypeParabolicSAR, TypePrice, TypePriceBollingerBands } from '../../controllers/data/types';
import { PriceTypeDisplay } from './priceType';

const draw = (
  id: string,
  data: TypePrice[],
  sarData: TypeParabolicSAR[],
  bandData: TypePriceBollingerBands[],
  display: PriceTypeDisplay,
  marginLeft: number,
  latestPriceData?: TypePrice,
) => {
  if (!data?.length) return;
  const minData = d3.min(data, (d) => d.low) ?? 0;
  const maxData = d3.max(data, (d) => d.high) ?? 0;
  const yMin = Math.min(minData, latestPriceData?.close ?? minData);
  const yMax = Math.max(maxData, latestPriceData?.close ?? maxData);
  const margin = {
    top: 10,
    bottom: 10,
    left: marginLeft,
    right: marginLeft + 10,
  };

  const { chart, x, y } = initChart({ id, yMin, yMax, data, margin });

  // Draw candle sticks
  drawCandle(chart, x, y, data);

  // Draw latest price line
  if (display.LatestPrice && latestPriceData)
    drawLatestPrice(chart, x, y, data[data.length - 1], latestPriceData);

  // Draw Parabolic SAR
  if (display.ParabolicSAR && sarData.length) drawSAR(chart, x, y, sarData);

  // Draw Bollinger Bands
  if (display.BollingerBands && bandData.length) drawBollingerBands(chart, x, y, bandData);
};

export default draw;
