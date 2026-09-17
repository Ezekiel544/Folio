"use client";

import { useEffect, useRef, useState } from "react";

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M13 4L7 10L13 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7 4L13 10L7 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Card data ── */
const cards = [
  {
    id: 1,
    title: "Proof of Purchase",
    body: "Every order produces a signed receipt that lands in the buyer's wallet — product, seller, date and payment reference sealed into one record.",
    illustration: <TokenizedIllustration />,
  },
  {
    id: 2,
    title: "Transferable Ownership",
    body: "Resell, gift or hand on a purchase. Each transfer is appended to a signed history, so the current owner is always provable.",
    illustration: <PaymentsIllustration />,
  },
  {
    id: 3,
    title: "Rights & Warranty",
    body: "Licenses, access periods, support windows and warranty terms travel with the receipt instead of being locked to the original checkout.",
    illustration: <CompliantFinanceIllustration />,
  },
  {
    id: 4,
    title: "Business API & SDK",
    body: "Issue receipts straight from your order flow with one API call. Drop-in server SDKs make portability a line of code, not a migration.",
    illustration: <InfrastructureIllustration />,
  },
  {
    id: 5,
    title: "Public Verification",
    body: "Each receipt has a verification page anyone can open. No account, no trust in the seller's database — just a signature that either checks out or doesn't.",
    illustration: <StablecoinsIllustration />,
  },
  {
    id: 6,
    title: "Optional Onchain Proof",
    body: "Anchor issue, transfer and revoke events to a public chain for permanent, independent proof, while keeping private details between the parties.",
    illustration: <AIAgentsIllustration />,
  },
];

const CARD_GAP = 20;

