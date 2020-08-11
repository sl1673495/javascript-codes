import { useReducer, useEffect, useCallback } from 'react';

export type MapType = {
  [key: string]: any;
};

export const CHANGE = 'CHANGE';

export const CHANGE_ALL = 'CHANGE_ALL';

export const SET_MAP = 'SET_MAP';

export type Change = {
  type: typeof CHANGE;
  payload: {
    key: any;
    value: any;
  };
};

export type ChangeAll = {
  type: typeof CHANGE_ALL;
  payload: any;
};

export type SetCheckedMap = {
  type: typeof SET_MAP;
  payload: MapType;
};

export type Action = Change | ChangeAll | SetCheckedMap;

export type Initial<T> = (dataItem: T) => any;

export interface Option<T> {
  /** 用来在map中作为key 一般取id */
  key?: string;
  initial?: (dataItem: T) => any;
}

/**
 * 根据数组生成对应的map 默认以每一项的id为key
 *
 * - 在数据异步更新的时候也可以为新增项生成初始值
 * - 允许在数据更新的时候自动剔除陈旧项
 */
export function useMap<T extends Record<string, any>>(
  dataSource: T[],
  option: Option<T> = {}
) {
  const { key = 'id', initial = () => undefined } = option;

  const getInitialMap = () =>
    dataSource.reduce((prev, cur) => {
      const { [key]: id } = cur;
      prev[id] = initial(cur);
      return prev;
    }, {});

  const [map, dispatch] = useReducer(
    (checkedMapParam: MapType, action: Action) => {
      switch (action.type) {
        // 单值改变
        case CHANGE: {
          const { payload } = action;
          const { key, value } = payload;
          return {
            ...checkedMapParam,
            [key]: value,
          };
        }
        // 所有值改变
        case CHANGE_ALL: {
          const { payload } = action;
          const newMap: MapType = {};
          dataSource.forEach(dataItem => {
            newMap[dataItem[key]] = payload;
          });
          return newMap;
        }
        // 完全替换map
        case SET_MAP: {
          return action.payload;
        }
        default:
          return checkedMapParam;
      }
    },
    getInitialMap()
  );

  /** map某项的值变更 */
  const set = useCallback((key, value) => {
    dispatch({
      type: CHANGE,
      payload: {
        key,
        value,
      },
    });
  }, []);

  /** map中所有值变更 */
  const setAll = useCallback(value => {
    dispatch({
      type: CHANGE_ALL,
      payload: value,
    });
  }, []);

  // 数据更新的时候 对新加入的数据进行初始化处理
  useEffect(() => {
    let changed = false;
    dataSource.forEach(dataItem => {
      const { [key]: id } = dataItem;
      if (!(id in map)) {
        map[id] = initial(dataItem);
        changed = true;
      }
    });

    if (changed) {
      dispatch({
        type: SET_MAP,
        payload: map,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  return {
    map,
    set,
    setAll,
    dispatch,
  };
}
