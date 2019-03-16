import { Server } from 'http';
import ws, { Server as wsServer } from 'ws';
import { PlotStates, IPlot } from './models';
import { Observable } from 'rxjs';
import { ClientMessage } from './models/client-message';

export class WebsocketServer {
  websocketServer: wsServer;

  constructor(private server: Server) {
    this.websocketServer = new wsServer({ server: this.server });

    this.websocketServer.on('connection', ws => {
      ws.on('message', (msg: Buffer) => {
        const message = JSON.parse(msg.toString()) as ClientMessage;
        if (message.type === 'init' && this.streams[message.id]) {
          this.streams[message.id].ws = ws;
          this.streams[message.id].stream$.subscribe(data => {
            ws.send(JSON.stringify(data));
          });
        } else {
          console.warn(`Requested stream plot with id ${message} does not exist`);
        }
      });
    });
  }

  configure(plotStates: PlotStates) {
    this.streams = Object.entries(plotStates).reduce((acc, [id, plot]) => {
      if (plot.isStream) {
        return { ...acc, [id]: { stream: plot.plots } };
      } else {
        return acc;
      }
    }, {});

    // this.plotsContainer = plotsContainer;
  }
}
