"use client";

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

/* ── stat data ── */
const stats = [
  {
    icon: <BoltIcon />,
    label: "Receipt issuance",
    value: "< 50",
    unit: "ms",
  },
  {
    icon: <GasIcon />,
    label: "Tamper-evident signing",
    value: "HMAC",
    unit: "SHA-256",
  },
  {
    icon: <ClockIcon />,
    label: "Independent verification",
    value: "1",
    unit: "public link",
    unitSmall: true,
  },
  {
    icon: <GridIcon />,
    label: "Onchain anchoring",
    value: "Optional",
    unit: "per receipt",
    unitSmall: true,
  },
];

/* ── tech highlight data ── */
const highlights = [
  {
    title: "Signed receipt envelopes",
    body: "Every receipt is a canonical payload sealed with HMAC-SHA256. The signature covers product, buyer, seller, date, payment reference, ownership and attached rights, so a single altered field invalidates the whole record.",
    icon: <SPNIcon />,
  },
  {
    title: "Transferable ownership history",
    body: "Receipts move between wallets with an append-only, signed trail. Each hop records from, to, timestamp and reason, and the current owner can always be proven without trusting a central database.",
    icon: <StorageIcon />,
  },
  {
    title: "Optional onchain anchoring",
    body: "Issue, transfer and revoke events can be anchored to a public chain. Anyone can confirm a receipt existed and was never quietly changed, while the private payload stays with the parties involved.",
    icon: <ConsensusIcon />,
  },
  {
    title: "Business-ready API & SDK",
    body: "Issue a receipt directly from your checkout with a single API call. Server-side SDKs and an x-api-key flow let platforms, marketplaces and merchants add portable proof in minutes.",
    icon: <CrossChainIcon />,
  },
];

