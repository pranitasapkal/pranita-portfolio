/**
 * NetworkScene — India logistics 3D backdrop for the hero section.
 *
 * Sub-components (all self-contained, ≤1 draw call each):
 *   IndiaPoints     — 23k-point cloud, custom ShaderMaterial; Act 1 scatter→India assembly,
 *                     Act 2 turbulent dissolve, shimmer
 *   HubNodes        — 44 primary + 8 tier-1 halo InstancedMesh glow sprites
 *   RouteArcs       — 28 bezier routes merged into 2 LineSegments (dim + flagship)
 *   ShipmentPulses  — 18 dots travelling along routes, 4 InstancedMesh (trail)
 *   CameraRig       — mouse parallax + GSAP ScrollTrigger scroll dolly + dissolve driver
 *
 * Performance contract: ~9 draw calls, dpr ≤1.75, frameloop paused off-screen + hidden tab.
 *
 * THREE ACTS:
 *   Act 1 MATERIALIZE — on loader:done, points fly scatter cloud → India formation (1.6s power3.out)
 *   Act 2 DISSOLVE    — scroll 0.55→1.0 drives uDissolve: turbulent downward drift + late alpha fade
 *   Act 3 HUB HALO   — tier-1 hubs get a second larger faint halo InstancedMesh (fake bloom)
 *                       Ghost text "THE NETWORK" lives in Hero.tsx DOM layer
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { EASE } from '../../lib/motion'
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'

// ── Scene constants ───────────────────────────────────────────────────────────
const SCALE = 1.8          // maps normalised coords → world units
const TILT_X = -22 * (Math.PI / 180)  // "map on a table" tilt
const N_SEG = 40           // bezier subdivisions per arc
const ARC_LIFT = 0.28      // z-height factor × arc distance
const TIER1_COUNT = 8      // first 8 HUBS entries are tier-1 (see comment below)

// ── Module-level animation state ──────────────────────────────────────────────
// Written by event listeners / ScrollTrigger onUpdate, read by useFrame per sub-component.
// Plain objects avoid React re-renders for pure animation state.
// Defaults of 1/1 are safe: canvas starts at opacity=0 in Hero so no visible flash.
const _anim  = { assemble: 1, hudOpacity: 1 }
const _scene = { dissolve: 0, hudScrollOpacity: 1 }
let _assembleHasFired = false

// ── Hub data ─────────────────────────────────────────────────────────────────
interface Hub { name: string; tier: 1 | 2 | 3; x: number; y: number }

const HUBS: Hub[] = [
  // Tier 1 — 8 major nodes (indices 0-7; must stay first for TIER1_COUNT to work)
  { name: 'Delhi',       tier: 1, x: -0.36,  y:  0.521 },
  { name: 'Mumbai',      tier: 1, x: -0.641, y: -0.142 },
  { name: 'Bengaluru',   tier: 1, x: -0.335, y: -0.567 },
  { name: 'Hyderabad',   tier: 1, x: -0.277, y: -0.26  },
  { name: 'Chennai',     tier: 1, x: -0.161, y: -0.56  },
  { name: 'Kolkata',     tier: 1, x:  0.364, y:  0.101 },
  { name: 'Pune',        tier: 1, x: -0.577, y: -0.181 },
  { name: 'Ahmedabad',   tier: 1, x: -0.661, y:  0.132 },
  // Tier 2 — 20 secondary hubs
  { name: 'Jaipur',      tier: 2, x: -0.452, y:  0.403 },
  { name: 'Surat',       tier: 2, x: -0.644, y:  0.003 },
  { name: 'Lucknow',     tier: 2, x: -0.117, y:  0.398 },
  { name: 'Kanpur',      tier: 2, x: -0.157, y:  0.371 },
  { name: 'Nagpur',      tier: 2, x: -0.238, y:  0.002 },
  { name: 'Indore',      tier: 2, x: -0.447, y:  0.111 },
  { name: 'Bhopal',      tier: 2, x: -0.347, y:  0.149 },
  { name: 'Patna',       tier: 2, x:  0.155, y:  0.311 },
  { name: 'Guwahati',    tier: 2, x:  0.583, y:  0.349 },
  { name: 'Bhubaneswar', tier: 2, x:  0.199, y: -0.057 },
  { name: 'Coimbatore',  tier: 2, x: -0.376, y: -0.703 },
  { name: 'Kochi',       tier: 2, x: -0.421, y: -0.779 },
  { name: 'Visakhapatnam',tier:2, x:  0.03,  y: -0.239 },
  { name: 'Vijayawada',  tier: 2, x: -0.137, y: -0.321 },
  { name: 'Raipur',      tier: 2, x: -0.073, y:  0.009 },
  { name: 'Ranchi',      tier: 2, x:  0.166, y:  0.154 },
  { name: 'Varanasi',    tier: 2, x:  0.015, y:  0.292 },
  { name: 'Agra',        tier: 2, x: -0.308, y:  0.421 },
  { name: 'Ludhiana',    tier: 2, x: -0.447, y:  0.68  },
  { name: 'Chandigarh',  tier: 2, x: -0.388, y:  0.668 },
  // Tier 3 — 16 regional spokes
  { name: 'Dehradun',    tier: 3, x: -0.307, y:  0.64  },
  { name: 'Jammu',       tier: 3, x: -0.512, y:  0.808 },
  { name: 'Amritsar',    tier: 3, x: -0.512, y:  0.731 },
  { name: 'Rajkot',      tier: 3, x: -0.776, y:  0.082 },
  { name: 'Vadodara',    tier: 3, x: -0.621, y:  0.083 },
  { name: 'Nashik',      tier: 3, x: -0.582, y: -0.079 },
  { name: 'Aurangabad',  tier: 3, x: -0.481, y: -0.086 },
  { name: 'Madurai',     tier: 3, x: -0.301, y: -0.779 },
  { name: 'Thiruvananthapuram', tier: 3, x: -0.377, y: -0.877 },
  { name: 'Mysuru',      tier: 3, x: -0.397, y: -0.614 },
  { name: 'Hubballi',    tier: 3, x: -0.495, y: -0.401 },
  { name: 'Goa',         tier: 3, x: -0.579, y: -0.392 },
  { name: 'Gwalior',     tier: 3, x: -0.297, y:  0.355 },
  { name: 'Jodhpur',     tier: 3, x: -0.632, y:  0.356 },
  { name: 'Siliguri',    tier: 3, x:  0.366, y:  0.39  },
  { name: 'Cuttack',     tier: 3, x:  0.203, y: -0.046 },
]

// ── Arc pairs (HUBS indices) ─────────────────────────────────────────────────
// 6 flagship arcs — amber, brighter
const FLAGSHIP_ARCS: [number, number][] = [
  [0, 1],  // Delhi ↔ Mumbai
  [1, 2],  // Mumbai ↔ Bengaluru
  [2, 4],  // Bengaluru ↔ Chennai
  [0, 5],  // Delhi ↔ Kolkata
  [0, 2],  // Delhi ↔ Bengaluru
  [1, 4],  // Mumbai ↔ Chennai
]
// 22 dim arcs — beacon teal
const DIM_ARCS: [number, number][] = [
  [0, 3],  // Delhi ↔ Hyderabad
  [5, 3],  // Kolkata ↔ Hyderabad
  [1, 3],  // Mumbai ↔ Hyderabad
  [2, 3],  // Bengaluru ↔ Hyderabad
  [7, 1],  // Ahmedabad ↔ Mumbai
  [7, 0],  // Ahmedabad ↔ Delhi
  [6, 1],  // Pune ↔ Mumbai
  [0, 8],  // Delhi ↔ Jaipur
  [0, 10], // Delhi ↔ Lucknow
  [0, 27], // Delhi ↔ Chandigarh
  [0, 25], // Delhi ↔ Agra
  [1, 9],  // Mumbai ↔ Surat
  [1, 12], // Mumbai ↔ Nagpur
  [2, 18], // Bengaluru ↔ Coimbatore
  [2, 19], // Bengaluru ↔ Kochi
  [4, 20], // Chennai ↔ Visakhapatnam
  [4, 21], // Chennai ↔ Vijayawada
  [5, 17], // Kolkata ↔ Bhubaneswar
  [5, 15], // Kolkata ↔ Patna
  [5, 16], // Kolkata ↔ Guwahati
  [3, 12], // Hyderabad ↔ Nagpur
  [5, 23], // Kolkata ↔ Ranchi
]

// ── Pulse definitions (18) ────────────────────────────────────────────────────
// arcSet: 'f'=flagship[0..5], 'd'=dim[0..21]
interface PulseDef { set: 'f' | 'd'; i: number; speed: number; offset: number; dir: 1 | -1 }
const PULSES: PulseDef[] = [
  // flagship routes — 8 pulses
  { set: 'f', i: 0, speed: 0.28, offset: 0.00, dir:  1 },
  { set: 'f', i: 0, speed: 0.22, offset: 0.50, dir: -1 },
  { set: 'f', i: 1, speed: 0.32, offset: 0.30, dir:  1 },
  { set: 'f', i: 1, speed: 0.18, offset: 0.70, dir: -1 },
  { set: 'f', i: 2, speed: 0.25, offset: 0.15, dir:  1 },
  { set: 'f', i: 3, speed: 0.30, offset: 0.60, dir:  1 },
  { set: 'f', i: 4, speed: 0.20, offset: 0.40, dir:  1 },
  { set: 'f', i: 5, speed: 0.35, offset: 0.20, dir: -1 },
  // dim routes — 10 pulses (was 6, +4 new for 18 total)
  { set: 'd', i:  0, speed: 0.22, offset: 0.10, dir:  1 },  // Delhi ↔ Hyderabad
  { set: 'd', i:  4, speed: 0.28, offset: 0.80, dir:  1 },  // Ahmedabad ↔ Mumbai
  { set: 'd', i:  7, speed: 0.25, offset: 0.55, dir:  1 },  // Delhi ↔ Jaipur
  { set: 'd', i: 13, speed: 0.20, offset: 0.35, dir:  1 },  // Bengaluru ↔ Coimbatore
  { set: 'd', i: 19, speed: 0.18, offset: 0.90, dir:  1 },  // Kolkata ↔ Guwahati
  { set: 'd', i: 20, speed: 0.24, offset: 0.45, dir:  1 },  // Hyderabad ↔ Nagpur
  { set: 'd', i:  2, speed: 0.26, offset: 0.25, dir:  1 },  // Mumbai ↔ Hyderabad
  { set: 'd', i:  6, speed: 0.23, offset: 0.65, dir: -1 },  // Pune ↔ Mumbai
  { set: 'd', i: 10, speed: 0.27, offset: 0.48, dir:  1 },  // Delhi ↔ Lucknow
  { set: 'd', i: 11, speed: 0.21, offset: 0.75, dir:  1 },  // Mumbai ↔ Surat
]

// ── Geometry helpers ─────────────────────────────────────────────────────────
function hubWorld(i: number): THREE.Vector3 {
  return new THREE.Vector3(HUBS[i].x * SCALE, HUBS[i].y * SCALE, 0)
}

const _ev = new THREE.Vector3()  // pre-allocated scratch vector

function evalArc(points: THREE.Vector3[], t: number, out: THREE.Vector3): THREE.Vector3 {
  const s = Math.max(0, Math.min(1, t)) * N_SEG
  const lo = Math.min(Math.floor(s), N_SEG - 1)
  const hi = lo + 1
  out.lerpVectors(points[lo], points[hi], s - lo)
  return out
}

interface ArcCurve { points: THREE.Vector3[] }

function buildArcCurve(fromIdx: number, toIdx: number): ArcCurve {
  const p0 = hubWorld(fromIdx)
  const p2 = hubWorld(toIdx)
  const cx = (p0.x + p2.x) * 0.5
  const cy = (p0.y + p2.y) * 0.5
  const dist = p0.distanceTo(p2)
  const ctrl = new THREE.Vector3(cx, cy, dist * ARC_LIFT)

  const points: THREE.Vector3[] = []
  for (let j = 0; j <= N_SEG; j++) {
    const t = j / N_SEG
    const u = 1 - t
    points.push(new THREE.Vector3(
      u*u*p0.x + 2*u*t*ctrl.x + t*t*p2.x,
      u*u*p0.y + 2*u*t*ctrl.y + t*t*p2.y,
      u*u*p0.z + 2*u*t*ctrl.z + t*t*p2.z,
    ))
  }
  return { points }
}

function buildMergedLineSegments(arcs: [number, number][]): THREE.BufferGeometry {
  const verts: number[] = []
  for (const [a, b] of arcs) {
    const { points } = buildArcCurve(a, b)
    for (let j = 0; j < N_SEG; j++) {
      verts.push(points[j].x, points[j].y, points[j].z)
      verts.push(points[j+1].x, points[j+1].y, points[j+1].z)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  return geo
}

// Module-level pre-computed curves (runs once on lazy-import, no GL context needed)
const FLAGSHIP_CURVES: ArcCurve[] = FLAGSHIP_ARCS.map(([a, b]) => buildArcCurve(a, b))
const DIM_CURVES: ArcCurve[] = DIM_ARCS.map(([a, b]) => buildArcCurve(a, b))

function pulseCurve(p: PulseDef): ArcCurve {
  return p.set === 'f' ? FLAGSHIP_CURVES[p.i] : DIM_CURVES[p.i]
}

function createGlowTexture(size: number): THREE.CanvasTexture {
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')!
  const c = size / 2
  const gr = ctx.createRadialGradient(c, c, 0, c, c, c * 0.95)
  gr.addColorStop(0,    'rgba(255,255,255,1)')
  gr.addColorStop(0.22, 'rgba(255,255,255,0.88)')
  gr.addColorStop(0.55, 'rgba(255,255,255,0.28)')
  gr.addColorStop(0.85, 'rgba(255,255,255,0.04)')
  gr.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(cv)
}

/** Wider, softer gradient for the tier-1 hub halo layer (fake bloom). */
function createHaloTexture(size: number): THREE.CanvasTexture {
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')!
  const c = size / 2
  const gr = ctx.createRadialGradient(c, c, 0, c, c, c * 0.98)
  gr.addColorStop(0,    'rgba(255,255,255,0.38)')
  gr.addColorStop(0.28, 'rgba(255,255,255,0.22)')
  gr.addColorStop(0.55, 'rgba(255,255,255,0.08)')
  gr.addColorStop(0.82, 'rgba(255,255,255,0.02)')
  gr.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(cv)
}

