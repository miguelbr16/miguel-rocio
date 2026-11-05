"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { heart, text } from "@/components/three/shapes";

const N = 12000;

const VERT = /* glsl */ `
  attribute vec3 pA; attribute vec3 pB; attribute float gA; attribute float gB; attribute float rnd;
  uniform float uT; uniform float uExp; uniform float uTime; uniform float uBeat; uniform float uPx;
  varying float vGlow; varying float vRnd; varying float vExp;
  void main(){
    float d = rnd * 0.35;
    float k = clamp((uT - d) / 0.65, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    vec3 pos = mix(pA, pB, k);
    vec3 dir = normalize(vec3(sin(rnd * 91.0), cos(rnd * 47.0), sin(rnd * 13.0)) + 0.0001);
    pos += dir * sin(k * 3.14159) * (0.4 + rnd);
    pos += 0.02 * vec3(sin(uTime * 1.3 + rnd * 40.0), cos(uTime * 1.1 + rnd * 23.0), 0.0);
    pos *= 1.0 + uBeat * 0.07;
    // explosión hacia la cámara
    float e = uExp * uExp;
    pos += dir * e * (5.0 + rnd * 9.0);
    pos.z += e * (6.0 + rnd * 10.0);
    vGlow = mix(gA, gB, k); vRnd = rnd; vExp = uExp;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = ((vGlow > 0.5 ? 2.2 : 1.4) + rnd * 1.6) * uPx * (6.0 / max(0.4, -mv.z));
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 cA; uniform vec3 cB; uniform vec3 cG; uniform float uErr;
  varying float vGlow; varying float vRnd; varying float vExp;
  void main(){
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    vec3 col = mix(cA, cB, vRnd);
    col = mix(col, cG, clamp(vGlow, 0.0, 1.0));
    col = mix(col, vec3(1.0, 0.25, 0.3), uErr);
    float a = soft * (0.55 + 0.45 * vGlow) * (1.0 - smoothstep(0.6, 1.0, vExp));
    gl_FragColor = vec4(col * (1.0 + vGlow * 0.6), a);
  }
`;

export type UnlockHandle = {
  /** Latido corto (al escribir un número) */
  pulse: () => void;
  /** Error: se pone roja un momento */
  error: () => void;
  /** Secuencia final: corazón → texto → explosión. Llama a onDone al acabar. */
  play: (onDone: () => void) => void;
};

/** Corazón de partículas de la entrada. */
export const UnlockScene = forwardRef<UnlockHandle, { label: string }>(function UnlockScene({ label }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<UnlockHandle>({ pulse: () => undefined, error: () => undefined, play: (d) => d() });

  useImperativeHandle(ref, () => ({
    pulse: () => api.current.pulse(),
    error: () => api.current.error(),
    play: (d) => api.current.play(d),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);
    const group = new THREE.Group();
    scene.add(group);
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uT: { value: 0 },
        uExp: { value: 0 },
        uTime: { value: 0 },
        uBeat: { value: 0 },
        uErr: { value: 0 },
        uPx: { value: dpr * 2.2 },
        cA: { value: new THREE.Color("#f4a9c0") },
        cB: { value: new THREE.Color("#ffe8d8") },
        cG: { value: new THREE.Color("#ff4d86") },
      },
    });
    group.add(new THREE.Points(geo, mat));

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 700 ? 10.5 : 7;
      group.position.y = w < 700 ? 1.3 : 0.85;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    void (async () => {
      await document.fonts.ready.catch(() => undefined);
      const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() || "Georgia";
      const a = heart(N, 0.82, 31);
      const narrow = window.innerWidth < 700;
      const b = text(N, label, `${fam}, Georgia, serif`, narrow ? 3.9 : 5.2, 32);
      if (disposed) return;
      geo.setAttribute("pA", new THREE.BufferAttribute(a.pos, 3));
      geo.setAttribute("pB", new THREE.BufferAttribute(b.pos, 3));
      geo.setAttribute("gA", new THREE.BufferAttribute(a.glow, 1));
      geo.setAttribute("gB", new THREE.BufferAttribute(b.glow, 1));
      geo.setAttribute("position", new THREE.BufferAttribute(a.pos, 3));
      const rnd = new Float32Array(N);
      for (let i = 0; i < N; i++) rnd[i] = Math.random();
      geo.setAttribute("rnd", new THREE.BufferAttribute(rnd, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);
    })();

    let pulseAt = -10;
    let errAt = -10;
    let playAt = -1;
    let done: (() => void) | null = null;
    const clock = new THREE.Clock();

    api.current = {
      pulse: () => {
        pulseAt = clock.getElapsedTime();
      },
      error: () => {
        errAt = clock.getElapsedTime();
      },
      play: (d) => {
        playAt = clock.getElapsedTime();
        done = d;
      },
    };

    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      const t = clock.getElapsedTime();
      mat.uniforms.uTime.value = reduced ? 0 : t;
      const beat = Math.max(0, Math.sin(t * 5.2)) ** 6 + Math.max(0, Math.sin(t * 5.2 - 0.6)) ** 10 * 0.6;
      const kick = Math.max(0, 1 - (t - pulseAt) * 3.5);
      mat.uniforms.uBeat.value = reduced ? 0 : beat * 0.6 + kick * 1.6;
      mat.uniforms.uErr.value = Math.max(0, 1 - (t - errAt) * 1.6);
      if (playAt >= 0) {
        const s = t - playAt;
        // 0–1.5 s: corazón → «Hola, Rocío»; 1.5–2.7 quieto; 2.7–4 explosión
        mat.uniforms.uT.value = Math.min(1, s / 1.5);
        mat.uniforms.uExp.value = Math.max(0, Math.min(1, (s - 2.7) / 1.3));
        if (s > 3.9 && done) {
          const d = done;
          done = null;
          d();
        }
      }
      group.rotation.y = playAt >= 0 ? group.rotation.y * 0.9 : Math.sin(t * 0.4) * 0.35;
      renderer.render(scene, camera);
    }
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [label]);

  return <canvas ref={canvasRef} className="unlock-canvas" aria-hidden />;
});