export default function UnderTheHoodSection() {
  return (
    <>
      {/* ══ SECTION 1: UNDER THE HOOD ══ */}
      <section
        style={{
          background: "#ffffff",
          padding: "clamp(52px, 7vw, 72px) 0 clamp(60px, 8vw, 80px)",
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
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: "clamp(30px, 5vw, 48px)",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(22px, 5vw, 40px)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "#0A0A0A",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.15,
                margin: 0,
                flex: "1 1 500px",
              }}
            >
              UNDER THE HOOD: SIGNED, PORTABLE, VERIFIABLE
            </h2>

            <a
              href="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 20px",
                background: "#2200FF",
                color: "white",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Open your wallet
              <ArrowUpRight />
            </a>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
            }}
            className="stats-grid"
          >
            {stats.map((s, i) => (
              <StatCard key={i} stat={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "#e8e8ee" }} />

      {/* ══ SECTION 2: TECH HIGHLIGHTS ══ */}
      <section
        style={{
          background: "#f2f2f6",
          padding: "clamp(52px, 7vw, 72px) 0 clamp(60px, 8vw, 80px)",
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
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              marginBottom: "clamp(30px, 5vw, 48px)",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(26px, 6vw, 42px)",
                fontWeight: 600,
                color: "#0A0A0A",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                margin: 0,
                flex: "1 1 400px",
              }}
            >
              Built for trust
            </h2>

            <a
              href="/dashboard#api"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 20px",
                background: "#2200FF",
                color: "white",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Read the docs
              <ArrowUpRight />
            </a>
          </div>

          {/* 2×2 highlight grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
            }}
            className="highlights-grid"
          >
            {highlights.map((h, i) => (
              <HighlightCard key={i} item={h} />
            ))}
          </div>
        </div>
      </section>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .highlights-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            gap: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </>
  );
}

/* ── Stat card ── */
function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  return (
    <div
      style={{
        background: "#f5f5f8",
        border: "1px solid #e0e0e8",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      {/* Top dotted area with icon */}
      <div
        style={{
          backgroundImage:
            "radial-gradient(circle, #c8c8d4 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          padding: "clamp(16px, 3vw, 22px) clamp(14px, 3vw, 20px) 18px",
          borderBottom: "1px solid #e0e0e8",
        }}
      >
        <div style={{ color: "#555" }}>{stat.icon}</div>
      </div>

      {/* Label */}
      <div
        style={{
          padding: "14px clamp(14px, 3vw, 20px) 0",
          fontSize: "clamp(11px, 1.5vw, 13px)",
          lineHeight: 1.4,
          color: "#666",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {stat.label}
      </div>

      {/* Value */}
      <div
        style={{
          padding: "10px clamp(14px, 3vw, 20px) 24px",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 600,
          color: "#0A0A0A",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 600,
          }}
        >
          {stat.value}
        </span>

        {stat.unit && (
          <span
            style={{
              fontSize: stat.unitSmall
                ? "clamp(11px, 1.8vw, 13px)"
                : "clamp(16px, 2.5vw, 20px)",
              fontWeight: 400,
              color: stat.unitSmall ? "#555" : "#0A0A0A",
              lineHeight: stat.unitSmall ? 1.3 : 1,
              maxWidth: stat.unitSmall ? 140 : "none",
            }}
          >
            {stat.unit}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Highlight card ── */
function HighlightCard({ item }: { item: (typeof highlights)[0] }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e0e0e8",
        borderRadius: 16,
        padding: "clamp(20px, 3vw, 28px)",
        display: "flex",
        gap: "clamp(16px, 2.5vw, 24px)",
        alignItems: "flex-start",
        minWidth: 0,
      }}
      className="highlight-card"
    >
      {/* Animated icon box */}
      <div
        style={{
          width: "clamp(76px, 10vw, 110px)",
          height: "clamp(76px, 10vw, 110px)",
          flexShrink: 0,
          background: "#f5f5f8",
          border: "1px solid #e0e0e8",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        className="highlight-icon"
      >
        {item.icon}
      </div>

      {/* Text */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            fontSize: "clamp(16px, 2vw, 17px)",
            fontWeight: 600,
            color: "#0A0A0A",
            margin: "0 0 10px",
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontSize: "clamp(13px, 1.6vw, 14px)",
            lineHeight: 1.65,
            color: "#555",
            fontFamily: "Inter, sans-serif",
            margin: 0,
          }}
        >
          {item.body}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   STAT ICONS
════════════════════════════════════ */

function BoltIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GasIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4 20h10"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 8h3a1 1 0 0 1 1 1v7a2 2 0 0 0 2 2"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="19" cy="18" r="2" stroke="#666" strokeWidth="1.4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#666"
        strokeWidth="1.4"
      />
      <path
        d="M12 7v5l3 3"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4l1.5 1.5"
        stroke="#666"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="#666"
        strokeWidth="1.4"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="#666"
        strokeWidth="1.4"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="#666"
        strokeWidth="1.4"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="#666"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/* ════════════════════════════════════
   TECH HIGHLIGHT ICONS
════════════════════════════════════ */

/* SPN */
function SPNIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <style>{`
        @keyframes spnSlide {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }

        @keyframes spnFade {
          0%,100% { opacity:0.5; }
          50% { opacity:1; }
        }
      `}</style>

      <rect
        x="16"
        y="58"
        width="58"
        height="8"
        rx="2"
        fill="#c8c8d8"
        opacity="0.5"
        style={{ animation: "spnFade 3s ease-in-out infinite" }}
      />

      {[0, 12, 24].map((offset, i) => (
        <g
          key={i}
          style={{
            animation: `spnSlide 3s ease-in-out ${i * 0.2}s infinite`,
            transformOrigin: "45px 45px",
          }}
        >
          <rect
            x={20 - i * 2}
            y={20 + offset}
            width={50 + i * 4}
            height={9}
            rx="2"
            fill={i === 1 ? "#2200FF" : "#b0b0c8"}
          />

          {[0, 1, 2].map((d) => (
            <rect
              key={d}
              x={24 + d * 12 - i * 2}
              y={23 + offset}
              width="6"
              height="3"
              rx="1"
              fill={i === 1 ? "rgba(255,255,255,0.4)" : "#888"}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* Storage */
function StorageIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <style>{`
        @keyframes pipeFlow {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes spnFade {
          0%,100% { opacity:.5; }
          50% { opacity:1; }
        }
      `}</style>

      <path
        d="M20 30 Q20 55 45 55 Q70 55 70 75"
        fill="none"
        stroke="#c0c0d0"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="M20 30 Q20 55 45 55 Q70 55 70 75"
        fill="none"
        stroke="#2200FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="30 90"
        style={{ animation: "pipeFlow 2s linear infinite" }}
      />

      <circle
        cx="20"
        cy="30"
        r="7"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      />

      <circle
        cx="20"
        cy="30"
        r="3"
        fill="#2200FF"
        style={{ animation: "spnFade 2s ease-in-out infinite" }}
      />

      <circle
        cx="70"
        cy="75"
        r="7"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      />

      <circle
        cx="70"
        cy="75"
        r="3"
        fill="#FF4400"
        style={{
          animation: "spnFade 2s ease-in-out 1s infinite",
        }}
      />
    </svg>
  );
}

/* Consensus */
function ConsensusIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <style>{`
        @keyframes conPulse {
          0%,100% { r:8; opacity:1; }
          50% { r:11; opacity:0.7; }
        }

        @keyframes conLine {
          0%,100% { opacity:0.3; }
          50% { opacity:1; }
        }
      `}</style>

      <line
        x1="20"
        y1="62"
        x2="45"
        y2="22"
        stroke="#aaa"
        strokeWidth="1.3"
        style={{ animation: "conLine 2s ease-in-out 0s infinite" }}
      />

      <line
        x1="45"
        y1="22"
        x2="70"
        y2="62"
        stroke="#aaa"
        strokeWidth="1.3"
        style={{ animation: "conLine 2s ease-in-out 0.3s infinite" }}
      />

      <line
        x1="20"
        y1="62"
        x2="70"
        y2="62"
        stroke="#aaa"
        strokeWidth="1.3"
        style={{ animation: "conLine 2s ease-in-out 0.6s infinite" }}
      />

      <circle
        cx="45"
        cy="22"
        r="8"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      />

      <circle cx="45" cy="22" r="4" fill="#888" />

      <circle
        cx="20"
        cy="62"
        r="11"
        fill="#2200FF"
        opacity="0.15"
        style={{
          animation: "conPulse 2.5s ease-in-out infinite",
        }}
      />

      <circle cx="20" cy="62" r="8" fill="#2200FF" />

      <circle
        cx="70"
        cy="62"
        r="8"
        fill="none"
        stroke="#aaa"
        strokeWidth="1.5"
      />

      <circle
        cx="70"
        cy="62"
        r="3.5"
        fill="#aaa"
        style={{
          animation: "conPulse 2.5s ease-in-out 0.8s infinite",
        }}
      />

      <circle
        cx="10"
        cy="40"
        r="2.5"
        fill="#ccc"
        style={{
          animation: "conLine 3s ease-in-out infinite",
        }}
      />

      <circle
        cx="38"
        cy="75"
        r="2"
        fill="#ccc"
        style={{
          animation: "conLine 3s ease-in-out 0.5s infinite",
        }}
      />
    </svg>
  );
}

/* Cross-Chain */
function CrossChainIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <style>{`
        @keyframes ccFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }
      `}</style>

      {[
        { x: 45, y: 15, d: "0s" },
        { x: 75, y: 45, d: "0.3s" },
        { x: 45, y: 75, d: "0.6s" },
        { x: 15, y: 45, d: "0.9s" },
      ].map((n, i) => (
        <rect
          key={i}
          x={n.x - 7}
          y={n.y - 7}
          width="14"
          height="14"
          rx="1"
          fill="#aaa"
          transform={`rotate(45 ${n.x} ${n.y})`}
          style={{
            animation: `ccFloat 3s ease-in-out ${n.d} infinite`,
            transformOrigin: `${n.x}px ${n.y}px`,
          }}
        />
      ))}

      {[
        [45, 15, 75, 45],
        [75, 45, 45, 75],
        [45, 75, 15, 45],
        [15, 45, 45, 15],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#ccc"
          strokeWidth="1.2"
        />
      ))}

      <rect
        x="33"
        y="33"
        width="24"
        height="24"
        rx="3"
        fill="#2200FF"
        style={{
          animation: "ccFloat 2s ease-in-out infinite",
          transformOrigin: "45px 45px",
        }}
      />

      {[
        { x: 26, y: 26 },
        { x: 56, y: 26 },
        { x: 26, y: 56 },
        { x: 56, y: 56 },
      ].map((sq, i) => (
        <rect
          key={i}
          x={sq.x - 4}
          y={sq.y - 4}
          width="8"
          height="8"
          rx="1"
          fill="#bbb"
          style={{
            animation: `ccFloat 2.5s ease-in-out ${
              i * 0.2
            }s infinite`,
            transformOrigin: `${sq.x}px ${sq.y}px`,
          }}
        />
      ))}
    </svg>
  );
}