export default function RealFinanceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [maxIndex, setMaxIndex] = useState(3);

  /*
   * Calculate how many cards can be displayed
   * based on the current screen width.
   */
  useEffect(() => {
    const updateMaxIndex = () => {
      const track = trackRef.current;

      if (!track) return;

      const width = track.clientWidth;

      let cardsVisible = 3;

      if (width < 640) {
        cardsVisible = 1;
      } else if (width < 1024) {
        cardsVisible = 2;
      }

      setMaxIndex(Math.max(0, cards.length - cardsVisible));
    };

    updateMaxIndex();

    window.addEventListener("resize", updateMaxIndex);

    return () => {
      window.removeEventListener("resize", updateMaxIndex);
    };
  }, []);

  /*
   * Get the actual width of one card.
   * This is important because mobile cards
   * are no longer fixed at 370px.
   */
  const getCardWidth = () => {
    const track = trackRef.current;

    if (!track) return 370;

    const width = track.clientWidth;

    if (width < 640) {
      return width;
    }

    if (width < 1024) {
      return (width - CARD_GAP) / 2;
    }

    return (width - CARD_GAP * 2) / 3;
  };

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));

    setCurrent(clamped);

    if (trackRef.current) {
      const cardWidth = getCardWidth();

      trackRef.current.scrollTo({
        left: clamped * (cardWidth + CARD_GAP),
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      style={{
        background: "#1800CC",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        padding: "clamp(48px, 6vw, 72px) 0 clamp(56px, 7vw, 80px)",
        overflow: "hidden",
      }}
    >
      <div
        className="w-full mx-auto"
        style={{
          maxWidth: 1400,
          paddingLeft: "clamp(16px, 3.5vw, 48px)",
          paddingRight: "clamp(16px, 3.5vw, 48px)",
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-5 mb-7 sm:mb-10">
          <h2
            style={{
              fontSize: "clamp(25px, 3vw, 44px)",
              fontWeight: 500,
              color: "white",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Receipts for the whole lifecycle
          </h2>

          {/* Arrow buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => scrollTo(current - 1)}
              disabled={current === 0}
              aria-label="Previous cards"
              style={{
                width: "clamp(42px, 5vw, 52px)",
                height: "clamp(42px, 5vw, 52px)",
                borderRadius: 12,
                border: "none",
                background:
                  current === 0
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.22)",
                color: "white",
                cursor: current === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                opacity: current === 0 ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              <ArrowLeft />
            </button>

            <button
              onClick={() => scrollTo(current + 1)}
              disabled={current >= maxIndex}
              aria-label="Next cards"
              style={{
                width: "clamp(42px, 5vw, 52px)",
                height: "clamp(42px, 5vw, 52px)",
                borderRadius: 12,
                border: "none",
                background:
                  current >= maxIndex
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.22)",
                color: "white",
                cursor:
                  current >= maxIndex ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                opacity: current >= maxIndex ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="w-full"
          style={{
            display: "flex",
            gap: CARD_GAP,
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "x mandatory",
            cursor: "grab",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onScroll={() => {
            const track = trackRef.current;

            if (!track) return;

            const cardWidth = getCardWidth();

            if (cardWidth <= 0) return;

            const newIndex = Math.round(
              track.scrollLeft / (cardWidth + CARD_GAP)
            );

            setCurrent(Math.min(newIndex, maxIndex));
          }}
          onMouseDown={(e) => {
            const el = trackRef.current;

            if (!el) return;

            const startX = e.pageX - el.offsetLeft;
            const startScroll = el.scrollLeft;

            const onMove = (ev: MouseEvent) => {
              const x = ev.pageX - el.offsetLeft;

              el.scrollLeft = startScroll - (x - startX);
            };

            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };

            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                /*
                 * Mobile = 100%
                 * Tablet = 2 cards
                 * Desktop = 3 cards
                 */
                width:
                  "calc((100% - 40px) / 3)",
                minWidth:
                  "calc((100% - 40px) / 3)",
                borderRadius: 20,
                overflow: "hidden",
                background: "#f2f2f6",
                scrollSnapAlign: "start",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
              }}
              className="
                max-sm:!w-full
                max-sm:!min-w-full
                sm:max-lg:!w-[calc((100%-20px)/2)]
                sm:max-lg:!min-w-[calc((100%-20px)/2)]
              "
            >
              {/* Dark image area */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "370 / 200",
                  background: "#0a0a14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {card.illustration}
                </div>
              </div>

              {/* White text area */}
              <div
                style={{
                  padding: "clamp(22px, 3vw, 28px)",
                  paddingBottom: "clamp(28px, 4vw, 36px)",
                  flex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(20px, 2vw, 22px)",
                    fontWeight: 600,
                    color: "#0A0A0A",
                    marginBottom: 14,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontSize: "clamp(14px, 1.5vw, 15px)",
                    lineHeight: 1.65,
                    color: "#444",
                    fontFamily: "Inter, sans-serif",
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════
   ILLUSTRATIONS
══════════════════════════════════════════════ */

/* Card 1 */
function TokenizedIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#0d0d18" />

      <rect
        x="0"
        y="0"
        width="52"
        height="200"
        fill="#111122"
      />

      {[30, 70, 110, 150].map((y, i) => (
        <rect
          key={i}
          x="14"
          y={y}
          width="24"
          height="6"
          rx="2"
          fill="#2a2a44"
        />
      ))}

      <polyline
        points="60,120 90,95 120,105 155,78 185,88 215,60 250,72 280,55 310,68 340,45"
        fill="none"
        stroke="#22dd66"
        strokeWidth="2"
        style={{
          animation: "dashDraw 3s ease-in-out infinite",
        }}
      />

      <polygon
        points="60,120 90,95 120,105 155,78 185,88 215,60 250,72 280,55 310,68 340,45 340,170 60,170"
        fill="url(#greenGrad)"
        opacity="0.2"
      />

      {[60, 80, 65, 90, 70, 85, 75, 95, 80, 100, 72, 88].map(
        (h, i) => (
          <rect
            key={i}
            x={60 + i * 24}
            y={170 - h * 0.3}
            width="14"
            height={h * 0.3}
            rx="2"
            fill={i === 10 ? "#22dd66" : "#FFD060"}
            opacity="0.85"
            style={{
              animation: `barGrow 2s ease-out ${
                i * 0.06
              }s infinite`,
              transformOrigin: `${
                60 + i * 24 + 7
              }px 170px`,
            }}
          />
        )
      )}

      <circle
        cx="325"
        cy="148"
        r="28"
        stroke="#22dd66"
        strokeWidth="6"
        fill="none"
        strokeDasharray="100 76"
        strokeDashoffset="-10"
      />

      <circle
        cx="325"
        cy="148"
        r="28"
        stroke="#2222aa"
        strokeWidth="6"
        fill="none"
        strokeDasharray="76 100"
        strokeDashoffset="90"
      />

      <defs>
        <linearGradient
          id="greenGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#22dd66" />
          <stop
            offset="100%"
            stopColor="#22dd66"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes dashDraw {
          0%,100% {
            stroke-dashoffset: 400;
            stroke-dasharray: 400;
          }
          50% {
            stroke-dashoffset: 0;
            stroke-dasharray: 400;
          }
        }

        @keyframes barGrow {
          0%,100% {
            transform: scaleY(0.7);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </svg>
  );
}

/* Card 2 */
function PaymentsIllustration() {
  const coins = [
    {
      cx: 90,
      cy: 130,
      rx: 38,
      ry: 14,
      fill: "#4488FF",
      tilt: -20,
      delay: "0s",
    },
    {
      cx: 155,
      cy: 100,
      rx: 40,
      ry: 15,
      fill: "#CC44BB",
      tilt: -18,
      delay: "0.2s",
    },
    {
      cx: 220,
      cy: 80,
      rx: 38,
      ry: 14,
      fill: "#9966FF",
      tilt: -20,
      delay: "0.4s",
    },
    {
      cx: 260,
      cy: 115,
      rx: 36,
      ry: 13,
      fill: "#CC44BB",
      tilt: -22,
      delay: "0.6s",
    },
    {
      cx: 180,
      cy: 148,
      rx: 34,
      ry: 12,
      fill: "#6655FF",
      tilt: -18,
      delay: "0.8s",
    },
    {
      cx: 120,
      cy: 72,
      rx: 32,
      ry: 11,
      fill: "#88AAFF",
      tilt: -20,
      delay: "1.0s",
    },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#050510" />

      <style>{`
        @keyframes coinFloat {
          0%,100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }
      `}</style>

      {coins.map((c, i) => (
        <g
          key={i}
          style={{
            animation: `coinFloat 3s ease-in-out ${c.delay} infinite`,
            transformOrigin: `${c.cx}px ${c.cy}px`,
          }}
        >
          <ellipse
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry * 2.4}
            fill={c.fill}
            opacity="0.9"
            transform={`rotate(${c.tilt} ${c.cx} ${c.cy})`}
          />

          <ellipse
            cx={c.cx - 8}
            cy={c.cy - 8}
            rx={c.rx * 0.4}
            ry={c.ry * 0.9}
            fill="white"
            opacity="0.18"
            transform={`rotate(${c.tilt} ${c.cx} ${c.cy})`}
          />
        </g>
      ))}
    </svg>
  );
}

/* Card 3 */
function CompliantFinanceIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#1800CC" />

      <style>{`
        @keyframes waveAnim {
          0%,100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.6);
          }
        }
      `}</style>

      {Array.from({ length: 55 }, (_, i) => {
        const x = 10 + i * 6.4;
        const centre = 27;
        const dist = Math.abs(i - centre);
        const baseH = Math.max(
          20,
          160 - dist * 4.5
        );

        return (
          <rect
            key={i}
            x={x}
            y={(200 - baseH) / 2}
            width="3"
            height={baseH}
            rx="1.5"
            fill="white"
            opacity={
              0.55 + (1 - dist / centre) * 0.45
            }
            style={{
              animation: `waveAnim ${
                1.4 + (dist % 5) * 0.2
              }s ease-in-out ${i * 0.03}s infinite`,
              transformOrigin: `${x + 1.5}px 100px`,
            }}
          />
        );
      })}
    </svg>
  );
}

/* Card 4 */
function InfrastructureIllustration() {
  const shards = [
    {
      x: 80,
      w: 40,
      h: 170,
      color1: "#1133CC",
      color2: "#FF9900",
      id: "sh1",
    },
    {
      x: 140,
      w: 36,
      h: 155,
      color1: "#2244EE",
      color2: "#FFCC00",
      id: "sh2",
    },
    {
      x: 195,
      w: 38,
      h: 165,
      color1: "#0022AA",
      color2: "#FF8800",
      id: "sh3",
    },
    {
      x: 248,
      w: 34,
      h: 150,
      color1: "#1133DD",
      color2: "#FFAA00",
      id: "sh4",
    },
    {
      x: 298,
      w: 36,
      h: 158,
      color1: "#2244EE",
      color2: "#FF9900",
      id: "sh5",
    },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#050510" />

      {shards.map((s, i) => (
        <g
          key={i}
          style={{
            animation: `shardFloat 4s ease-in-out ${
              i * 0.15
            }s infinite`,
            transformOrigin: `${
              s.x + s.w / 2
            }px 100px`,
          }}
        >
          <defs>
            <linearGradient
              id={s.id}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor={s.color1}
              />
              <stop
                offset="50%"
                stopColor={s.color2}
              />
              <stop
                offset="100%"
                stopColor={s.color1}
              />
            </linearGradient>
          </defs>

          <rect
            x={s.x}
            y={(200 - s.h) / 2}
            width={s.w}
            height={s.h}
            rx="3"
            fill={`url(#${s.id})`}
          />

          <rect
            x={s.x + 4}
            y={(200 - s.h) / 2 + 10}
            width="8"
            height={s.h * 0.6}
            rx="2"
            fill="white"
            opacity="0.12"
          />
        </g>
      ))}

      <style>{`
        @keyframes shardFloat {
          0%,100% {
            transform: scaleY(1) translateY(0);
          }
          50% {
            transform: scaleY(1.04) translateY(-4px);
          }
        }
      `}</style>
    </svg>
  );
}

/* Card 5 */
function StablecoinsIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#050510" />

      <defs>
        <radialGradient
          id="blob1"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#AA44FF" />
          <stop offset="100%" stopColor="#6600CC" />
        </radialGradient>

        <radialGradient
          id="blob2"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#44FF88" />
          <stop offset="100%" stopColor="#00AA44" />
        </radialGradient>

        <radialGradient
          id="blob3"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#AA44FF" />
          <stop offset="100%" stopColor="#440088" />
        </radialGradient>
      </defs>

      <style>{`
        @keyframes blobFloat {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>

      <ellipse
        cx="100"
        cy="100"
        rx="44"
        ry="52"
        fill="url(#blob1)"
        style={{
          animation:
            "blobFloat 3s ease-in-out 0s infinite",
          transformOrigin: "100px 100px",
        }}
      />

      <ellipse
        cx="185"
        cy="100"
        rx="58"
        ry="62"
        fill="url(#blob2)"
        style={{
          animation:
            "blobFloat 3s ease-in-out 0.5s infinite",
          transformOrigin: "185px 100px",
        }}
      />

      <ellipse
        cx="278"
        cy="100"
        rx="46"
        ry="54"
        fill="url(#blob3)"
        style={{
          animation:
            "blobFloat 3s ease-in-out 1s infinite",
          transformOrigin: "278px 100px",
        }}
      />

      <ellipse
        cx="100"
        cy="85"
        rx="20"
        ry="16"
        fill="white"
        opacity="0.1"
      />

      <ellipse
        cx="185"
        cy="80"
        rx="24"
        ry="18"
        fill="white"
        opacity="0.1"
      />

      <ellipse
        cx="278"
        cy="85"
        rx="20"
        ry="16"
        fill="white"
        opacity="0.1"
      />
    </svg>
  );
}

/* Card 6 */
function AIAgentsIllustration() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 370 200"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="370" height="200" fill="#050510" />

      <style>{`
        @keyframes arcSpin {
          0% {
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {[40, 60, 80, 100].map((r, i) => (
        <circle
          key={i}
          cx="185"
          cy="100"
          r={r}
          fill="none"
          stroke="#4455FF"
          strokeWidth="1.2"
          strokeDasharray={`${r * 4} 50`}
          opacity={0.3 + i * 0.15}
          style={{
            animation: `arcSpin ${
              6 + i
            }s linear infinite`,
            transformOrigin: "185px 100px",
          }}
        />
      ))}

      {[0, 120, 240].map((startAngle, i) => {
        const rad =
          (startAngle * Math.PI) / 180;
        const r = 70;

        return (
          <circle
            key={i}
            cx={185 + Math.cos(rad) * r}
            cy={100 + Math.sin(rad) * r}
            r="5"
            fill={
              ["#4488FF", "#22CCFF", "#AA44FF"][i]
            }
          />
        );
      })}

      <circle
        cx="185"
        cy="100"
        r="12"
        fill="#2200FF"
      />

      <circle
        cx="185"
        cy="100"
        r="6"
        fill="white"
        opacity="0.8"
      />
    </svg>
  );
}