import { Layout as PlotlyLayout, PlotData } from './plotly.js/index';
import { Observable } from 'rxjs';

export type Plot = Partial<PlotData>;
export type Layout = Partial<PlotlyLayout>;

export interface PlotData {
  layout?: Layout;
  stream$?: Observable<Plot[] | number[]>;
}

export interface StaticPlotData {
  layout?: Layout;
  data: Plot[] | number[];
}
