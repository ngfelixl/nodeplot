import { PlotData } from './plot-data';

/**
 * State of a page of plots
 */
export interface PlotState {
  opened: boolean;
  pending: boolean;
  plots:
    | PlotData
    | {
        websocket?: WebSocket;
      }[];
}

/**
 * Object containing all plot pages states with `id` as key
 */
export interface PlotStates {
  [id: number]: PlotState;
}
