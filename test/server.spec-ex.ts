import opn from 'opn';
import request from 'request';
import { Server } from '../src/server';

const port = 8080;
const validData = {
  opened: false,
  pending: false,
  plots: [{data: [{ x: [1], y: [2]}]}]
};

jest.mock('opn');
jest.mock('fs', () => ({readFile: (path: any, options: any, callback: (err: any, data: any) => void) => {
  callback('Error', null);
}}));

describe('Server', () => {
  let server: any;

  beforeEach(() => {
    server = new Server(port);
  });


  it('should instantiate', () => {
    expect(server).toBeTruthy();
  });

  it('should call opn once when spawning a plot', () => {
    server.spawn({0: {
      opened: false,
      pending: false,
      plots: []
    }});

    expect(opn).toHaveBeenCalledTimes(1);
  });

  it('should serve the data', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/data/0`, (err, response, body) => {
      expect(JSON.parse(body)).toEqual([{data: [{ x: [1], y: [2]}]}]);
      done();
    });
  });

  it('should spawn two times but listen just once', (done) => {
    const data = {0: validData};

    server.spawn(data);
    server.spawn(data);

    request(`http://localhost:${port}/data/0`, (err, response, body) => {
      expect(JSON.parse(body)).toEqual([{data: [{ x: [1], y: [2]}]}]);
      done();
    });
  });

  it('should serve the website and return 404 if html file not found', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/index.html`, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('should serve the nodeplotlib script and return 404 if file not found', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/nodeplotlib.min.js`, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('should serve the plotly.min.js script and return 404 if file not found', (done) => {
    server.spawn({0: validData});

    request(`http://localhost:${port}/plots/0/plotly.min.js`, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('should not close the webserver, if one plot hasn\'t got its data', (done) => {
    server.spawn({
      0: { pending: false, opened: false, plots: [{ data: [{x: [1], y: [2]}] }]},
      1: { pending: false, opened: false, plots: [{ data: [{x: [1], y: [3]}] }]}
    });

    request(`http://localhost:${port}/data/0`, (err, response, body) => {
      expect(JSON.parse(body)).toEqual([{data: [{ x: [1], y: [2]}]}]);

      request(`http://localhost:${port}/data/1`, (err1, response1, body1) => {
        expect(JSON.parse(body1)).toEqual([{data: [{ x: [1], y: [3]}]}]);
        done();
      });
    });
  });

  it('should return 404 if routes not matching', (done) => {
    const data = {0: validData};

    server.spawn(data);

    request(`http://localhost:${port}/fdsaffds`, (err, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(response.body).toBe('Server address not found');
      done();
    });
  });

  afterEach(() => {
    server.clean();
    server = null;
  });

  // afterAll(() => {
  //   console.log((process as any)._getActiveRequests());
  //   console.log((process as any)._getActiveHandles()[0]);
  // });
});
