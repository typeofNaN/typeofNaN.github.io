import axios, {
  type AxiosResponse,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'

import { REFRESH_TOKEN_CODE } from '@/src/config'
import {
  handleAxiosError,
  handleBackendError,
  handleResponseError,
  handleServiceResult,
  transformRequestData
} from '@/src/utils'

type RefreshRequestQueue = (config: AxiosRequestConfig) => void

/**
 * 封装axios请求类
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance

  backendConfig: Service.BackendResultConfig

  isRefreshing: boolean

  retryQueues: RefreshRequestQueue[]

  /**
   * @param { AxiosRequestConfig } axiosConfig - axios配置
   * @param { Service.BackendResultConfig } backendConfig - 后端返回的数据配置
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'code',
      dataKey: 'data',
      msgKey: 'message',
      successCode: 200
    }
  ) {
    this.backendConfig = backendConfig
    this.instance = axios.create(axiosConfig)
    this.setInterceptor()
    this.isRefreshing = false
    this.retryQueues = []
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config }
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'] as UnionKey.ContentType
          handleConfig.data = await transformRequestData(handleConfig.data, contentType)
        }
        return handleConfig
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError)
        return handleServiceResult(error, null)
      }
    )
    this.instance.interceptors.response.use(
      (async response => {
        const { status, config } = response
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data
          const { codeKey, dataKey, successCode } = this.backendConfig
          // 请求成功
          if (backend[codeKey] === successCode) {
            return handleServiceResult(null, backend[dataKey])
          }

          // token失效, 刷新token
          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            // 原始请求
            const originRequest = new Promise(resolve => {
              this.retryQueues.push((refreshConfig: AxiosRequestConfig) => {
                config.headers.Authorization = refreshConfig.headers?.Authorization
                resolve(this.instance.request(config))
              })
            })

            return originRequest
          }

          const error = handleBackendError(backend, this.backendConfig)
          return handleServiceResult(error, null)
        }
        const error = handleResponseError(response)
        return handleServiceResult(error, null)
      }) as (response: AxiosResponse<any, any>) => Promise<AxiosResponse<any, any>>,
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError)
        return handleServiceResult(error, null)
      }
    )
  }
}
