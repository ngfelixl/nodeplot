import { join } from 'path';
import request from 'request';
import { Server } from '../src/server';

const port = 8081;
const validData = {
  opened: false,
  pending: false,
  plots: [{data: [{ x: [1], y: [2]}]}]
};

jest.mock('opn');
jest.mock('fs', () => ({readFile: (path: any, options: any, callback: (err: any, data: any) => void) => {
  switch (path) {
    case join(__dirname, '..', 'www', 'index.html'): callback(null, 'index.html data'); break;
    case join(__dirname, '..', 'www', 'nodeplotlib.min.js'): callback(null, 'nodeplotlib data'); break;
    case join(__dirname, '..', 'www', 'plotly.min.js'): callback(null, 'plotly data'); break;
    default: callback('Error', null);
  }
}}));


describe('Server', () => {
  let server: any;

  beforeEach(() => {
    server = new Server(port);
  });

  it('should serve the website', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/index.html`, (err, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body).toEqual('index.html data');
      done();
    });
  });

  it('should serve the nodeplotlib script', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/nodeplotlib.min.js`, (err, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body).toEqual('nodeplotlib data');
      done();
    });
  });

  it('should serve the plotly script', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/plotly.min.js`, (err, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body).toEqual('plotly data');
      done();
    });
  });

  it('should clean the server if all data is catched up', (done) => {
    server.clean = jest.fn();

    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/index.html`, (err, response, body) => {
      expect(response.statusCode).toBe(200);
      
      request(`http://localhost:${port}/data/0`, (err0, response0, body0) => {
        expect(response0.statusCode).toBe(200);
        expect(server.clean).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  afterEach(() => {
    server.clean();
    server = null;
  });
});
