import { clear, plots } from '../src/plot';


describe('clear', () => {
  beforeEach(() => {
    plots.push('test' as any);
  });

  it('should clear the plots array', () => {
    clear();

    expect(plots).toEqual([]);
  });

  it('should be clearable multiple times', () => {
    clear();
    clear();

    expect(plots).toEqual([]);
  });
});
