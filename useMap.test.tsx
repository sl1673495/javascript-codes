import { renderHook } from 'react-hooks-testing-library';
import { useMap } from '../useMap';

const dataSource = [
  { id: 1, name: 'foo' },
  { id: 2, name: 'bar' },
];
const testSymbol = Symbol('test');

describe('test useMap', () => {
  test('should useMap works with single argument', () => {
    const { result } = renderHook(() => useMap(dataSource));
    const { map, set } = result.current;

    expect(map).toEqual({ 1: undefined, 2: undefined });

    const testItem = dataSource[0];
    set(testItem.id, testSymbol);
    expect(result.current.map[testItem.id]).toBe(testSymbol);
  });

  test('should useMap works with options', () => {
    const dataSource = [
      { aid: 1, name: 'foo' },
      { aid: 2, name: 'bar' },
    ];
    const { result } = renderHook(() =>
      useMap(dataSource, {
        key: 'aid',
        initial(item) {
          return item.aid + 1;
        },
      })
    );
    const { map, set } = result.current;
    expect(map).toEqual({ 1: 2, 2: 3 });

    const testItem = dataSource[1];
    set(testItem.aid, testSymbol);
    expect(result.current.map[testItem.aid]).toBe(testSymbol);
  });

  test('should new dataSource item be initialized', () => {
    let dataSource = [{ id: 1, name: 'foo' }];
    const { result, rerender } = renderHook(() =>
      useMap(dataSource, {
        initial() {
          return 'initial';
        },
      })
    );
    dataSource = [{ id: 3, name: 'baz' }];
    rerender();
    expect(result.current.map[3]).toBe('initial');
  });

  test('should set works', () => {
    const { result } = renderHook(() => useMap(dataSource));
    const { set } = result.current;
    const testItem = dataSource[0];
    set(testItem.id, testSymbol);
    expect(result.current.map[testItem.id]).toBe(testSymbol);
  });

  test('should useMap other dispatch types work', () => {
    const { result } = renderHook(() => useMap(dataSource));
    const { dispatch } = result.current;

    dispatch({
      type: 'CHANGE_ALL',
      payload: testSymbol,
    });
    dataSource.forEach(({ id }) => {
      expect(result.current.map[id]).toBe(testSymbol);
    });

    dispatch({
      type: 'SET_MAP',
      payload: { 1: 'bar' },
    });
    expect(result.current.map[1]).toBe('bar');

    dispatch({
      type: 'SOME_UNKNOWN_TYPE' as any,
      payload: undefined,
    });
    expect(result.current.map[1]).toBe('bar');
  });
});
