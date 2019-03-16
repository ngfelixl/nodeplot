import { PlotData, PlotStates } from './models/index';
import { Layout, Plot } from './models/index';
import { Server } from './server';
import { of, Observable } from 'rxjs';

const server = new Server(8080);

export let plots: PlotData[] = [];
export const plotStates: PlotStates = {};

/**
 * Clears all stacked plots.
 */
export function clear(): void {
  plots = [];
}

/**
 * Add plot data to a stack. When executing `plot`
 * the stack will be plottet in addition to the given
 * parameters to a single page.
 * @param data
 * @param layout
 */
export function stack(data: Observable<Plot[]> | Plot[], layout?: Layout): void {
  if (data instanceof Observable) {
    const container: PlotData = layout ? { stream$: data, layout } : { stream$: data };
  } else {
    validate(data, layout);

    const container: PlotData = layout ? { stream$: of(data), layout } : { stream$: of(data) };
    plots.push(container);
  }
}

/**
 * Plot the plot-stack to a webpage. Data arguments will
 * be added to the stack before.
 * @param data Stream or static plot data
 * @param layout
 * @param cb
 */
export function plot(data?: Observable<Plot[]> | Plot[] | null, layout?: Layout): void {
  if (data) {
    stack(data, layout);
  }

  const id = Object.keys(plotStates).length;

  plotStates[id] = {
    opened: false,
    pending: false,
    plots,
  };
  plots = [];

  server.spawn(plotStates);
}

function validate(data: Plot[], layout?: Layout) {
  if (!(data instanceof Array) || data.length === 0) {
    throw new TypeError('Plot data must be an array with at least 1 element');
  }

  if (layout) {
    if (!(layout instanceof Object)) {
      throw new TypeError('Layout must be an object');
    }
  }
}
