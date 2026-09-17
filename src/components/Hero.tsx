import Cards3D from "./Cards3D";
import HeroActions from "./HeroActions";

const DiscordSmall = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.85 13.85 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03Z" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
  >
    <circle
      cx="10"
      cy="10"
      r="8.5"
      stroke="white"
      strokeWidth="1.3"
    />
    <ellipse
      cx="10"
      cy="10"
      rx="4"
      ry="8.5"
      stroke="white"
      strokeWidth="1.3"
    />
    <path
      d="M1.5 10h17M2.5 6.5h15M2.5 13.5h15"
      stroke="white"
      strokeWidth="1.3"
    />
  </svg>
);

/* Folio mark */
const FolioMark = () => (
  <svg
    width="50"
    height="44"
    viewBox="0 0 50 44"
    fill="none"
    className="inline-block align-middle w-[34px] h-[30px] sm:w-[42px] sm:h-[37px] lg:w-[50px] lg:h-[44px]"
  >
    <rect x="2" y="2" width="40" height="40" rx="9" fill="#0A0A0A" />
    <path
      d="M22 10h8v6h-4.5v4h4v6h-4v8h-3.5V10z"
      fill="white"
    />
  </svg>
);

export default function Hero() {
  return (
    <section className="grid-bg relative min-h-screen pt-[60px] overflow-hidden">

      <div
        className="
          relative
          z-10
          w-full
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-6
          md:px-12
          flex
          flex-col
          min-h-[calc(100vh-60px)]
        "
      >

        {/* Main hero row */}
        <div
          className="
            flex
            flex-col
            lg:flex-row
            items-start
            lg:items-center
            justify-between
            pt-12
            sm:pt-16
            lg:pt-20
            pb-8
            sm:pb-10
            gap-8
            lg:gap-10
          "
        >

          {/* ── Left column ── */}
          <div
            className="
              flex
              flex-col
              gap-6
              sm:gap-7
              lg:gap-8
              w-full
              max-w-[680px]
            "
          >

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3.5
                sm:px-4
                py-2
                rounded-full
                text-white
                text-xs
                sm:text-sm
                font-medium
                w-fit
              "
              style={{
                background: "#111111",
              }}
            >
              <GlobeIcon />
              <span>Portable receipts for digital commerce.</span>
            </div>

            {/* Headline */}
            <h1
              className="
                font-semibold
                leading-[1.08]
                tracking-[-0.025em]
                m-0
              "
              style={{
                fontSize: "clamp(30px, 5.5vw, 49px)",
                color: "#0A0A0A",
              }}
            >
              {/* <FolioMark />{" "} */}
              <span>Your purchases.</span>
              <br />
              <span>Your proof.</span>
              <br />
              <span>Your ownership.</span>
              <br />
              {/* <span>ready to transfer</span> */}
            </h1>

            {/* CTA buttons */}
            <HeroActions />
          </div>

          {/* ── Right column — 3D animated cards ── */}
     <div className="flex w-full items-center justify-center lg:flex-1 lg:justify-end">
  <Cards3D />
</div>
        </div>

        {/* ── Bottom tagline ── */}
        <div
          className="
            mt-auto
            pt-8
            sm:pt-10
            pb-10
            sm:pb-14
            lg:pb-20
          "
        >
          <div
            className="
              pl-4
              sm:pl-5
              max-w-[600px]
              text-[14px]
              sm:text-[16px]
              lg:text-[17px]
              leading-[1.65]
              text-[#222]
            "
            style={{
              borderLeft: "2.5px solid #999",
            }}
          >
            Every receipt carries proof of purchase, ownership history,
            attached rights and warranty — signed by the issuer and verifiable
            by anyone, onchain or off. Folio gives buyers and businesses one
            portable record that travels with every purchase.
          </div>
        </div>
      </div>
    </section>
  );
}