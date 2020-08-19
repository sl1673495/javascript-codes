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
  
  export const startCache = ({
    generateKey = defaultGenerateKey,
    shouldHandleRequest = () => true,
    shouldCacheResult = async () => true,
  }: CacheFetchOptions) => {
    if (process.env.NODE_ENV === 'development') {
      const originFetch = window.fetch;
      window.fetch = async (...params) => {
        const [url, options] = params;
        if (!shouldHandleRequest?.(url, options)) {
          return originFetch(...params);
        }
        let { body } = options ?? {};
        if (typeof body === 'string') {
          body = JSON.parse(body as string) ?? {};
        }
        const cacheKey = generateKey(url, body as object);
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
  