// ── Shaders ──────────────────────────────────────────────────────────────────
/**
 * Act 1 MATERIALIZE: aScatter → position mix driven by uAssemble (0→1).
 *   Per-point stagger via aHash so points arrive as a wave, not all at once.
 * Act 2 DISSOLVE: turbulent curlish drift added when uDissolve > 0.
 *   Points drift downward (−Y) and slightly toward camera (+Z).
 *   Alpha fades out over the last 22% of the dissolve range.
 */
const VERT = /* glsl */`
  uniform float uTime;
  uniform float uAssemble;   // 0→1: scatter cloud → India formation
  uniform float uDissolve;   // 0→1: India formation → turbulent drift downward

  attribute float aHash;
  attribute vec3  aScatter;  // deterministic random scatter position (precomputed in JS)

  varying  float vAlpha;

  void main() {
    // ── Assembly (Act 1) ─────────────────────────────────────────────────────
    // Stagger range 0.38: early hash=0 points arrive first, late hash=1 points last.
    // smoothstep gives a natural ease-in/out per point on top of the global power3 curve.
    float stagger   = aHash * 0.38;
    float localU    = clamp((uAssemble - stagger) / (1.0 - 0.38), 0.0, 1.0);
    float assembleT = localU * localU * (3.0 - 2.0 * localU);  // smoothstep(0,1,localU)

    vec3 assembledPos = mix(aScatter, position, assembleT);

    // ── Dissolve drift (Act 2) ────────────────────────────────────────────────
    // Cheap sin/cos "curlish" noise. Bias: −Y (downward), +Z (toward camera).
    float d2 = uDissolve * uDissolve;
    float nx = sin(position.x * 3.7 + uDissolve * 6.28) * 0.35;
    float ny = cos(position.y * 2.9 + uDissolve * 4.71) * 0.25 - 0.8;  // bias −Y
    float nz = sin((position.x + position.y) * 2.8 + uDissolve * 3.14) * 0.14 + 0.36; // bias +Z
    vec3 curlOff  = vec3(nx * d2 * 2.4, ny * d2 * 2.4, nz * d2 * 1.4);
    vec3 finalPos = mix(assembledPos, assembledPos + curlOff, uDissolve);

    // ── Alpha ─────────────────────────────────────────────────────────────────
    float speed   = 0.8 + aHash * 0.5;
    float shimmer = 0.65 + 0.35 * sin(uTime * speed + aHash * 6.2832);
    float inAlpha  = smoothstep(0.0, 0.5, assembleT);          // fade in as point arrives
    float outAlpha = 1.0 - smoothstep(0.78, 1.0, uDissolve);   // fade out last 22% of dissolve

    vAlpha = shimmer * inAlpha * outAlpha;

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = clamp(32.0 / -mv.z, 3.0, 9.0);
    gl_Position  = projectionMatrix * mv;
  }
`
const FRAG = /* glsl */`
  uniform vec3  uColor;
  varying float vAlpha;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    float a = (0.5 - d) * 2.0;
    gl_FragColor = vec4(uColor, a * vAlpha * 0.92);
  }
`

