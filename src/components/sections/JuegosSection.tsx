"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
        <div className="font-serif text-5xl text-gold">
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
                      ? "border-sky/50 bg-sky-pale text-sky"
                      : "border-white/10 opacity-50"
                    : "border-white/10 hover:border-rose/40 hover:bg-rose-pale"
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
          <span className="text-xs font-medium uppercase tracking-wider text-gold">{q.tag}</span>
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
  const color = useRef("#080608");
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
      <div className="py-6 text-center">
        <p className="mb-4 text-sm text-text-mid">Dibuja y adivina — estilo inside jokes</p>
        <div className="mb-4 flex justify-center gap-2">
          {[name1, name2].map((name) => (
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
          <div className="font-serif text-3xl text-gold">{scores[name1] ?? 0}</div>
          <div className="text-xs text-text-light">{name1}</div>
        </div>
        <div>
          <div className="font-serif text-3xl text-rose">{scores[name2] ?? 0}</div>
          <div className="text-xs text-text-light">{name2}</div>
        </div>
      </div>
      <p className="mb-3 rounded-xl bg-rose-pale py-2.5 text-center text-sm text-rose">
        Turno de {drawer} — dibuja la palabra
      </p>
      {showWord ? (
        <div className="glass-card mb-3 p-4 text-center">
          <div className="font-serif text-2xl">{word.word}</div>
          <div className="text-xs text-text-light">{word.hint}</div>
        </div>
      ) : (
        <button type="button" className="btn-ghost mb-3 w-full" onClick={() => setShowWord(true)}>
          Ver palabra 👀
        </button>
      )}
      <div className="glass-card overflow-hidden">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none bg-white/95"
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
      <div className="mt-3 flex flex-wrap gap-2">
        {PICT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className="h-8 w-8 rounded-full border-2 border-white/20 shadow-lg"
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
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
              tab === id
                ? "bg-gradient-to-r from-rose-deep to-rose text-white shadow-[0_0_20px_rgba(232,84,122,0.3)]"
                : "border border-white/10 text-text-mid hover:border-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="glass-card p-5">
        {tab === "quiz" ? <QuizPanel /> : <PictionaryPanel />}
      </div>
    </section>
  );
}
