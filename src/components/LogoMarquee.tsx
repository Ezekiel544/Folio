"use client";

const partners = [
  "Fjord Cycles",
  "Studio Store",
  "Northwind",
  "Kite Labs",
  "Meridian",
  "Aeon Digital",
  "The Loft",
  "Cardinal",
  "Orbit Audio",
  "Beacon Supply",
];

export default function LogoMarquee() {
  const doubled = [...partners, ...partners];

  return (
    <div
      className="w-full overflow-hidden border-t border-b"
      style={{
        background: "#f5f5f7",
        borderColor: "#e0e0e6",
        padding: "16px 0",
      }}
    >
      <div
        className="flex items-center gap-16"
        style={{
          width: "max-content",
          animation: "marqueeScroll 32s linear infinite",
        }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-[15px] font-semibold tracking-[-.02em] text-[#111] opacity-60 transition-opacity hover:opacity-100"
          >
            {name}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
