import { plots, stack } from '../src/plot';


const validData = [{x: [1], y: [1]}];


describe('stack', () => {
  beforeEach(() => {
    plots.length = 0;
  });

  it('should add a new plot', () => {
    stack(validData);

    expect(plots.length).toBe(1);
  });

  it('should stack data with layout', () => {
    stack(validData, {});

    expect(plots.length).toBe(1);
  });

  it('should throw an error if parameter is not an array', () => {
    expect(() => { stack('test' as any); })
        .toThrow('Plot data must be an array with at least 1 element');
  });

  it('should throw an error if array length is 0', () => {
    expect(() => { stack([]); })
        .toThrow('Plot data must be an array with at least 1 element');
  });

  it('should throw an error if layout is not an object', () => {
    expect(() => { stack(validData, 'test' as any); })
        .toThrow('Layout must be an object');
  });
});