// ── IndiaPoints ───────────────────────────────────────────────────────────────
function IndiaPoints() {
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null)

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:     { value: 0 },
      uColor:    { value: new THREE.Color(0x6080A0) },
      uAssemble: { value: 1 },  // safe default: canvas is opacity=0 until loader:done
      uDissolve: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  // Fetch point cloud and build geometry with aScatter (scatter starting positions)
  useEffect(() => {
    let cancelled = false
    fetch('/geo/india-points.json')
      .then(r => r.json())
      .then((data: [number, number][]) => {
        if (cancelled) return
        const n = data.length
        const pos     = new Float32Array(n * 3)
        const hash    = new Float32Array(n)
        const scatter = new Float32Array(n * 3)

        for (let i = 0; i < n; i++) {
          // Target position (India formation)
          pos[i*3]   = data[i][0] * SCALE
          pos[i*3+1] = data[i][1] * SCALE
          pos[i*3+2] = 0

          // Shimmer hash (deterministic per point)
          const hv = Math.sin(data[i][0] * 127.1 + data[i][1] * 311.7) * 43758.5453
          hash[i] = hv - Math.floor(hv)

          // Scatter position: deterministic spherical cloud ~3-5 units radius
          const h1 = Math.sin(data[i][0] * 127.1 + data[i][1] * 311.7) * 43758.5453
          const h2 = Math.sin(data[i][0] * 311.7 + data[i][1] * 127.1) * 43758.5453
          const h3 = Math.sin((data[i][0] + data[i][1]) * 419.2)       * 43758.5453
          const r1 = ((h1 % 1) + 1) % 1  // 0→1
          const r2 = ((h2 % 1) + 1) % 1
          const r3 = ((h3 % 1) + 1) % 1

          // Uniform distribution on sphere, scaled to a shell of radius 3–5
          const cosP  = 2 * r1 - 1
          const sinP  = Math.sqrt(Math.max(0, 1 - cosP * cosP))
          const theta = r2 * 2 * Math.PI
          const rad   = 3.0 + r3 * 2.0

          scatter[i*3]   =  sinP * Math.cos(theta) * rad * 0.78
          scatter[i*3+1] =  sinP * Math.sin(theta) * rad * 0.78
          scatter[i*3+2] =  cosP * rad * 0.42
        }

        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos,     3))
        g.setAttribute('aHash',    new THREE.BufferAttribute(hash,    1))
        g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
        setGeo(g)
      })
      .catch(() => { /* silent — fallback SVG already visible */ })
    return () => { cancelled = true }
  }, [mat])

  // Assembly entrance: listen for loader:done, then tween _anim.assemble 0→1 (power3.out).
  // Also triggers hubs/arcs/pulses fade-in via _anim.hudOpacity with a 1.2s delay.
  // Reduced-motion: skip (defaults stay at 1, immediate full-form).
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let fired = false
    const run = () => {
      if (fired || _assembleHasFired) return
      fired = true
      _assembleHasFired = true

      // Start from scatter (canvas just became visible in Hero.tsx)
      _anim.assemble   = 0
      _anim.hudOpacity = 0

      // Points assemble: 1.6s, power3.out
      gsap.to(_anim, { assemble: 1, duration: 1.6, ease: 'power3.out' })
      // Hubs/arcs/pulses fade in with 0.4s overlap before assembly completes
      gsap.to(_anim, { hudOpacity: 1, duration: 0.6, delay: 1.2, ease: EASE })
    }

    window.addEventListener('loader:done', run as EventListener, { once: true })
    const fb = setTimeout(run, 2600)
    return () => {
      window.removeEventListener('loader:done', run as EventListener)
      clearTimeout(fb)
    }
  }, [])

  useEffect(() => () => { geo?.dispose() },  [geo])
  useEffect(() => () => { mat.dispose() },   [mat])

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value     = clock.getElapsedTime()
    mat.uniforms.uAssemble.value = _anim.assemble
    mat.uniforms.uDissolve.value = _scene.dissolve
  })

  if (!geo) return null
  return <points geometry={geo} material={mat} frustumCulled={false} />
}

