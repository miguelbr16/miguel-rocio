"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type Memory = { id: string; place: string; when: string; photo?: string };

const GAP = 5;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

/** Polaroid dibujada en un canvas: foto (o color) + pie escrito. */
async function polaroid(m: Memory, font: string): Promise<THREE.CanvasTexture> {
  const W = 600;
  const H = 720;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fffdf9";
  ctx.fillRect(0, 0, W, H);
  const pad = 34;
  const ph = W - pad * 2;
  const img = m.photo ? await loadImage(m.photo) : null;
  if (img) {
    const s = Math.max(ph / img.width, ph / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, pad, ph, ph);
    ctx.clip();
    ctx.drawImage(img, pad + (ph - w) / 2, pad + (ph - h) * 0.7, w, h);
    ctx.restore();
  } else {
    const g = ctx.createLinearGradient(pad, pad, pad + ph, pad + ph);
    g.addColorStop(0, "#f6c9d6");
    g.addColorStop(1, "#e8a4b8");
    ctx.fillStyle = g;
    ctx.fillRect(pad, pad, ph, ph);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(W / 2, pad + ph / 2, 150, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = `600 54px ${font}`;
    ctx.fillText(m.place.toUpperCase().slice(0, 14), W / 2, pad + ph / 2 + 18);
  }
  ctx.fillStyle = "#2a1a20";
  ctx.textAlign = "center";
  ctx.font = `italic 500 46px ${font}`;
  ctx.fillText(m.place, W / 2, H - 92);
  ctx.fillStyle = "#c96b88";
  ctx.font = `500 30px ${font}`;
  ctx.fillText(m.when, W / 2, H - 46);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Túnel de recuerdos: al hacer scroll la cámara avanza entre polaroids que
 * flotan en el aire, una por viaje, saliendo de la niebla.
 */
export function MemoryTunnel({ memories }: { memories: Memory[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const bg = new THREE.Color("#fbf1ea");
    renderer.setClearColor(bg);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(bg, 4, 15);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

    const cards: THREE.Mesh[] = [];
    const geom = new THREE.PlaneGeometry(1.9, 2.28);

    async function build() {
      await document.fonts.ready.catch(() => undefined);
      const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim() || "Georgia";
      for (let i = 0; i < memories.length; i++) {
        const tex = await polaroid(memories[i], `${fam}, Georgia, serif`);
        if (disposed) return;
        const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
        const mesh = new THREE.Mesh(geom, mat);
        const side = i % 2 === 0 ? -1 : 1;
        mesh.position.set(side * 1.25, (i % 3) * 0.25 - 0.25, -i * GAP);
        mesh.rotation.set(0.04 * side, -0.28 * side, 0.06 * side);
        mesh.userData = { side, base: mesh.position.clone() };
        scene.add(mesh);
        cards.push(mesh);
      }
    }
    void build();

    // pétalos
    const PET = 500;
    const petalGeo = new THREE.BufferGeometry();
    const pp = new Float32Array(PET * 3);
    for (let i = 0; i < PET; i++) {
      pp[i * 3] = (Math.random() - 0.5) * 10;
      pp[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pp[i * 3 + 2] = 4 - Math.random() * (memories.length * GAP + 6);
    }
    petalGeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    const petals = new THREE.Points(
      petalGeo,
      new THREE.PointsMaterial({ color: 0xe8a4b8, size: 0.06, transparent: true, opacity: 0.85 }),
    );
    scene.add(petals);

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 700 ? 66 : 50;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px" });
    io.observe(wrap);
    const clock = new THREE.Clock();
    let shown = -1;
    let z = 4.4;
    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const r = wrap!.getBoundingClientRect();
      const total = wrap!.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
      const target = 4.4 - p * ((memories.length - 1) * GAP + 0.2);
      z += (target - z) * (reduced ? 1 : 0.08);
      camera.position.set(Math.sin(t * 0.3) * 0.08, 0.05, z);
      camera.lookAt(0, 0, z - 6);
      for (const m of cards) {
        const { side, base } = m.userData as { side: number; base: THREE.Vector3 };
        // la foto que tienes delante se acerca al centro y se pone de frente
        const d = Math.abs(m.position.z - (z - 4.4));
        const focus = Math.max(0, 1 - d / GAP);
        m.position.x = base.x * (1 - focus * 0.75);
        m.position.y = base.y + Math.sin(t * 0.8 + base.z) * 0.05;
        m.rotation.y = -0.28 * side * (1 - focus);
        m.rotation.z = 0.06 * side * (1 - focus);
      }
      petals.rotation.z = t * 0.02;
      const idx = Math.max(0, Math.min(memories.length - 1, Math.round((4.4 - z) / GAP)));
      if (idx !== shown) {
        shown = idx;
        setCurrent(idx);
      }
      renderer.render(scene, camera);
    }
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      cards.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map?.dispose();
        mat.dispose();
      });
      geom.dispose();
      petalGeo.dispose();
      renderer.dispose();
    };
  }, [memories]);

  const m = memories[current];
  return (
    <section ref={wrapRef} className="mt" style={{ height: `${memories.length * 70 + 80}svh` }}>
      <div className="mt-stage">
        <canvas ref={canvasRef} className="mt-canvas" />
        <div className="mt-copy">
          <p className="mt-kicker">
            Recuerdo {current + 1} de {memories.length}
          </p>
          <h2 className="mt-title">Nuestros recuerdos</h2>
          <p className="sr-only">{m?.place}</p>
        </div>
      </div>
    </section>
  );
}
