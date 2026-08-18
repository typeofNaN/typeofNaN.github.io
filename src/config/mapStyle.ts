import type { Map } from 'maplibre-gl'

/**
 * OpenFreeMap 官方 Positron 浅色主题。
 * 与管理端共用同一份地图底图，且无需在浏览器中配置访问令牌。
 */
export const mapStyleUrl = 'https://tiles.openfreemap.org/styles/positron'

/** 将 OpenFreeMap Positron 调整为更柔和的 Apple Photos 浅色风格。 */
export function applyAppleMapTheme(map: Map) {
  const colors: Record<string, Record<string, string>> = {
    background: { 'background-color': '#f4f6f5' },
    park: { 'fill-color': '#e8eee7' },
    water: { 'fill-color': '#d8e8ed' },
    landuse_residential: { 'fill-color': '#eff0ed' },
    landcover_wood: { 'fill-color': '#e5eee6' },
    building: { 'fill-color': '#edeff0', 'fill-outline-color': '#dfe4e5' },
    waterway: { 'line-color': '#c4dbe2' },
    highway_minor: { 'line-color': '#e1e6e7' },
    highway_major_casing: { 'line-color': '#d6dddf' },
    highway_motorway_casing: { 'line-color': '#d3dcdf' },
    boundary_2: { 'line-color': '#aebbc0' },
    boundary_3: { 'line-color': '#bcc6c9' },
    boundary_disputed: { 'line-color': '#aebbc0' },
  }

  Object.entries(colors).forEach(([layerId, paint]) => {
    if (!map.getLayer(layerId)) return
    Object.entries(paint).forEach(([property, value]) => map.setPaintProperty(layerId, property, value))
  })

  map.getStyle().layers.forEach((layer) => {
    if (layer.type !== 'symbol' || !/(label|name|airport)/.test(layer.id)) return
    map.setPaintProperty(layer.id, 'text-color', layer.id.includes('water') ? '#66879a' : '#526168')
    map.setPaintProperty(layer.id, 'text-halo-color', 'rgba(255, 255, 255, 0.88)')
    map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:zh-Hans'], ['get', 'name:zh'], ['get', 'name']])
  })
}
