"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cloud, globe, heart, text, type Shape } from "@/components/three/shapes";

const N = 14000;

export type Chapter = { kicker: string; title: string; line: string };

const VERT = /* glsl */ `
  attribute vec3 p0; attribute vec3 p1; attribute vec3 p2; attribute vec3 p3; attribute vec3 p4; attribute vec3 p5;
  attribute float g0; attribute float g1; attribute float g2; attribute float g3; attribute float g4; attribute float g5;
  attribute float rnd;
  uniform float uT; uniform float uTime; uniform float uPx; uniform float uBeat;
  varying float vGlow; varying float vRnd; varying float vFade;

  vec3 P(float i){ return i<0.5?p0: i<1.5?p1: i<2.5?p2: i<3.5?p3: i<4.5?p4:p5; }
  float G(float i){ return i<0.5?g0: i<1.5?g1: i<2.5?g2: i<3.5?g3: i<4.5?g4:g5; }

  void main(){
    float i = floor(uT);
    float f = uT - i;
    // cada partícula sale con un pequeño retraso: la forma se deshace y se rehace
    float d = rnd * 0.35;
    float k = clamp((f - d) / (1.0 - 0.35), 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    vec3 a = P(i);
    vec3 b = P(min(i + 1.0, 5.0));
    vec3 pos = mix(a, b, k);
    // explosión suave a mitad de camino
    float burst = sin(k * 3.14159) * (0.6 + rnd * 1.4);
    vec3 dir = normalize(vec3(sin(rnd * 91.0), cos(rnd * 47.0), sin(rnd * 13.0)) + 0.0001);
    pos += dir * burst * 0.55;
    // respiración y latido
    pos += 0.025 * vec3(sin(uTime * 1.3 + rnd * 40.0), cos(uTime * 1.1 + rnd * 23.0), sin(uTime * 0.9 + rnd * 17.0));
    pos *= 1.0 + uBeat * 0.06;
    vGlow = mix(G(i), G(min(i + 1.0, 5.0)), k);
    vRnd = rnd;
    vFade = vGlow < -0.5 ? 0.25 : 1.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (vGlow > 0.5 ? 2.2 : 1.4) + rnd * 1.6;
    gl_PointSize = size * uPx * (6.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 cA; uniform vec3 cB; uniform vec3 cG;
  varying float vGlow; varying float vRnd; varying float vFade;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    vec3 col = mix(cA, cB, vRnd);
    col = mix(col, cG, clamp(vGlow, 0.0, 1.0));
    float a = soft * (0.55 + 0.45 * clamp(vGlow, 0.0, 1.0)) * vFade;
    gl_FragColor = vec4(col * (1.0 + clamp(vGlow, 0.0, 1.0) * 0.6), a);
  }
`;

/**
 * Historia de partículas en 3D: el bloque se queda fijo mientras haces scroll y
 * las partículas pasan de una forma a otra (corazón → M & R → globo → fecha → corazón).
 */
