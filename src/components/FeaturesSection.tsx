"use client";

import { useRef, useEffect, useState } from "react";
import {
  ModularNetworkIllustration,
  CompliantIllustration,
  InclusiveIllustration,
  BorderlessIllustration,
} from "./FeatureIllustrations";

const features = [
  {
    num: 1,
    title: "SIGNED. PORTABLE.\nVERIFIABLE.",
    body: "Every purchase becomes a signed receipt you actually own. Product, buyer, seller, date and payment reference are sealed with a tamper-evident signature, so the record can never be quietly rewritten.",
    illustration: <ModularNetworkIllustration />,
  },
  {
    num: 2,
    title: "OWNERSHIP THAT\nTRAVELS WITH YOU",
    body: "A Folio receipt is a real, transferable record. Resell, gift or hand it on — every hop is appended to a signed transfer history, and the current owner is always provable.",
    illustration: <CompliantIllustration />,
  },
  {
    num: 3,
    title: "RIGHTS & WARRANTY,\nATTACHED",
    body: "Licenses, access periods, support and warranty live alongside the proof of purchase. Buyers keep what they paid for; businesses keep serving the right person, not just the original checkout.",
    illustration: <InclusiveIllustration />,
  },
  {
    num: 4,
    title: "PROOF ANYONE\nCAN CHECK",
    body: "Each receipt has a public verification page, and can be anchored onchain so a third party can confirm it was issued, transferred or revoked — without trusting your database or a private dashboard.",
    illustration: <BorderlessIllustration />,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="w-full"
      style={{ background: "#f0f0f4" }}
    >
      {/* Section heading */}
      <div className="text-center px-5 py-14 sm:py-16 md:py-20">
        <h2
          className="tracking-[0.12em] font-semibold"
          style={{
            fontSize: "clamp(24px, 3.8vw, 52px)",
            color: "#0A0A0A",
            letterSpacing: "0.08em",
            lineHeight: 1.15,
          }}
        >
          FROM RECEIPTS TO REAL OWNERSHIP
        </h2>
      </div>

      {/* Cards stack */}
      <div
        className="mx-auto flex flex-col gap-4 pb-16 sm:pb-24"
        style={{
          maxWidth: 900,
          paddingLeft: "clamp(16px, 3vw, 24px)",
          paddingRight: "clamp(16px, 3vw, 24px)",
        }}
      >
        {features.map((f, i) => (
          <FoldCard
            key={f.num}
            feature={f}
            index={i}
            total={features.length}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Individual card with scroll-fold effect ── */
function FoldCard({
  feature,
  index,
  total,
}: {
  feature: (typeof features)[0];
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Slightly different fold behavior on mobile
      const isMobile = window.innerWidth < 640;

      const foldStart = windowH * (isMobile ? 0.22 : 0.3);
      const foldEnd = windowH * (isMobile ? -0.18 : -0.3);

      const raw = (rect.top - foldStart) / (foldEnd - foldStart);
      const clamped = Math.min(1, Math.max(0, raw));

      setProgress(clamped);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Fold effect
  const scaleY = 1 - progress * 0.35;
  const opacity = 1 - progress * 0.4;
  const translateY = progress * -24;

  // Smaller stack on mobile
  const stackOffset =
    typeof window !== "undefined" && window.innerWidth < 640 ? 2 : 4;

  return (
    <div
      ref={cardRef}
      style={{
        transformOrigin: "center top",
        transform: `
          perspective(1000px)
          translateY(${translateY}px)
          scaleY(${scaleY})
          rotateX(${progress * 8}deg)
        `,
        opacity,
        position: "relative",
        zIndex: total - index,
        marginTop: index > 0 ? -index * stackOffset : 0,
        transition: "none",
        width: "100%",
      }}
    >
      <div
        className="
          w-full
          flex
          flex-col
          sm:grid
          sm:grid-cols-2
          items-center
        "
        style={{
          background: "#f5f5f8",
          border: "1px solid #e0e0e8",
          borderRadius: 16,
          padding: "clamp(24px, 4vw, 40px)",
          gap: "clamp(24px, 4vw, 40px)",
          overflow: "hidden",
        }}
      >
        {/* Left — number badge + illustration */}
        <div className="flex flex-col items-start gap-4 w-full">
          {/* Number badge */}
          <div
            className="flex items-center justify-center text-white text-sm font-bold"
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              background: "#2200FF",
              borderRadius: 6,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {feature.num}
          </div>

          {/* Illustration */}
          <div
            className="
              flex
              items-center
              justify-center
              w-full
              overflow-hidden
            "
            style={{
              minHeight: "clamp(180px, 30vw, 300px)",
            }}
          >
            <div className="w-full max-w-[320px] sm:max-w-none flex justify-center">
              {feature.illustration}
            </div>
          </div>
        </div>

        {/* Right — title + body */}
        <div className="flex flex-col gap-4 w-full">
          <h3
            style={{
              fontSize: "clamp(21px, 2.2vw, 32px)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#0A0A0A",
              lineHeight: 1.1,
              whiteSpace: "pre-line",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {feature.title}
          </h3>

          <p
            style={{
              fontSize: "clamp(14px, 1.5vw, 15px)",
              lineHeight: 1.7,
              color: "#444",
              fontFamily: "Inter, sans-serif",
              margin: 0,
            }}
          >
            {feature.body}
          </p>
        </div>
      </div>
    </div>
  );
}