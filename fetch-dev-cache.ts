export interface CacheFetchOptions {
  /**
   * 生成缓存key的策略，默认策略是直接拼接 url + stringify(body)
   */
  generateKey?: (url: RequestInfo, body: object) => string;
  /**
   * 传入 url 和 fetch 选项 判断是否需要缓存
   */
  shouldHandleRequest?(url: RequestInfo, requestInit?: RequestInit): boolean;
  /**
   * 传入 response 响应对象 判断是否需要缓存
   */
  shouldCacheResult?(response: Response): Promise<boolean>;
}

const STORAGE_PREFIX = 'request-dev-cache:';

export const startCache = ({
  generateKey = defaultGenerateKey,
  shouldHandleRequest = () => true,
  shouldCacheResult = async () => true,
}: CacheFetchOptions) => {
  if (process.env.NODE_ENV === 'development') {
    const parseBody = (options?: RequestInit) => {
      let { body: rawBody } = options ?? {};
      let body: object;
      if (typeof rawBody === 'string') {
        body = JSON.parse(rawBody as string) ?? {};
      } else {
        body = {};
      }
      return body;
    };

    const originFetch = window.fetch;
    window.fetch = async (...params) => {
      const [url, options] = params;
      if (!shouldHandleRequest?.(url, options)) {
        return originFetch(...params);
      }

      const body = parseBody(options);

      const cacheKey = `${STORAGE_PREFIX}${generateKey(url, body)}`;
      const cacheResult = localStorage.getItem(cacheKey);

      if (cacheResult) {
        const result = JSON.parse(cacheResult);
        log(url, body, result);
        return new Response(cacheResult);
      } else {
        const resp = await originFetch(...params);
        const clonedResponse = resp.clone();
        const result = await resp.json();
        const stringifyResult = JSON.stringify(result);
        if (await shouldCacheResult(clonedResponse)) {
          localStorage.setItem(cacheKey, stringifyResult);
        }
        return new Response(stringifyResult);
      }
    };

    /**
     * 清除所有缓存
     */
    (window as any).cleanAllRequestDevCaches = () => {
      const lens = localStorage.length;
      const targetKeys: string[] = [];
      for (let index = 0; index < lens; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith(STORAGE_PREFIX)) {
          targetKeys.push(key);
        }
      }
      targetKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    };

    /**
     * 根据 url 清除单个缓存
     */
    (window as any).cleanRequestDevCache = (url: string) => {
      localStorage.removeItem(`${STORAGE_PREFIX}${url}`);
    };
  }
};

function log(url, body, result) {
  console.groupCollapsed(`接口缓存读取成功 ${url}`);
  console.log('%c 接口参数', 'color: #03A9F4; font-weight: bold', body);
  console.log('%c 缓存结果', 'color: #4CAF50; font-weight: bold', result);
  console.groupEnd();
}

function defaultGenerateKey(url, body) {
  return `${url}-${JSON.stringify(body as object)}`;
}
