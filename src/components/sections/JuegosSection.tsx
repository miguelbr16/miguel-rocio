"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { quizItems } from "@/data/quiz";
import { pictWords } from "@/data/pictWords";
import { PICT_COLORS } from "@/lib/constants";
import { useSiteConfig } from "@/context/SiteConfigContext";

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
      <div className="py-10 text-center">
        <p className="text-sm text-text-mid">¿Cuánto sabes de nosotros?</p>
        <Button className="mt-5" onClick={() => setStarted(true)}>
          Empezar quiz
        </Button>
      </div>
    );
  }

  if (finished) {
    const msgs =
      score === quizTotal
        ? "¡Perfecto! Me conoces mejor que yo mismo."
        : score >= quizTotal - 2
          ? "Casi todo bien. Impresionante."
          : "Todavía hay cosas que descubrir. Tenemos tiempo.";
    return (
      <div className="py-10 text-center">
        <div className="font-serif text-5xl text-rose-deep">
          {score} / {quizTotal}
        </div>
        <p className="mt-4 text-sm text-text-mid">{msgs}</p>
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => {
            setStarted(false);
            setFinished(false);
            setIdx(0);
            setScore(0);
          }}
        >
          Volver
        </Button>
      </div>
    );
  }

  const progress = Math.round((idx / quizItems.length) * 100);

  return (
    <div>
      <div className="progress-bar mb-5">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      {q.type === "quiz" ? (
        <>
          <p className="mb-1 text-xs font-medium text-text-light">
            Pregunta {idx + 1} de {quizItems.length}
          </p>
          <p className="mb-5 font-serif text-xl">{q.q}</p>
          <div className="space-y-2">
            {q.opts.map((opt, i) => (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => answer(i)}
                className={`quiz-opt w-full px-4 py-3.5 text-left text-sm ${
                  answered
                    ? i === q.ans
                      ? "quiz-opt-correct"
                      : "quiz-opt-wrong"
                    : ""
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
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">{q.tag}</span>
          <div className="my-5 text-4xl">{q.icon}</div>
          <p className="font-serif text-xl">{q.q}</p>
        </>
      )}
      {(answered || q.type !== "quiz") && (
        <Button fullWidth className="mt-6" onClick={next}>
          Siguiente →
        </Button>
      )}
    </div>
  );
}

function PictionaryPanel() {
  const { config } = useSiteConfig();
  const name1 = config.couple.name1;
  const name2 = config.couple.name2;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [drawer, setDrawer] = useState(name1);
  const [scores, setScores] = useState<Record<string, number>>({
    [name1]: 0,
    [name2]: 0,
  });
  const [word, setWord] = useState(pictWords[0]);
  const [showWord, setShowWord] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const painting = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const color = useRef("#1a1216");
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
    setDrawer((current) => (current === name1 ? name2 : name1));
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

  function startStroke(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    painting.current = true;
    lastPoint.current = getPos(e, canvas);
  }

  function moveStroke(e: React.MouseEvent | React.TouchEvent) {
    if (!painting.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const point = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = color.current;
    ctx.lineWidth = size.current;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPoint.current = point;
  }

  function endStroke() {
    painting.current = false;
  }

  if (!started) {
    return (
      <div className="py-8 text-center">
        <p className="mb-5 text-sm text-text-mid">Dibuja y adivina — estilo inside jokes</p>
        <div className="mb-5 flex justify-center gap-2">
          {[name1, name2].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setDrawer(name)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                drawer === name
                  ? "bg-rose-deep text-white shadow-md"
                  : "border border-border bg-white text-text-mid"
              }`}
            >
              Empieza {name}
            </button>
          ))}
        </div>
        <Button onClick={() => setStarted(true)}>¡A dibujar!</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-center gap-8 text-center">
        <div>
          <div className="font-serif text-3xl text-gold">{scores[name1] ?? 0}</div>
          <div className="text-xs font-medium text-text-light">{name1}</div>
        </div>
        <div>
          <div className="font-serif text-3xl text-rose-deep">{scores[name2] ?? 0}</div>
          <div className="text-xs font-medium text-text-light">{name2}</div>
        </div>
      </div>
      <p className="mb-4 rounded-full bg-rose-muted py-2.5 text-center text-sm font-medium text-rose-deep">
        Turno de {drawer} — dibuja la palabra
      </p>
      {showWord ? (
        <Card variant="soft" padding="md" className="mb-4 text-center">
          <div className="font-serif text-2xl">{word.word}</div>
          <div className="text-xs text-text-light">{word.hint}</div>
        </Card>
      ) : (
        <Button variant="ghost" fullWidth className="mb-4" onClick={() => setShowWord(true)}>
          Ver palabra
        </Button>
      )}
      <div className="pict-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none bg-white"
          height={280}
          onMouseDown={(e) => startStroke(e, e.currentTarget)}
          onMouseMove={moveStroke}
          onMouseUp={endStroke}
          onMouseLeave={endStroke}
          onTouchStart={(e) => {
            e.preventDefault();
            startStroke(e, e.currentTarget);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            moveStroke(e);
          }}
          onTouchEnd={endStroke}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PICT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className="color-swatch"
            style={{ background: c }}
            onClick={() => {
              color.current = c;
            }}
            aria-label={`Color ${c}`}
          />
        ))}
        <Button variant="ghost" size="sm" onClick={clearCanvas}>
          Limpiar
        </Button>
        <Button variant="ghost" size="sm" onClick={nextWord}>
          Saltar
        </Button>
        <Button
          size="sm"
          className="ml-auto"
          onClick={() => {
            setScores((s) => ({ ...s, [drawer]: s[drawer] + 1 }));
            nextWord();
          }}
        >
          ¡Acierto! +1
        </Button>
      </div>
    </div>
  );
}

export function JuegosSection() {
  const [tab, setTab] = useState<"quiz" | "pict">("quiz");

  return (
    <section id="juegos" className="section-wrap">
      <SectionHeader label="Diversión" title="Juegos" description="Para pasarlo bien juntos." />

      <div className="game-tabs mb-5">
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
            className={`game-tab ${tab === id ? "game-tab-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <Card variant="elevated" padding="lg">
        {tab === "quiz" ? <QuizPanel /> : <PictionaryPanel />}
      </Card>
    </section>
  );
}