export function ParticleStory({
  chapters,
  labels,
  visited,
}: {
  chapters: Chapter[];
  /** Textos que forman las partículas en las etapas 2 y 4 */
  labels: [string, string];
  /** Países visitados (ISO numérico) que brillan en el globo */
  visited: string[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const group = new THREE.Group();
    scene.add(group);

    // estrellas
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 2] = -8 - Math.random() * 20;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffe3ec, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    scene.add(stars);

    const geo = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uT: { value: 0 },
        uTime: { value: 0 },
        uPx: { value: dpr * 2.2 },
        uBeat: { value: 0 },
        cA: { value: new THREE.Color("#f4a9c0") },
        cB: { value: new THREE.Color("#ffe8d8") },
        cG: { value: new THREE.Color("#ff4d86") },
      },
    });
    const points = new THREE.Points(geo, material);
    group.add(points);

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // en el móvil, alejar un poco para que quepa todo
      camera.position.z = w < 700 ? 10.5 : 6.4;
      group.position.y = w < 700 ? 0.9 : 0;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let pointerX = 0;
    let pointerY = 0;
    function onPointer(e: PointerEvent) {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointer, { passive: true });

    async function build() {
      await document.fonts.ready.catch(() => undefined);
      const fontFam = getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() || "serif";
      const font = `${fontFam}, Georgia, serif`;
      const shapes: Shape[] = [
        cloud(N, 7, 11),
        heart(N, 1.05, 12),
        text(N, labels[0], font, 4.4, 13),
        await globe(N, visited, 1.75, 14),
        text(N, labels[1], font, 4.6, 15),
        heart(N, 1.25, 16),
      ];
      if (disposed) return;
      shapes.forEach((s, i) => {
        geo.setAttribute(`p${i}`, new THREE.BufferAttribute(s.pos, 3));
        geo.setAttribute(`g${i}`, new THREE.BufferAttribute(s.glow, 1));
      });
      geo.setAttribute("position", new THREE.BufferAttribute(shapes[1].pos, 3));
      const rnd = new Float32Array(N);
      for (let i = 0; i < N; i++) rnd[i] = Math.random();
      geo.setAttribute("rnd", new THREE.BufferAttribute(rnd, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
      setReady(true);
    }
    void build();

    const clock = new THREE.Clock();
    let intro = 0;
    let shown = -1;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px" });
    io.observe(wrap);

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      // progreso del scroll dentro del bloque
      const r = wrap!.getBoundingClientRect();
      const total = wrap!.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
      // 5 tramos (corazón, M&R, globo, fecha, corazón): se queda quieto la primera mitad de cada uno
      const seg = p * 4;
      const i = Math.min(3, Math.floor(seg));
      const f = seg - i;
      const k = Math.max(0, Math.min(1, (f - 0.5) / 0.5));
      // al cargar: la nube se convierte en corazón
      intro = Math.min(1, intro + (reduced ? 1 : 0.012));
      const uT = p <= 0.0001 ? intro : 1 + i + (p >= 1 ? 1 : k);
      material.uniforms.uT.value = Math.min(5, uT);
      material.uniforms.uTime.value = reduced ? 0 : t;
      // latido en los corazones
      const onHeart = uT < 1.5 || uT > 4.5;
      const beat = Math.max(0, Math.sin(t * 5.2)) ** 6 + Math.max(0, Math.sin(t * 5.2 - 0.6)) ** 10 * 0.6;
      material.uniforms.uBeat.value = onHeart && !reduced ? beat : 0;
      // giro: en el globo, España mirando a cámara y girando despacio
      const onGlobe = uT > 2.5 && uT < 3.5;
      const targetY = onGlobe ? 0.08 + Math.sin(t * 0.25) * 0.35 : Math.sin(t * 0.35) * 0.35;
      group.rotation.y += (targetY + pointerX * 0.25 - group.rotation.y) * 0.05;
      group.rotation.x += ((onGlobe ? 0.62 : 0) + pointerY * 0.12 - group.rotation.x) * 0.05;
      stars.rotation.y = t * 0.01;
      const st = p >= 1 ? 4 : f < 0.62 ? i : i + 1;
      if (st !== shown) {
        shown = st;
        setStage(st);
      }
      renderer.render(scene, camera);
    }
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      material.dispose();
      starGeo.dispose();
      renderer.dispose();
    };
  }, [labels, visited]);

  const c = chapters[Math.min(stage, chapters.length - 1)];

  return (
    <section ref={wrapRef} className="ps" style={{ height: `${chapters.length * 110}svh` }}>
      <div className="ps-stage">
        <canvas ref={canvasRef} className={`ps-canvas ${ready ? "is-ready" : ""}`} />
        <div className="ps-copy" key={stage}>
          <p className="ps-kicker">{c.kicker}</p>
          <h2 className="ps-title">{c.title}</h2>
          <p className="ps-line">{c.line}</p>
        </div>
        <ol className="ps-dots" aria-hidden>
          {chapters.map((_, i) => (
            <li key={i} className={i === stage ? "is-on" : ""} />
          ))}
        </ol>
        {stage === 0 ? <p className="ps-hint">Desliza</p> : null}
      </div>
    </section>
  );
}
