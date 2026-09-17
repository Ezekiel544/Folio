"use client";
import { useEffect, useRef } from "react";

/**
 * Reproduces the animated isometric stacked-card graphic seen in the Folio hero.
 * Two animation states cycle:
 *   State A – stacked cards fanned diagonally (like a deck of cards in perspective)
 *   State B – flat parallelogram / rhombus shapes side by side
 */
export default function Cards3D() {
  const sceneRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex-1 flex items-center justify-end"
      style={{ minHeight: 420, perspective: "1200px" }}
    >
      {/* ── Scene wrapper — rotates between the two states ── */}
      <div
        ref={sceneRef}
        className="relative"
        style={{
          width: 480,
          height: 360,
          transformStyle: "preserve-3d",
          animation: "sceneMorph 8s ease-in-out infinite",
        }}
      >
        {/* The 4 stacked cards (State A) */}
        <StackedCards />
        {/* The parallelogram slabs (State B — fades in on alternate cycle) */}
        <ParallelogramSlabs />
      </div>

      <style jsx>{`
        @keyframes sceneMorph {
          0%   { transform: perspective(1200px) rotateX(16deg) rotateY(-32deg) rotateZ(3deg); }
          40%  { transform: perspective(1200px) rotateX(16deg) rotateY(-32deg) rotateZ(3deg); }
          50%  { transform: perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(1deg); }
          90%  { transform: perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(1deg); }
          100% { transform: perspective(1200px) rotateX(16deg) rotateY(-32deg) rotateZ(3deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Stacked card fan (State A) ── */
function StackedCards() {
  const cards = [
    {
      label: "EVM Compatible",
      sublabel: "",
      bg: "#ffffff",
      textColor: "#111",
      w: 160,
      h: 140,
      x: 0,
      y: 80,
      z: 0,
      opacity: 1,
      dot: false,
    },
    {
      label: "ZK-KYC",
      sublabel: "",
      bg: "#c0c0e8",
      textColor: "#222",
      w: 130,
      h: 110,
      x: 80,
      y: 40,
      z: 40,
      opacity: 1,
      dot: true,
    },
    {
      label: "30,000+ TPS",
      sublabel: "",
      bg: "#9898d8",
      textColor: "#111",
      w: 140,
      h: 100,
      x: 145,
      y: 10,
      z: 80,
      opacity: 1,
      dot: true,
    },
    {
      label: "Secure",
      sublabel: "",
      bg: "#2200FF",
      textColor: "#fff",
      w: 130,
      h: 130,
      x: 200,
      y: -30,
      z: 120,
      opacity: 1,
      dot: false,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        animation: "stackedFade 8s ease-in-out infinite",
      }}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.w,
            height: c.h,
            background: c.bg,
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,50,0.18)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "10px 12px",
            transform: `translateZ(${c.z}px)`,
            animation: `cardEntrance 8s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          }}
        >
          {c.dot && (
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 6,
                height: 6,
                background: "#2200FF",
                borderRadius: "50%",
              }}
            />
          )}
          {/* Grip dots for middle cards */}
          {i === 2 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 3,
                transform: "translateY(-50%)",
              }}
            >
              {[...Array(4)].map((_, d) => (
                <div key={d} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,0,60,0.25)" }} />
              ))}
            </div>
          )}
          <span
            style={{
              fontSize: c.label.length > 8 ? 11 : 13,
              fontWeight: 600,
              color: c.textColor,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.3,
            }}
          >
            {c.label}
          </span>
        </div>
      ))}

      <style jsx>{`
        @keyframes stackedFade {
          0%   { opacity: 1; }
          40%  { opacity: 1; }
          50%  { opacity: 0; }
          90%  { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes cardEntrance {
          0%, 100% { transform: translateZ(var(--z, 0px)) translateY(0px); }
          50%       { transform: translateZ(var(--z, 0px)) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

/* ── Flat parallelogram slabs (State B) ── */
function ParallelogramSlabs() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingLeft: 10,
        animation: "slabFade 8s ease-in-out infinite",
      }}
    >
      {/* Slab 1 — lavender */}
      <Slab color="#b0b0e0" width={170} height={280} skew={-12} />
      {/* Slab 2 — medium purple */}
      <Slab color="#8080cc" width={155} height={280} skew={-12} label="EC" dotGrid />
      {/* Slab 3 — royal blue */}
      <Slab color="#2200FF" width={165} height={280} skew={-12} />

      <style jsx>{`
        @keyframes slabFade {
          0%   { opacity: 0; }
          40%  { opacity: 0; }
          50%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Slab({
  color,
  width,
  height,
  skew,
  label,
  dotGrid,
}: {
  color: string;
  width: number;
  height: number;
  skew: number;
  label?: string;
  dotGrid?: boolean;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: color,
        borderRadius: 8,
        transform: `skewX(${skew}deg)`,
        flexShrink: 0,
        position: "relative",
        boxShadow: "0 12px 40px rgba(0,0,60,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label && (
        <span
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.04em",
            fontFamily: "'Inter', sans-serif",
            transform: `skewX(${-skew}deg)`,
          }}
        >
          {label}
        </span>
      )}
      {dotGrid && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            transform: `skewX(${-skew}deg)`,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
      )}
    </div>
  );
}
