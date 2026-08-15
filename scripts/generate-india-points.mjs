import { readFileSync, writeFileSync } from 'node:fs'

// Samples a jittered grid of points inside India's boundary (Natural Earth 50m,
// public domain) for the hero point cloud. Deterministic. Output: normalized
// [x, y] pairs (lon/lat mapped to roughly -1..1, aspect-corrected) as JSON.
// Usage: node scripts/generate-india-points.mjs [/path/to/ne_countries.geojson]

const src = process.argv[2] ?? '/tmp/ne_countries.geojson'
const MAX_POINTS = 40000
const geo = JSON.parse(readFileSync(src, 'utf8'))
const india = geo.features.find(
  (f) => (f.properties.name || f.properties.NAME || f.properties.ADMIN) === 'India',
)
if (!india) throw new Error('India feature not found')

const polys =
  india.geometry.type === 'MultiPolygon' ? india.geometry.coordinates : [india.geometry.coordinates]

// Ray-casting point-in-polygon (outer ring only; NE has no holes for India).
function inRing(ring, x, y) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
const inIndia = (x, y) => polys.some((p) => inRing(p[0], x, y))

// Bounding box
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
for (const p of polys)
  for (const [x, y] of p[0]) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

// Deterministic PRNG for jitter
let seed = 7
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296

// Pick grid step so accepted points land near MAX_POINTS (land ≈ 58% of bbox).
const bboxW = maxX - minX
const bboxH = maxY - minY
const step = Math.sqrt((bboxW * bboxH * 0.58) / MAX_POINTS)

const pts = []
for (let y = minY; y <= maxY; y += step) {
  for (let x = minX; x <= maxX; x += step) {
    const jx = x + (rand() - 0.5) * step * 0.9
    const jy = y + (rand() - 0.5) * step * 0.9
    if (inIndia(jx, jy)) pts.push([jx, jy])
  }
}

// Normalize: center at 0, scale longest axis to 2 (-1..1), latitude aspect-corrected.
const cx = (minX + maxX) / 2
const cy = (minY + maxY) / 2
const latScale = Math.cos((cy * Math.PI) / 180)
const halfW = (bboxW / 2) * latScale
const halfH = bboxH / 2
const scale = 1 / Math.max(halfW, halfH)
const out = pts
  .slice(0, MAX_POINTS)
  .map(([x, y]) => [
    Math.round((x - cx) * latScale * scale * 1000) / 1000,
    Math.round((y - cy) * scale * 1000) / 1000,
  ])

writeFileSync('public/geo/india-points.json', JSON.stringify(out))
console.log(`wrote ${out.length} points (step ${step.toFixed(3)}°) → public/geo/india-points.json`)

// Hub nodes: major cities as [name, lon, lat], projected with the SAME transform
// so they sit exactly on the point cloud. Tier 1 hubs render brighter/larger.
const HUBS = [
  ['Delhi', 77.21, 28.61, 1], ['Mumbai', 72.88, 19.08, 1], ['Bengaluru', 77.59, 12.97, 1],
  ['Hyderabad', 78.49, 17.38, 1], ['Chennai', 80.27, 13.08, 1], ['Kolkata', 88.36, 22.57, 1],
  ['Pune', 73.86, 18.52, 1], ['Ahmedabad', 72.57, 23.02, 1], ['Jaipur', 75.79, 26.91, 2],
  ['Surat', 72.83, 21.17, 2], ['Lucknow', 80.95, 26.85, 2], ['Kanpur', 80.33, 26.45, 2],
  ['Nagpur', 79.09, 21.15, 2], ['Indore', 75.86, 22.72, 2], ['Bhopal', 77.41, 23.26, 2],
  ['Patna', 85.14, 25.59, 2], ['Guwahati', 91.74, 26.14, 2], ['Bhubaneswar', 85.82, 20.3, 2],
  ['Coimbatore', 76.96, 11.02, 2], ['Kochi', 76.27, 9.93, 2], ['Visakhapatnam', 83.22, 17.69, 2],
  ['Vijayawada', 80.65, 16.51, 2], ['Raipur', 81.63, 21.25, 2], ['Ranchi', 85.31, 23.34, 2],
  ['Varanasi', 82.99, 25.32, 2], ['Agra', 78.01, 27.18, 2], ['Ludhiana', 75.86, 30.9, 2],
  ['Chandigarh', 76.78, 30.73, 2], ['Dehradun', 78.03, 30.32, 3], ['Jammu', 74.87, 32.73, 3],
  ['Amritsar', 74.87, 31.63, 3], ['Rajkot', 70.8, 22.3, 3], ['Vadodara', 73.18, 22.31, 3],
  ['Nashik', 73.79, 19.99, 3], ['Aurangabad', 75.34, 19.88, 3], ['Madurai', 78.12, 9.93, 3],
  ['Thiruvananthapuram', 76.94, 8.52, 3], ['Mysuru', 76.64, 12.3, 3], ['Hubballi', 75.12, 15.36, 3],
  ['Goa', 73.83, 15.49, 3], ['Gwalior', 78.18, 26.22, 3], ['Jodhpur', 73.02, 26.24, 3],
  ['Siliguri', 88.39, 26.73, 3], ['Cuttack', 85.88, 20.46, 3],
]
const hubs = HUBS.map(([name, lon, lat, tier]) => ({
  name,
  tier,
  x: Math.round((lon - cx) * latScale * scale * 1000) / 1000,
  y: Math.round((lat - cy) * scale * 1000) / 1000,
}))
writeFileSync('public/geo/hubs.json', JSON.stringify(hubs))
console.log(`wrote ${hubs.length} hubs → public/geo/hubs.json`)
