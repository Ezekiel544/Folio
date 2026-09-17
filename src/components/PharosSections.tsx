"use client";

import React from "react";

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M3 11L11 3M11 3H5M11 3v6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Proof & Momentum data ── */
const proofStats = [
  {
    value: "100%",
    label:
      "Receipts are sealed with a tamper-evident signature — change a single field and verification fails.",
    isLarge: true,
  },
  {
    value: "1 link",
    label: "A public verification page for every receipt",
    isLarge: false,
  },
  {
    value: "Optional",
    label: "Onchain anchoring for permanent public proof",
    isLarge: false,
  },
  {
    value: "< 50ms",
    label: "Typical time to issue a receipt",
    isLarge: false,
  },
  {
    value: "You own it",
    label:
      "Receipts live in the buyer's wallet, not only in the seller's database",
    isLarge: false,
    isText: true,
  },
];

/* ── What's New categories ── */
const newsCategories = [
  {
    title: "How receipts work",
    image: <BlogVisual />,
  },
  {
    title: "For businesses",
    image: <NewsVisual />,
  },
  {
    title: "For developers",
    image: <EcoVisual />,
  },
];

export default function PharosSections() {
  return (
    <>
      {/* ══ SECTION: PROOF & MOMENTUM ══ */}
      <section
        style={{
          background: "#1200CC",
          padding: "clamp(52px, 7vw, 72px) 0 clamp(60px, 8vw, 80px)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 40px)",
            boxSizing: "border-box",
          }}
        >
          {/* Heading */}
          <h2
            style={{
              fontSize: "clamp(28px, 6vw, 42px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              color: "#ffffff",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.1,
              margin: "0 0 clamp(32px, 5vw, 48px)",
            }}
          >
            Proof &amp; Momentum
          </h2>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 0,
              alignItems: "start",
            }}
            className="proof-stats"
          >
            {proofStats.map((s, i) => (
              <div
                key={i}
                className="proof-stat"
                style={{
                  minWidth: 0,
                  paddingRight:
                    i < proofStats.length - 1 ? 32 : 0,
                  paddingLeft: i > 0 ? 32 : 0,
                  borderRight:
                    i < proofStats.length - 1
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: s.isText
                      ? "clamp(24px, 2.8vw, 40px)"
                      : "clamp(30px, 3.5vw, 52px)",
                    fontWeight: s.isText ? 500 : 400,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.05,
                    marginBottom: 12,
                    color: "#ffffff",
                    letterSpacing: s.isText
                      ? "-0.01em"
                      : "-0.02em",
                    wordBreak: "break-word",
                  }}
                >
                  {s.value}
                </div>

                <p
                  style={{
                    fontSize: "clamp(12px, 1.3vw, 13px)",
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.72)",
                    fontFamily: "Inter, sans-serif",
                    margin: 0,
                    maxWidth: s.isLarge ? 360 : 200,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION: WHAT'S NEW ══ */}
      <section
        style={{
          background: "#ffffff",
          padding: "clamp(60px, 8vw, 80px) 0 clamp(70px, 9vw, 100px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 clamp(16px, 4vw, 40px)",
            boxSizing: "border-box",
          }}
        >
          {/* Heading */}
          <h2
            style={{
              fontSize: "clamp(26px, 6vw, 42px)",
              fontWeight: 400,
              color: "#0A0A0A",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              margin: "0 0 clamp(30px, 5vw, 48px)",
            }}
          >
            What&apos;s new at Folio?
          </h2>

          {/* 3-column card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
            className="news-grid"
          >
            {newsCategories.map((c, i) => (
              <NewsCard
                key={i}
                item={c}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 1000px) {
          .proof-stats {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            ) !important;
            row-gap: 36px;
          }

          .proof-stat {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .proof-stat:nth-child(4) {
            padding-left: 0 !important;
            border-right: 1px solid
              rgba(255, 255, 255, 0.15) !important;
          }

          .proof-stat:nth-child(3) {
            border-right: none !important;
          }
        }

        @media (max-width: 700px) {
          .proof-stats {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            ) !important;
            gap: 0 !important;
          }

          .proof-stat {
            padding: 0 18px 32px 18px !important;
            border-right: 1px solid
              rgba(255, 255, 255, 0.15) !important;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.15) !important;
          }

          .proof-stat:nth-child(odd) {
            padding-left: 0 !important;
          }

          .proof-stat:nth-child(even) {
            padding-right: 0 !important;
          }

          .proof-stat:nth-child(4),
          .proof-stat:nth-child(5) {
            padding-top: 32px !important;
          }

          .proof-stat:nth-child(2),
          .proof-stat:nth-child(4) {
            border-right: none !important;
          }

          .proof-stat:nth-child(4),
          .proof-stat:nth-child(5) {
            border-bottom: none !important;
          }

          .news-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .proof-stats {
            grid-template-columns: 1fr !important;
          }

          .proof-stat,
          .proof-stat:nth-child(odd),
          .proof-stat:nth-child(even) {
            padding: 0 0 28px 0 !important;
            border-right: none !important;
            border-bottom: 1px solid
              rgba(255, 255, 255, 0.15) !important;
          }

          .proof-stat:not(:first-child) {
            padding-top: 28px !important;
          }

          .proof-stat:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
        }

        /* Respect users who prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .news-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* ── News Card ── */
function NewsCard({
  item,
  index,
}: {
  item: {
    title: string;
    image: React.ReactNode;
  };
  index: number;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset the animation after leaving
          // the viewport so it can play again.
          setIsVisible(false);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href="#"
      className="news-card"
      style={{
        display: "block",
        width: "100%",
        minWidth: 0,
        border: "1px solid #e0e0e8",
        borderRadius: 16,
        overflow: "hidden",
        textDecoration: "none",
        background: "#f5f5f8",

        /* ── Entrance animation ── */
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateX(0)"
          : "translateX(-70px)",

        transition:
          "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",

        /* Card 1 → 0s
           Card 2 → 0.22s
           Card 3 → 0.44s */
        transitionDelay: `${index * 0.22}s`,
      }}
    >
      {/* Image / visual area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "300 / 220",
          minHeight: 180,
          maxHeight: 260,
          background: "#0A0A14",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.image}
      </div>

      {/* Label */}
      <div
        style={{
          padding:
            "clamp(18px, 3vw, 20px) clamp(18px, 3vw, 24px) clamp(20px, 3vw, 22px)",
          fontSize: "clamp(16px, 2.5vw, 22px)",
          fontWeight: 400,
          lineHeight: 1.3,
          color: "#0A0A0A",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
        }}
      >
        {item.title}
      </div>
    </a>
  );
}

/* ════════════════════
   CARD VISUALS
════════════════════ */

/* Blog & Research */
function BlogVisual() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 220"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient
          id="blogSphere"
          cx="50%"
          cy="40%"
          r="55%"
        >
          <stop offset="0%" stopColor="#5533FF" />
          <stop offset="60%" stopColor="#2200CC" />
          <stop offset="100%" stopColor="#0A0814" />
        </radialGradient>

        <radialGradient
          id="blogGlow"
          cx="30%"
          cy="70%"
          r="60%"
        >
          <stop
            offset="0%"
            stopColor="#4422EE"
            stopOpacity="0.6"
          />
          <stop
            offset="100%"
            stopColor="#0A0814"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      <rect width="300" height="220" fill="#06040F" />

      <ellipse
        cx="100"
        cy="160"
        rx="120"
        ry="80"
        fill="url(#blogGlow)"
      />

      <circle
        cx="160"
        cy="130"
        r="110"
        fill="url(#blogSphere)"
      />

      <ellipse
        cx="160"
        cy="130"
        rx="108"
        ry="30"
        fill="none"
        stroke="rgba(100,80,255,0.25)"
        strokeWidth="1"
      />

      <ellipse
        cx="160"
        cy="105"
        rx="80"
        ry="22"
        fill="none"
        stroke="rgba(130,110,255,0.2)"
        strokeWidth="1"
      />
    </svg>
  );
}

/* News & Announcements */
function NewsVisual() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 220"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient
          id="newsGlow"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop
            offset="0%"
            stopColor="#1133FF"
            stopOpacity="0.15"
          />
          <stop
            offset="100%"
            stopColor="#06040F"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      <rect width="300" height="220" fill="#06040F" />

      <ellipse
        cx="150"
        cy="110"
        rx="140"
        ry="80"
        fill="url(#newsGlow)"
      />

      {[
        {
          ry: 14,
          opacity: 0.9,
          color: "#3355FF",
        },
        {
          ry: 28,
          opacity: 0.75,
          color: "#2244EE",
        },
        {
          ry: 44,
          opacity: 0.6,
          color: "#1133CC",
        },
        {
          ry: 60,
          opacity: 0.45,
          color: "#0A22AA",
        },
        {
          ry: 76,
          opacity: 0.3,
          color: "#081888",
        },
        {
          ry: 92,
          opacity: 0.18,
          color: "#060E66",
        },
      ].map((r, i) => (
        <ellipse
          key={i}
          cx="150"
          cy="140"
          rx={130}
          ry={r.ry}
          fill="none"
          stroke={r.color}
          strokeWidth="1.5"
          opacity={r.opacity}
        />
      ))}
    </svg>
  );
}

/* Ecosystem Highlights */
function EcoVisual() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 220"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient
          id="ecoGlow"
          cx="50%"
          cy="50%"
          r="55%"
        >
          <stop
            offset="0%"
            stopColor="#3344CC"
            stopOpacity="0.4"
          />
          <stop
            offset="100%"
            stopColor="#06040F"
            stopOpacity="0"
          />
        </radialGradient>

        <linearGradient
          id="ecoStroke1"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#aabbee" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#7788cc" />
        </linearGradient>

        <linearGradient
          id="ecoStroke2"
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#cc99ff" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#5544bb" />
        </linearGradient>
      </defs>

      <rect width="300" height="220" fill="#0A0820" />

      <ellipse
        cx="150"
        cy="110"
        rx="130"
        ry="90"
        fill="url(#ecoGlow)"
      />

      <path
        d="M90 60 C130 30, 210 30, 220 90 C230 150, 170 190, 150 170 C130 150, 80 160, 70 110 C60 60, 110 40, 150 50 C190 60, 230 90, 210 130 C190 170, 130 180, 100 150 C70 120, 80 70, 120 60"
        fill="none"
        stroke="url(#ecoStroke1)"
        strokeWidth="2"
        opacity="0.8"
      />

      <path
        d="M80 80 C110 40, 200 50, 215 100 C230 150, 175 195, 145 175 C115 155, 65 165, 60 108 C55 50, 120 35, 155 50 C190 65, 225 100, 200 140 C175 180, 120 185, 92 158"
        fill="none"
        stroke="url(#ecoStroke2)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      <circle
        cx="215"
        cy="90"
        r="4"
        fill="white"
        opacity="0.9"
      />

      <circle
        cx="70"
        cy="110"
        r="3"
        fill="#aabbff"
        opacity="0.8"
      />

      <circle
        cx="150"
        cy="50"
        r="3"
        fill="white"
        opacity="0.7"
      />
    </svg>
  );
}