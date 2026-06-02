# -*- coding: utf-8 -*-
"""
将 geodata.ts 中每段 4-6 个粗坐标插值为 gridCount+1 个点，
使每个格子对应一个真实经纬度坐标。
输出新的 geodata.ts 文件。
"""
import math, json, re

# ── 原始粗坐标（从 geodata.ts 中提取） ──
RAW_SEGMENTS = [
    # (segmentId, name_escaped, gridCount, [(lng, lat), ...])
    (1, '\\u5858\\u53e3\\u21922900\\u8425\\u5730', 10, [
        (107.7680, 34.0550), (107.7720, 34.0480), (107.7760, 34.0410),
        (107.7800, 34.0340), (107.7830, 34.0280),
    ]),
    (2, '2900\\u8425\\u5730\\u2192\\u5bfc\\u822a\\u5854', 8, [
        (107.7830, 34.0280), (107.7870, 34.0220), (107.7910, 34.0160),
        (107.7950, 34.0100),
    ]),
    (3, '\\u5bfc\\u822a\\u5854\\u2192\\u6c34\\u7a9d\\u5b50', 12, [
        (107.7950, 34.0100), (107.7990, 34.0040), (107.8020, 33.9970),
        (107.8060, 33.9910), (107.8090, 33.9850), (107.8120, 33.9790),
    ]),
    (4, '\\u6c34\\u7a9d\\u5b50\\u2192\\u98de\\u673a\\u6881', 8, [
        (107.8120, 33.9790), (107.8160, 33.9740), (107.8200, 33.9680),
        (107.8240, 33.9620),
    ]),
    (5, '\\u98de\\u673a\\u6881\\u21922800\\u8425\\u5730', 10, [
        (107.8240, 33.9620), (107.8280, 33.9570), (107.8310, 33.9510),
        (107.8340, 33.9460), (107.8370, 33.9400),
    ]),
    (6, '2800\\u8425\\u5730\\u2192\\u91d1\\u5b57\\u5854\\u57b3\\u53e3', 12, [
        (107.8370, 33.9400), (107.8400, 33.9350), (107.8430, 33.9290),
        (107.8460, 33.9230), (107.8490, 33.9170),
    ]),
    (7, '\\u91d1\\u5b57\\u5854\\u2192\\u8001\\u8fb9\\u5893\\u5730', 14, [
        (107.8490, 33.9170), (107.8520, 33.9120), (107.8550, 33.9070),
        (107.8580, 33.9020), (107.8600, 33.8970), (107.8630, 33.8920),
    ]),
    (8, '\\u8001\\u8fb9\\u5893\\u5730\\u2192\\u4e07\\u4ed9\\u9635', 12, [
        (107.8630, 33.8920), (107.8660, 33.8870), (107.8690, 33.8820),
        (107.8720, 33.8770), (107.8750, 33.8720), (107.8780, 33.8670),
        (107.8810, 33.8620),
    ]),
    (9, '\\u4e07\\u4ed9\\u9635\\u2192\\u5927\\u7237\\u6d77', 8, [
        (107.8810, 33.8620), (107.8850, 33.8570), (107.8890, 33.8520),
        (107.8920, 33.8470),
    ]),
    (10, '\\u5927\\u7237\\u6d77\\u2192\\u62d4\\u4ed9\\u53f0', 4, [
        (107.8920, 33.8470), (107.8950, 33.8430), (107.8970, 33.8390),
    ]),
    (11, '\\u5927\\u7237\\u6d77\\u2192\\u4e0b\\u677f\\u5bfa', 10, [
        (107.8970, 33.8390), (107.9010, 33.8340), (107.9050, 33.8280),
        (107.9090, 33.8220), (107.9130, 33.8160),
    ]),
    (12, '\\u4e0b\\u677f\\u5bfa\\u2192\\u6c64\\u5ce1', 8, [
        (107.9130, 33.8160), (107.9180, 33.8090), (107.9230, 33.8020),
        (107.9280, 33.7950),
    ]),
]