// ── HubNodes ─────────────────────────────────────────────────────────────────
// Primary mesh: 44 instances (all hubs). Halo mesh: 8 instances (tier-1 only, fake bloom).
function HubNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const haloRef = useRef<THREE.InstancedMesh>(null)
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  // Primary texture + material
  const tex = useMemo(() => createGlowTexture(128), [])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(0xffb547),
  }), [tex])
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), [])

  // Halo texture + material (wider, softer, lower base opacity)
  const haloTex = useMemo(() => createHaloTexture(128), [])
  const haloMat = useMemo(() => new THREE.MeshBasicMaterial({
    map: haloTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(0xffb547),
    opacity: 0.0,  // driven each frame
  }), [haloTex])
  const haloGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), [])

  useEffect(() => () => {
    tex.dispose(); mat.dispose(); geo.dispose()
    haloTex.dispose(); haloMat.dispose(); haloGeo.dispose()
  }, [tex, mat, geo, haloTex, haloMat, haloGeo])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    const halo = haloRef.current
    if (!mesh || !halo) return
    const t = clock.getElapsedTime()

    // Effective opacity: entrance (assembly) × scroll exit
    const eff = Math.min(_anim.hudOpacity, _scene.hudScrollOpacity)
    mat.opacity     = eff
    haloMat.opacity = eff * 0.48  // halo is noticeably fainter

    // Primary: all 44 hubs
    for (let i = 0; i < HUBS.length; i++) {
      const h = HUBS[i]
      const base = h.tier === 1 ? 0.09 : h.tier === 2 ? 0.055 : 0.038
      const amp  = h.tier === 1 ? 0.014 : h.tier === 2 ? 0.010 : 0.007
      const s = base + amp * Math.sin(t * 1.7 + i * 0.73)
      dummy.position.set(h.x * SCALE, h.y * SCALE, 0.01)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true

    // Halo: tier-1 only (indices 0–7), larger sprite (~2.8×)
    for (let idx = 0; idx < TIER1_COUNT; idx++) {
      const h = HUBS[idx]
      const base = 0.09
      const amp  = 0.014
      const s = (base + amp * Math.sin(t * 1.7 + idx * 0.73)) * 2.8
      dummy.position.set(h.x * SCALE, h.y * SCALE, 0.005)  // slightly behind primary
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      halo.setMatrixAt(idx, dummy.matrix)
    }
    halo.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[geo, mat, HUBS.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={haloRef}
        args={[haloGeo, haloMat, TIER1_COUNT]}
        frustumCulled={false}
      />
    </>
  )
}

