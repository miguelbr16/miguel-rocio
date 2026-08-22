const COLORS = ["#e8899a", "#f2b8c6", "#7fb8e8", "#b8d8f2", "#ffd700", "#ff6b6b", "#51cf66"];

export function launchConfetti(count = 60) {
  if (typeof document === "undefined") return;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = "-20px";
      piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0];
      piece.style.width = `${8 + Math.random() * 8}px`;
      piece.style.height = piece.style.width;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }, i * 40);
  }
}
