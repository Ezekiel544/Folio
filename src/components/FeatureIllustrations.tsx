"use client";

/* ── Card 1: Modular network — spokes radiating from center blue square ── */
export function ModularNetworkIllustration() {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);

  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      className="card-illustration"
    >
      <style>{`
        .spoke-node {
          animation: spokeFloat 3s ease-in-out infinite;
        }
        .spoke-line {
          animation: spokeFade 3s ease-in-out infinite;
        }
        @keyframes spokeFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(0,-2px) scale(1.08); }
        }
        @keyframes spokeFade {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* Spokes */}
      {spokes.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 110 + Math.cos(rad) * 80;
        const y2 = 110 + Math.sin(rad) * 80;
        return (
          <line
            key={i}
            className="spoke-line"
            x1="110"
            y1="110"
            x2={x2}
            y2={y2}
            stroke="#aaa"
            strokeWidth="1"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        );
      })}

      {/* End nodes */}
      {spokes.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 110 + Math.cos(rad) * 80;
        const y = 110 + Math.sin(rad) * 80;
        return (
          <rect
            key={i}
            className="spoke-node"
            x={x - 6}
            y={y - 6}
            width="12"
            height="12"
            rx="1"
            fill="#c8c8d0"
            style={{ animationDelay: `${i * 0.08}s`, transformOrigin: `${x}px ${y}px` }}
          />
        );
      })}

      {/* Center square */}
      <rect
        x="98"
        y="98"
        width="24"
        height="24"
        rx="2"
        fill="#2200FF"
        style={{
          animation: "centerPulse 3s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes centerPulse {
          0%,100% { transform-origin: 110px 110px; transform: scale(1); opacity:1; }
          50%      { transform-origin: 110px 110px; transform: scale(1.12); opacity:0.9; }
        }
      `}</style>
    </svg>
  );
}

/* ── Card 2: Compliant — floating squares / ZK grid ── */
export function CompliantIllustration() {
  return (
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
      <style>{`
        .dot-float {
          animation: dotDrift 4s ease-in-out infinite;
        }
        .bar-form {
          animation: barForm 4s ease-in-out infinite;
        }
        @keyframes dotDrift {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes barForm {
          0%   { width: 0; opacity:0; }
          20%  { width: 160px; opacity:1; }
          80%  { width: 160px; opacity:1; }
          100% { width: 0; opacity:0; }
        }
      `}</style>

      {/* Floating small dots */}
      {[
        { cx: 60,  cy: 50,  d: "0s",   s: 6 },
        { cx: 110, cy: 40,  d: "0.3s", s: 5 },
        { cx: 155, cy: 55,  d: "0.6s", s: 5 },
        { cx: 40,  cy: 140, d: "0.9s", s: 5 },
      ].map((dot, i) => (
        <rect
          key={i}
          className="dot-float"
          x={dot.cx - dot.s / 2}
          y={dot.cy - dot.s / 2}
          width={dot.s}
          height={dot.s}
          fill="#111"
          style={{ animationDelay: dot.d }}
        />
      ))}

      {/* Main blue bar */}
      <g style={{ overflow: "hidden" }}>
        <rect
          x="30"
          y="90"
          width="160"
          height="54"
          rx="4"
          fill="#2200FF"
          style={{
            transformOrigin: "30px 90px",
            animation: "barScale 4s ease-in-out infinite",
          }}
        />
        {/* Two white dots on bar */}
        <rect x="50"  y="112" width="10" height="10" rx="1" fill="white" opacity="0.9" />
        <rect x="80"  y="112" width="10" height="10" rx="1" fill="white" opacity="0.9" />
      </g>

      <style>{`
        @keyframes barScale {
          0%   { transform: scaleX(0.05); opacity:0; }
          25%  { transform: scaleX(1); opacity:1; }
          75%  { transform: scaleX(1); opacity:1; }
          100% { transform: scaleX(0.05); opacity:0; }
        }
      `}</style>
    </svg>
  );
}

/* ── Card 3: Inclusive — nested diamond shapes with $ in center ── */
export function InclusiveIllustration() {
  const diamonds = [90, 70, 50, 30];

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
      <style>{`
        .diamond-ring {
          animation: diamondExpand 4s ease-in-out infinite;
        }
        @keyframes diamondExpand {
          0%   { transform-origin: 110px 110px; transform: scale(0.4); opacity:0; }
          30%  { transform-origin: 110px 110px; transform: scale(1);   opacity:1; }
          70%  { transform-origin: 110px 110px; transform: scale(1);   opacity:1; }
          100% { transform-origin: 110px 110px; transform: scale(0.4); opacity:0; }
        }
      `}</style>

      {/* Nested diamonds */}
      {diamonds.map((r, i) => (
        <rect
          key={i}
          className="diamond-ring"
          x={110 - r}
          y={110 - r}
          width={r * 2}
          height={r * 2}
          rx="2"
          fill="none"
          stroke="#111"
          strokeWidth="1.2"
          transform="rotate(45 110 110)"
          style={{
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      {/* Center circle with $ */}
      <circle
        cx="110"
        cy="110"
        r="20"
        fill="#2200FF"
        style={{
          animation: "centerBeat 4s ease-in-out infinite",
          transformOrigin: "110px 110px",
        }}
      />
      <text
        x="110"
        y="116"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="white"
        fontFamily="Arial"
      >
        $
      </text>

      <style>{`
        @keyframes centerBeat {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.1); }
        }
      `}</style>
    </svg>
  );
}

/* ── Card 4: Borderless city — blue grid of squares ── */
export function BorderlessIllustration() {
  const cols = 5;
  const rows = 5;
  const cellSize = 28;
  const gap = 4;

  return (
    <svg
      width="220"
      height="190"
      viewBox="0 0 220 190"
      fill="none"
    >
      <style>{`
        .grid-cell {
          animation: cellAppear 5s ease-in-out infinite;
        }
        @keyframes cellAppear {
          0%   { opacity: 0; transform: scale(0.4); }
          20%  { opacity: 1; transform: scale(1); }
          80%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.4); }
        }
      `}</style>

      {/* 5×5 blue grid */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const x = 20 + c * (cellSize + gap);
          const y = 20 + r * (cellSize + gap);
          const delay = (r * cols + c) * 0.05;
          return (
            <rect
              key={`${r}-${c}`}
              className="grid-cell"
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx="2"
              fill="#2200FF"
              style={{ animationDelay: `${delay}s`, transformOrigin: `${x + cellSize / 2}px ${y + cellSize / 2}px` }}
            />
          );
        })
      )}

      {/* White dash accent on center */}
      <rect x="80" y="92" width="28" height="4" rx="2" fill="white" opacity="0.9" />
    </svg>
  );
}
