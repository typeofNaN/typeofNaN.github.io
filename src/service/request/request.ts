import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import CustomAxiosInstance from './instance'

type RequestMethod = 'get' | 'post' | 'put' | 'delete'

interface RequestParam {
  url: string
  method?: RequestMethod
  data?: any
  axiosConfig?: AxiosRequestConfig
}

/**
 * @description 创建请求
 * @param { AxiosRequestConfig } axiosConfig - axios配置
 * @param { Service.BackendResultConfig } backendConfig - 后端接口字段配置
 */
export function createRequest(axiosConfig: AxiosRequestConfig, backendConfig?: Service.BackendResultConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig, backendConfig)

  /**
   * @description 异步promise请求
   * @param { RequestParam } param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   */
  async function asyncRequest<T>(param: RequestParam): Promise<Service.RequestResult<T>> {
    const { url } = param
    const method = param.method || 'get'
    const { instance } = customInstance
    const res = (await getRequestResponse({
      instance,
      method,
      url,
      data: param.data,
      config: param.axiosConfig
    })) as Service.RequestResult<T>

    return res
  }

  /**
   * @description get请求
   * @param { string } url - 请求地址
   * @param { AxiosRequestConfig } config - axios配置
   */
  function get<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'get', axiosConfig: config })
  }

  /**
   * @description post请求
   * @param { string } url - 请求地址
   * @param { any } data - 请求的body的data
   * @param { AxiosRequestConfig } config - axios配置
   */
  function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'post', data, axiosConfig: config })
  }

  /**
   * @description put请求
   * @param { string } url - 请求地址
   * @param { any } data - 请求的body的data
   * @param { AxiosRequestConfig } config - axios配置
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'put', data, axiosConfig: config })
  }

  /**
   * @description delete请求
   * @param { string } url - 请求地址
   * @param { AxiosRequestConfig } config - axios配置
   */
  function handleDelete<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'delete', axiosConfig: config })
  }

  return {
    get,
    post,
    put,
    delete: handleDelete
  }
}

interface RequestResultHook<T = any> {
  data: T | null
  error: Service.RequestError | null
}

/**
 * @description 创建hooks请求
 * @param { AxiosRequestConfig } axiosConfig - axios配置
 * @param { Service.BackendResultConfig } backendConfig - 后端接口字段配置
 */
export function createHookRequest(axiosConfig: AxiosRequestConfig, backendConfig?: Service.BackendResultConfig) {
  const customInstance = new CustomAxiosInstance(axiosConfig, backendConfig)

  /**
   * @description hooks请求
   * @param { RequestParam } param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   */
  function customRequest<T>(param: RequestParam): RequestResultHook<T> {
    let data: T | null = null
    let error: Service.RequestError | null = null

    function handleRequestResult(response: any) {
      const res = response as Service.RequestResult<T>
      data = res.data
      error = res.error
    }

    const { url } = param
    const method = param.method || 'get'
    const { instance } = customInstance

    getRequestResponse({
      instance,
      method,
      url,
      data: param.data,
      config: param.axiosConfig
    }).then(
      handleRequestResult
    )

    return {
      data,
      error
    }
  }

  /**
   * @description get请求
   * @param { string } url - 请求地址
   * @param { AxiosRequestConfig } config - axios配置
   */
  function get<T>(url: string, config?: AxiosRequestConfig) {
    return customRequest<T>({ url, method: 'get', axiosConfig: config })
  }

  /**
   * @description post请求
   * @param { string } url - 请求地址
   * @param { any } data - 请求的body的data
   * @param { AxiosRequestConfig } config - axios配置
   */
  function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return customRequest<T>({ url, method: 'post', data, axiosConfig: config })
  }

  /**
   * @description put请求
   * @param { string } url - 请求地址
   * @param { any } data - 请求的body的data
   * @param { AxiosRequestConfig } config - axios配置
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return customRequest<T>({ url, method: 'put', data, axiosConfig: config })
  }

  /**
   * @description delete请求
   * @param { string } url - 请求地址
   * @param { AxiosRequestConfig } config - axios配置
   */
  function handleDelete<T>(url: string, config: AxiosRequestConfig) {
    return customRequest<T>({ url, method: 'delete', axiosConfig: config })
  }

  return {
    get,
    post,
    put,
    delete: handleDelete
  }
}

async function getRequestResponse(params: {
  instance: AxiosInstance
  method: RequestMethod
  url: string
  data?: any
  config?: AxiosRequestConfig
}) {
  const {
    instance,
    method,
    url,
    data,
    config
  } = params

  let res: any
  if (method === 'get' || method === 'delete') {
    res = await instance[method](url, config)
  } else {
    res = await instance[method](url, data, config)
  }
  return res
}
