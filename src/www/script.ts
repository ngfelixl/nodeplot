import { webSocket } from 'rxjs/webSocket';
import { first, skip } from 'rxjs/operators';
import { StaticPlotData, Plot } from '../models/plot-data';
import Plotly from 'plotly.js';

let numberOfPlots = 0;
let container: HTMLElement;
let statusBox: HTMLElement;
let htmlClose: HTMLElement;

window.addEventListener('load', () => {
  container = document.getElementById('container') as HTMLElement;
  statusBox = document.getElementById('status') as HTMLElement;
  htmlClose = document.getElementById('close') as HTMLElement;

  const pageid = container && (container.dataset.pageid as string);
  const subject = webSocket('ws://localhost:{{port}}');
  const initMessage = JSON.stringify({ type: 'init', id: pageid });

  const initial = subject.pipe(first());
  const updates = subject.pipe(skip(1));

  initial.subscribe(create, displayError);
  updates.subscribe(update, displayError);

  htmlClose &&
    htmlClose.addEventListener('click', () => {
      const closeMessage = JSON.stringify({ type: 'close', id: pageid });
      subject.next(closeMessage);
      subject.unsubscribe();
    });

  subject.next(initMessage);
});

function create(plots: any) {
  (plots as StaticPlotData[]).forEach((plot, index) => {
    const toAppend = document.createElement('div');
    toAppend.id = `container_${index}`;
    container.appendChild(toAppend);
    Plotly.newPlot(`container_${index}`, plot.data as Plot[], plot.layout);
  });
}

function update(plots: any) {
  (plots as StaticPlotData[]).forEach((plot, index) => {
    Plotly.react(`container_${index}`, plot.data as Plot[], plot.layout);
  });
}

function displayError(error: Error) {
  statusBox.innerHTML = error.message;
}

window.addEventListener('resize', () => {
  const update = {
    width: window.innerWidth,
  };

  for (let i = 0; i < numberOfPlots; i++) {
    Plotly.relayout(`container_${i}`, update);
  }
});

function parseWebsocketData(message: MessageEvent) {
  let data;

  try {
    data = JSON.parse(message.data);
  } catch (e) {
    throw new Error(`Can not parse websocket data`);
  }

  return data;
}