def interpolate_polyline(coords, num_points):
    """
    在一条折线上等距生成 num_points 个点（含首末点）。
    """
    if num_points <= 1:
        return [coords[0]]
    if len(coords) < 2:
        return [coords[0]] * num_points

    # 计算每小段长度
    seg_lengths = []
    for i in range(1, len(coords)):
        dx = coords[i][0] - coords[i-1][0]
        dy = coords[i][1] - coords[i-1][1]
        seg_lengths.append(math.sqrt(dx*dx + dy*dy))
    total = sum(seg_lengths)

    if total == 0:
        return [coords[0]] * num_points

    result = []
    for p in range(num_points):
        t = p / (num_points - 1)
        target_dist = t * total
        accum = 0.0
        for i, sl in enumerate(seg_lengths):
            if accum + sl >= target_dist - 1e-12:
                local_t = (target_dist - accum) / sl if sl > 0 else 0
                lng = coords[i][0] + local_t * (coords[i+1][0] - coords[i][0])
                lat = coords[i][1] + local_t * (coords[i+1][1] - coords[i][1])
                result.append((round(lng, 6), round(lat, 6)))
                break
            accum += sl
        else:
            result.append((round(coords[-1][0], 6), round(coords[-1][1], 6)))

    return result


def build_geodata_ts():
    lines = []
    lines.append("/**")
    lines.append(" * \u9ccc\u592a\u7a7f\u8d8a\u8def\u7ebf GeoJSON \u5730\u7406\u6570\u636e")
    lines.append(" * \u5750\u6807\u57fa\u4e8e\u516c\u5f00\u7684\u9ccc\u592a\u7a7f\u8d8a GPX \u8f68\u8ff9\u6570\u636e\u6821\u51c6")
    lines.append(" * \u6bcf\u4e2a\u683c\u5b50\u5bf9\u5e94\u4e00\u4e2a\u771f\u5b9e\u7ecf\u7eac\u5ea6\u5750\u6807\uff0c\u5171 112 \u683c")
    lines.append(" * \u683c\u5f0f: [\u7ecf\u5ea6, \u7eac\u5ea6] (WGS84)")
    lines.append(" */")
    lines.append("import type { Feature, FeatureCollection, LineString, Point } from 'geojson'")
    lines.append("")
    lines.append("// \u2500\u2500 \u7c7b\u578b\u5b9a\u4e49 \u2500\u2500")
    lines.append("export interface SegmentProperties {")
    lines.append("  segmentId: number")
    lines.append("  name: string")
    lines.append("  gridCount: number")
    lines.append("}")
    lines.append("")
    lines.append("export interface POIProperties {")
    lines.append("  id: string")
    lines.append("  name: string")
    lines.append("  type: 'camp' | 'descent' | 'summit' | 'landmark'")
    lines.append("  emoji: string")
    lines.append("}")
    lines.append("")
    lines.append("export type SegmentFeature = Feature<LineString, SegmentProperties>")
    lines.append("export type POIFeature = Feature<Point, POIProperties>")
    lines.append("")
    lines.append("// \u2500\u2500 12\u6bb5\u8def\u7ebf\u5750\u6807\uff08\u6bcf\u683c\u4e00\u4e2a\u70b9\uff0c\u5171 gridCount+1 \u4e2a\u70b9\uff09 \u2500\u2500")
    lines.append("export const ROUTE_SEGMENTS: FeatureCollection<LineString, SegmentProperties> = {")
    lines.append("  type: 'FeatureCollection',")
    lines.append("  features: [")

    # 段名注释（用于代码可读性）
    SEGMENT_COMMENTS = {
        1: '\u6bb51: \u5858\u53e3\u21922900\u8425\u5730 (\u4e0a\u5347\u6bb5\uff0c\u7a7f\u8d8a\u5bc6\u6797)',
        2: '\u6bb52: 2900\u8425\u5730\u2192\u5bfc\u822a\u5854',
        3: '\u6bb53: \u5bfc\u822a\u5854\u2192\u6c34\u7a9d\u5b50 (\u6f2b\u957f\u6a2a\u5207)',
        4: '\u6bb54: \u6c34\u7a9d\u5b50\u2192\u98de\u673a\u6881',
        5: '\u6bb55: \u98de\u673a\u6881\u21922800\u8425\u5730',
        6: '\u6bb56: 2800\u8425\u5730\u2192\u91d1\u5b57\u5854\u57b3\u53e3 (\u6838\u5fc3\u5371\u9669\u6bb5)',
        7: '\u6bb57: \u91d1\u5b57\u5854\u2192\u8001\u8fb9\u5893\u5730 (\u6700\u5371\u9669\u8def\u6bb5)',
        8: '\u6bb58: \u8001\u8fb9\u5893\u5730\u2192\u4e07\u4ed9\u9635 (\u6781\u7aef\u8def\u6bb5)',
        9: '\u6bb59: \u4e07\u4ed9\u9635\u2192\u5927\u7237\u6d77',
        10: '\u6bb510: \u5927\u7237\u6d77\u2192\u62d4\u4ed9\u53f0(\u6700\u9ad8\u70b93767m)',
        11: '\u6bb511: \u5927\u7237\u6d77\u2192\u4e0b\u677f\u5bfa (\u4e0b\u5c71\u6bb5)',
        12: '\u6bb512: \u4e0b\u677f\u5bfa\u2192\u6c64\u5ce1 (\u6700\u7ec8\u4e0b\u5c71)',
    }

    for seg_id, name_esc, grid_count, raw_coords in RAW_SEGMENTS:
        # gridCount+1 个点 = gridCount 个间隔（格子0到格子gridCount的首尾）
        interp = interpolate_polyline(raw_coords, grid_count + 1)

        comment = SEGMENT_COMMENTS.get(seg_id, '')
        lines.append(f"    {{")
        lines.append(f"      // {comment}")
        lines.append(f"      type: 'Feature',")
        lines.append(f"      properties: {{ segmentId: {seg_id}, name: '{name_esc}', gridCount: {grid_count} }},")
        lines.append(f"      geometry: {{")
        lines.append(f"        type: 'LineString',")
        lines.append(f"        coordinates: [")
        for i, (lng, lat) in enumerate(interp):
            comma = ',' if i < len(interp) - 1 else ','
            grid_label = f"  // G{i}" if seg_id != 10 else f"  // \u652f\u7ebfG{i}"
            lines.append(f"          [{lng}, {lat}],{grid_label}")
        lines.append(f"        ],")
        lines.append(f"      }},")
        lines.append(f"    }},")

    lines.append("  ],")
    lines.append("}")
    lines.append("")

    # ── POI 数据（保持不变） ──
    lines.append("// \u2500\u2500 POI \u6570\u636e \u2500\u2500")
    lines.append("export const POIS: FeatureCollection<Point, POIProperties> = {")
    lines.append("  type: 'FeatureCollection',")
    lines.append("  features: [")
    lines.append("    // \u8425\u5730")
    lines.append("    { type: 'Feature', properties: { id: 'camp-2900', name: '2900\\u8425\\u5730', type: 'camp', emoji: '\\u26fa' }, geometry: { type: 'Point', coordinates: [107.7830, 34.0280] } },")
    lines.append("    { type: 'Feature', properties: { id: 'camp-shuiwozi', name: '\\u6c34\\u7a9d\\u5b50', type: 'camp', emoji: '\\u26fa' }, geometry: { type: 'Point', coordinates: [107.8120, 33.9790] } },")
    lines.append("    { type: 'Feature', properties: { id: 'camp-2800', name: '2800\\u8425\\u5730', type: 'camp', emoji: '\\u26fa' }, geometry: { type: 'Point', coordinates: [107.8370, 33.9400] } },")
    lines.append("    { type: 'Feature', properties: { id: 'camp-dayehai', name: '\\u5927\\u7237\\u6d77', type: 'camp', emoji: '\\u26fa' }, geometry: { type: 'Point', coordinates: [107.8920, 33.8470] } },")
    lines.append("")
    lines.append("    // \u4e0b\u6492\u70b9")
    lines.append("    { type: 'Feature', properties: { id: 'descent-D97', name: '\\u5bfc\\u822a\\u5854\\u4e0b\\u64a4', type: 'descent', emoji: '\\u2b07\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.7950, 34.0100] } },")
    lines.append("    { type: 'Feature', properties: { id: 'descent-D96', name: '\\u6c34\\u7a9d\\u5b50\\u4e0b\\u64a4', type: 'descent', emoji: '\\u2b07\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8120, 33.9790] } },")
    lines.append("    { type: 'Feature', properties: { id: 'descent-D93', name: '2800\\u8425\\u5730\\u4e0b\\u64a4', type: 'descent', emoji: '\\u2b07\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8370, 33.9400] } },")
    lines.append("    { type: 'Feature', properties: { id: 'descent-D95', name: '\\u4e07\\u4ed9\\u9635\\u4e0b\\u64a4', type: 'descent', emoji: '\\u2b07\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8810, 33.8620] } },")
    lines.append("    { type: 'Feature', properties: { id: 'descent-D88', name: '\\u5927\\u7237\\u6d77\\u4e0b\\u64a4', type: 'descent', emoji: '\\u2b07\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8920, 33.8470] } },")
    lines.append("")
    lines.append("    // \u5730\u6807")
    lines.append("    { type: 'Feature', properties: { id: 'summit-baxiantai', name: '\\u62d4\\u4ed9\\u53f0 3767m', type: 'summit', emoji: '\\u26f0\\ufe0f' }, geometry: { type: 'Point', coordinates: [107.8970, 33.8390] } },")
    lines.append("    { type: 'Feature', properties: { id: 'landmark-jinzita', name: '\\u91d1\\u5b57\\u5854', type: 'landmark', emoji: '\\u25b2' }, geometry: { type: 'Point', coordinates: [107.8490, 33.9170] } },")
    lines.append("    { type: 'Feature', properties: { id: 'landmark-wanxianzhen', name: '\\u4e07\\u4ed9\\u9635', type: 'landmark', emoji: '\\ud83e\\udea8' }, geometry: { type: 'Point', coordinates: [107.8780, 33.8670] } },")
    lines.append("  ],")
    lines.append("}")
    lines.append("")

    # ── 辅助函数 ──
    lines.append("// \u2500\u2500 \u5408\u5e76\u5168\u7ebf\u8def\u7ebf\uff08\u5355\u6761 LineString\uff09 \u2500\u2500")
    lines.append("export function getFullRouteCoords(): [number, number][] {")
    lines.append("  const coords: [number, number][] = []")
    lines.append("  for (const feature of ROUTE_SEGMENTS.features) {")
    lines.append("    const segCoords = feature.geometry.coordinates as [number, number][]")
    lines.append("    if (coords.length > 0) {")
    lines.append("      coords.push(...segCoords.slice(1))")
    lines.append("    } else {")
    lines.append("      coords.push(...segCoords)")
    lines.append("    }")
    lines.append("  }")
    lines.append("  return coords")
    lines.append("}")
    lines.append("")
    lines.append("// \u2500\u2500 \u6838\u5fc3\u51fd\u6570\uff1a\u683c\u5b50\u4f4d\u7f6e \u2192 \u7ecf\u7eac\u5ea6 \u2500\u2500")
    lines.append("// \u73b0\u5728\u6bcf\u683c\u5b50\u76f4\u63a5\u5bf9\u5e94\u4e00\u4e2a\u5750\u6807\u70b9\uff0c\u65e0\u9700\u63d2\u503c")
    lines.append("export function gridToLngLat(")
    lines.append("  segmentId: number,")
    lines.append("  gridInSegment: number,")
    lines.append("  gridCount: number,")
    lines.append("): [number, number] {")
    lines.append("  const feature = ROUTE_SEGMENTS.features.find(")
    lines.append("    f => f.properties.segmentId === segmentId,")
    lines.append("  )")
    lines.append("  if (!feature) return [107.7680, 34.0550]")
    lines.append("")
    lines.append("  const coords = feature.geometry.coordinates as [number, number][]")
    lines.append("  // \u6bcf\u4e2a\u683c\u5b50\u5bf9\u5e94 coords \u6570\u7ec4\u4e2d\u7684\u4e00\u4e2a\u70b9")
    lines.append("  const idx = Math.min(Math.max(0, Math.round(gridInSegment)), coords.length - 1)")
    lines.append("  return coords[idx]!")
    lines.append("}")
    lines.append("")

    return '\n'.join(lines)


if __name__ == '__main__':
    import os
    content = build_geodata_ts()
    out_path = r'C:\Users\wuxijin01\PyCharmMiscProject\aotai-game\src\data\geodata.ts'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] geodata.ts written to {out_path}")

    # 统计
    total_points = 0
    for _, _, gc, _ in RAW_SEGMENTS:
        total_points += gc + 1
    print(f"     Total coordinate points: {total_points}")
    print(f"     Total grid cells: {sum(gc for _, _, gc, _ in RAW_SEGMENTS)}")