// ── RouteArcs ─────────────────────────────────────────────────────────────────
function RouteArcs() {
  const dimGeo  = useMemo(() => buildMergedLineSegments(DIM_ARCS),      [])
  const flagGeo = useMemo(() => buildMergedLineSegments(FLAGSHIP_ARCS), [])

  const dimMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(0x62d9c9),
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])
  const flagMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(0xffb547),
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  useEffect(() => () => {
    dimGeo.dispose(); flagGeo.dispose(); dimMat.dispose(); flagMat.dispose()
  }, [dimGeo, flagGeo, dimMat, flagMat])

  // Sync opacity from assembly + scroll state
  useFrame(() => {
    const eff = Math.min(_anim.hudOpacity, _scene.hudScrollOpacity)
    dimMat.opacity  = 0.16 * eff
    flagMat.opacity = 0.42 * eff
  })

  return (
    <>
      <lineSegments geometry={dimGeo}  material={dimMat}  frustumCulled={false} />
      <lineSegments geometry={flagGeo} material={flagMat} frustumCulled={false} />
    </>
  )
}

// ── ShipmentPulses ────────────────────────────────────────────────────────────
// 4 InstancedMesh: lead (full) + 3 fading trail steps, 18 pulses each
const TRAIL_OPACITIES = [1.0, 0.52, 0.22, 0.07] as const
const TRAIL_OFFSETS   = [0,   0.05, 0.10, 0.16] as const
const TRAIL_SIZES     = [1.0, 0.82, 0.65, 0.50] as const
const PULSE_BASE_SIZE = 0.058

