"use client";

import { useWalletAuth } from "./WalletAuthProvider";

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

const baseButton = `
  flex
  items-center
  justify-between
  gap-2.5
  sm:gap-3
  px-4
  sm:px-5
  py-2.5
  sm:py-3
  rounded-xl
  text-sm
  font-medium
  text-[#111]
  transition-all
  hover:shadow-md
  disabled:opacity-70
  cursor-pointer
`;

const iconBox = `
  flex
  items-center
  justify-center
  rounded-lg
  text-white
`;

export default function HeroActions() {
  const { connect, working } = useWalletAuth();

  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-wrap w-full">
      <button
        type="button"
        onClick={() => connect("/dashboard")}
        disabled={working}
        className={baseButton}
        style={{ background: "#f0f0f2", border: "1.5px solid #d8d8de" }}
      >
        <span
          className={`${iconBox} mr-1`}
          style={{ width: 30, height: 30, background: "#2200FF" }}
        >
          <ArrowUpRight />
        </span>
        <span>{working ? "Connecting…" : "Open your wallet"}</span>
      </button>

      <button
        type="button"
        onClick={() => connect("/dashboard#receipts")}
        disabled={working}
        className={baseButton}
        style={{ background: "#f0f0f2", border: "1.5px solid #d8d8de" }}
      >
        <span>Issue a receipt</span>
        <span
          className={`${iconBox} ml-1`}
          style={{ width: 30, height: 30, background: "#2200FF" }}
        >
          <ArrowUpRight />
        </span>
      </button>
    </div>
  );
}
