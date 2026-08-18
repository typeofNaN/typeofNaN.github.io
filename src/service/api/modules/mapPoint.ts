import { request } from '../../request'

export class MapPointApi {
  static getList() { return request.get<Api.MapPointApi.Detail[]>('/map-point') }
}