function ShipmentPulses() {
  const lead   = useRef<THREE.InstancedMesh>(null)
  const trail1 = useRef<THREE.InstancedMesh>(null)
  const trail2 = useRef<THREE.InstancedMesh>(null)
  const trail3 = useRef<THREE.InstancedMesh>(null)
  const meshRefs = [lead, trail1, trail2, trail3] as const

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const tex  = useMemo(() => createGlowTexture(64), [])
  const geos = useMemo(() => TRAIL_OPACITIES.map(() => new THREE.PlaneGeometry(1, 1)), [])
  const mats = useMemo(() => TRAIL_OPACITIES.map(op => new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(0xffb547),
    opacity: op,
  })), [tex])

  useEffect(() => () => {
    tex.dispose()
    geos.forEach(g => g.dispose())
    mats.forEach(m => m.dispose())
  }, [tex, geos, mats])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const eff = Math.min(_anim.hudOpacity, _scene.hudScrollOpacity)

    for (let ti = 0; ti < 4; ti++) {
      const mesh = meshRefs[ti].current
      if (!mesh) continue
      // Sync opacity
      mats[ti].opacity = TRAIL_OPACITIES[ti] * eff

      const tOff = TRAIL_OFFSETS[ti]
      const sz   = PULSE_BASE_SIZE * TRAIL_SIZES[ti]
      for (let pi = 0; pi < PULSES.length; pi++) {
        const p = PULSES[pi]
        let prog = ((t * p.speed + p.offset) % 1 + 1) % 1
        if (p.dir === -1) prog = 1 - prog
        const sample = ((prog - tOff) % 1 + 1) % 1
        evalArc(pulseCurve(p).points, sample, _ev)
        dummy.position.set(_ev.x, _ev.y, _ev.z + 0.025)
        dummy.scale.setScalar(sz)
        dummy.updateMatrix()
        mesh.setMatrixAt(pi, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      {geos.map((g, ti) => (
        <instancedMesh
          key={ti}
          ref={meshRefs[ti]}
          args={[g, mats[ti], PULSES.length]}
          frustumCulled={false}
        />
      ))}
    </>
  )
}

// ── CameraRig ─────────────────────────────────────────────────────────────────
interface CameraRigProps {
  heroRef:    React.RefObject<HTMLElement | null>
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

function CameraRig({ heroRef, wrapperRef }: CameraRigProps) {
  const { camera } = useThree()
  const mTarget  = useRef({ x: 0, y: 0 })
  const mCurrent = useRef({ x: 0, y: 0 })
  const scrollP  = useRef(0)

  useEffect(() => {
    const isTouchDevice = ('ontouchstart' in window)

    const onMove = isTouchDevice ? null : (e: MouseEvent) => {
      mTarget.current.x = ((e.clientX / window.innerWidth)  - 0.5) * 0.28
      mTarget.current.y = ((e.clientY / window.innerHeight) - 0.5) * -0.22
    }
    if (onMove) window.addEventListener('mousemove', onMove)

    let st: ST | null = null
    if (heroRef.current) {
      st = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self: ST) => {
          const p = self.progress
          scrollP.current = p

          // Act 2 DISSOLVE: scroll 0.55→1.0 drives _scene.dissolve 0→1
          _scene.dissolve = Math.max(0, Math.min(1, (p - 0.55) / 0.45))

          // HUD scroll exit: hubs/arcs/pulses fade 0.55→0.75
          _scene.hudScrollOpacity = p < 0.55
            ? 1
            : Math.max(0, 1 - (p - 0.55) / 0.20)

          // Canvas wrapper: clean fade-out at 0.85→1.0 for proper off-screen transition
          if (wrapperRef.current) {
            const fade = p >= 0.85
              ? Math.max(0, 1 - (p - 0.85) / 0.15)
              : 1
            wrapperRef.current.style.opacity = String(fade)
          }
        },
      })
    }
    return () => {
      if (onMove) window.removeEventListener('mousemove', onMove)
      st?.kill()
    }
  }, [heroRef, wrapperRef])

  useFrame(() => {
    const lp = 0.055
    mCurrent.current.x += (mTarget.current.x - mCurrent.current.x) * lp
    mCurrent.current.y += (mTarget.current.y - mCurrent.current.y) * lp

    const ease = Math.min(scrollP.current / 0.85, 1)
    camera.position.x = mCurrent.current.x - ease * 0.18
    camera.position.y = 0.18 + mCurrent.current.y - ease * 0.12
    camera.position.z = 5 - ease * 1.5      // dolly 5 → 3.5
    camera.lookAt(
      -0.603 * ease * 0.22,
      -1.021 * ease * 0.10,
      0,
    )
  })

  return null
}

// ── NetworkScene (Canvas host) ────────────────────────────────────────────────
interface NetworkSceneProps {
  heroRef:    React.RefObject<HTMLElement | null>
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

export default function NetworkScene({ heroRef, wrapperRef }: NetworkSceneProps) {
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always')
  const innerRef = useRef<HTMLDivElement>(null)

  // Pause rendering when canvas leaves viewport or tab is hidden
  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? 'always' : 'never'),
      { threshold: 0 },
    )
    obs.observe(el)
    const onVisible = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onVisible)
    return () => { obs.disconnect(); document.removeEventListener('visibilitychange', onVisible) }
  }, [])

  // Force react-use-measure to re-measure after mount (avoids 300×150 canvas race)
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div ref={innerRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.18, 5], fov: 42, near: 0.1, far: 60 }}
        frameloop={frameloop}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <group rotation={[TILT_X, 0, 0]}>
          <IndiaPoints />
          <HubNodes />
          <RouteArcs />
          <ShipmentPulses />
        </group>
        <CameraRig heroRef={heroRef} wrapperRef={wrapperRef} />
      </Canvas>
    </div>
  )
}
