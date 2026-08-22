"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { quizItems, type QuizItem } from "@/data/quiz";
import { pictWords } from "@/data/pictWords";

function QuizPanel() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = quizItems[idx];
  const quizTotal = quizItems.filter((x) => x.type === "quiz").length;

  const [feedback, setFeedback] = useState("");

  function answer(i: number) {
    if (answered || q.type !== "quiz") return;
    setAnswered(true);
    const correct = i === q.ans;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? q.ok : q.fail);
  }

  function next() {
    if (idx + 1 >= quizItems.length) {
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
    setAnswered(false);
    setFeedback("");
  }

  if (!started) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-text-mid">¿Cuánto sabes de nosotros?</p>
        <button type="button" className="btn-primary mt-4" onClick={() => setStarted(true)}>
          Empezar quiz
        </button>
      </div>
    );
  }

  if (finished) {
    const msgs =
      score === quizTotal
        ? "¡Perfecto! Me conoces mejor que yo mismo. 😮"
        : score >= quizTotal - 2
          ? "Casi todo bien. Impresionante. 😊"
          : "Todavía hay cosas que descubrir. Tenemos tiempo. 😄";
    return (
      <div className="py-8 text-center">
        <div className="font-serif text-5xl text-rose-deep">
          {score} / {quizTotal}
        </div>
        <p className="mt-4 text-sm text-text-mid">{msgs}</p>
        <button
          type="button"
          className="btn-ghost mt-6"
          onClick={() => {
            setStarted(false);
            setFinished(false);
            setIdx(0);
            setScore(0);
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  const progress = Math.round((idx / quizItems.length) * 100);

  return (
    <div>
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-rose-pale">
        <div className="h-full bg-rose-deep transition-all" style={{ width: `${progress}%` }} />
      </div>
      {q.type === "quiz" ? (
        <>
          <p className="mb-1 text-xs text-text-light">
            Pregunta {idx + 1} de {quizItems.length}
          </p>
          <p className="mb-4 font-serif text-xl">{q.q}</p>
          <div className="space-y-2">
            {q.opts.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => answer(i)}
                className={`quiz-opt w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  answered
                    ? i === q.ans
                      ? "border-green-500 bg-green-50"
                      : "border-border opacity-60"
                    : "border-border hover:border-rose-deep hover:bg-rose-pale"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {answered && feedback ? (
            <p className="mt-4 text-sm text-text-mid">{feedback}</p>
          ) : null}
        </>
      ) : (
        <>
          <span className="text-xs font-medium uppercase tracking-wider text-rose-deep">{q.tag}</span>
          <div className="my-4 text-4xl">{q.icon}</div>
          <p className="font-serif text-xl">{q.q}</p>
        </>
      )}
      {(answered || q.type !== "quiz") && (
        <button type="button" className="btn-primary mt-6 w-full" onClick={next}>
          Siguiente →
        </button>
      )}
    </div>
  );
}

function PictionaryPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [drawer, setDrawer] = useState<"Miguel" | "Rocío">("Miguel");
  const [scores, setScores] = useState({ Miguel: 0, Rocío: 0 });
  const [word, setWord] = useState(pictWords[0]);
  const [showWord, setShowWord] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const painting = useRef(false);
  const color = useRef("#2a1f25");
  const size = useRef(3);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    canvas.width = wrap?.clientWidth ?? 600;
    canvas.height = 280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (started) initCanvas();
  }, [started, initCanvas]);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function nextWord() {
    const pool = pictWords.map((_, i) => i).filter((i) => !used.includes(i));
    const indices = pool.length ? pool : pictWords.map((_, i) => i);
    const pick = indices[Math.floor(Math.random() * indices.length)] ?? 0;
    setUsed((u) => (pool.length ? [...u, pick] : [pick]));
    setWord(pictWords[pick] ?? pictWords[0]);
    setShowWord(false);
    clearCanvas();
    setDrawer((d) => (d === "Miguel" ? "Rocío" : "Miguel"));
  }

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = "touches" in e ? e.touches[0] : e;
    if (!touch) return { x: 0, y: 0 };
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  let lastX = 0;
  let lastY = 0;

  if (!started) {
    return (
      <div className="py-6 text-center">
        <p className="mb-4 text-sm text-text-mid">Dibuja y adivina — estilo inside jokes</p>
        <div className="mb-4 flex justify-center gap-2">
          {(["Miguel", "Rocío"] as const).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setDrawer(name)}
              className={`rounded-full px-4 py-2 text-sm ${drawer === name ? "bg-rose-deep text-white" : "border border-border"}`}
            >
              Empieza {name}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary" onClick={() => setStarted(true)}>
          ¡A dibujar!
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-center gap-6 text-center">
        <div>
          <div className="font-serif text-3xl text-rose-deep">{scores.Miguel}</div>
          <div className="text-xs text-text-light">Miguel</div>
        </div>
        <div>
          <div className="font-serif text-3xl text-rose-deep">{scores.Rocío}</div>
          <div className="text-xs text-text-light">Rocío</div>
        </div>
      </div>
      <p className="mb-3 rounded-xl bg-rose-pale py-2 text-center text-sm">
        Turno de {drawer} — dibuja la palabra
      </p>
      {showWord ? (
        <div className="mb-3 rounded-xl border border-border bg-white p-4 text-center">
          <div className="font-serif text-2xl">{word.word}</div>
          <div className="text-xs text-text-light">{word.hint}</div>
        </div>
      ) : (
        <button type="button" className="btn-ghost mb-3 w-full" onClick={() => setShowWord(true)}>
          Ver palabra 👀
        </button>
      )}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          height={280}
          onMouseDown={(e) => {
            painting.current = true;
            const p = getPos(e, e.currentTarget);
            lastX = p.x;
            lastY = p.y;
          }}
          onMouseMove={(e) => {
            if (!painting.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx || !canvasRef.current) return;
            const p = getPos(e, canvasRef.current);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = color.current;
            ctx.lineWidth = size.current;
            ctx.lineCap = "round";
            ctx.stroke();
            lastX = p.x;
            lastY = p.y;
          }}
          onMouseUp={() => {
            painting.current = false;
          }}
          onMouseLeave={() => {
            painting.current = false;
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            painting.current = true;
            const p = getPos(e, e.currentTarget);
            lastX = p.x;
            lastY = p.y;
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (!painting.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            if (!ctx || !canvasRef.current) return;
            const p = getPos(e, canvasRef.current);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = color.current;
            ctx.lineWidth = size.current;
            ctx.lineCap = "round";
            ctx.stroke();
            lastX = p.x;
            lastY = p.y;
          }}
          onTouchEnd={() => {
            painting.current = false;
          }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["#2a1f25", "#e8899a", "#7fb8e8", "#2fbf71"].map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 w-8 rounded-full border-2 border-white shadow"
            style={{ background: c }}
            onClick={() => {
              color.current = c;
            }}
          />
        ))}
        <button type="button" className="btn-ghost text-xs" onClick={clearCanvas}>
          Limpiar
        </button>
        <button type="button" className="btn-ghost text-xs" onClick={nextWord}>
          Saltar
        </button>
        <button
          type="button"
          className="btn-primary ml-auto text-xs"
          onClick={() => {
            setScores((s) => ({ ...s, [drawer]: s[drawer] + 1 }));
            nextWord();
          }}
        >
          ¡Acierto! +1
        </button>
      </div>
    </div>
  );
}

export function JuegosSection() {
  const [tab, setTab] = useState<"quiz" | "pict">("quiz");

  return (
    <section id="juegos" className="section-wrap">
      <SectionHeader label="Diversión" title="Juegos" />
      <div className="mb-4 flex gap-2">
        {(
          [
            ["quiz", "Quiz"],
            ["pict", "Pictionary"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2 text-sm ${tab === id ? "bg-rose-deep text-white" : "border border-border"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-white p-4">
        {tab === "quiz" ? <QuizPanel /> : <PictionaryPanel />}
      </div>
    </section>
  );
}
