import type { Map } from 'maplibre-gl'

/**
 * OpenFreeMap 官方 Positron 主题。
 * Liberty 在部分网络环境下会出现样式入口请求失败，因此使用更稳定的 Positron。
 * 官方公共实例免费、无需 Key，并允许商业使用。
 */
export const mapStyle = 'https://tiles.openfreemap.org/styles/positron'

/** 调整底图色调，使其与站点的旅行手账视觉一致。 */
export function applyMapTheme(map: Map) {
  const colors: Record<string, Record<string, string>> = {
    background: { 'background-color': '#edf1eb' },
    park: { 'fill-color': '#dce8dc' },
    water: { 'fill-color': '#cfe3e7' },
    landuse_residential: { 'fill-color': '#eef0ea' },
    landcover_wood: { 'fill-color': '#dce9dc' },
    building: { 'fill-color': '#e7e9e4', 'fill-outline-color': '#d9dedb' },
    waterway: { 'line-color': '#bdd8de' },
    highway_minor: { 'line-color': '#dde2de' },
    highway_major_casing: { 'line-color': '#d0d9d5' },
    highway_motorway_casing: { 'line-color': '#cbd7d3' },
    boundary_2: { 'line-color': '#9eada9' },
    boundary_3: { 'line-color': '#b3bfbb' },
    boundary_disputed: { 'line-color': '#9eada9' },
  }

  Object.entries(colors).forEach(([layerId, paint]) => {
    if (!map.getLayer(layerId)) return
    Object.entries(paint).forEach(([property, value]) =>
      map.setPaintProperty(layerId, property, value),
    )
  })

  map.getStyle().layers.forEach((layer) => {
    if (layer.type !== 'symbol' || !/(label|name|airport)/.test(layer.id)) return
    map.setPaintProperty(layer.id, 'text-color', layer.id.includes('water') ? '#607f8d' : '#465852')
    map.setPaintProperty(layer.id, 'text-halo-color', 'rgba(255, 255, 255, 0.9)')
    map.setLayoutProperty(layer.id, 'text-field', [
      'coalesce',
      ['get', 'name:zh-Hans'],
      ['get', 'name:zh'],
      ['get', 'name'],
    ])
  })
}
