"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "./WalletAuthProvider";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WalletConnectButton({ mobile = false }: { mobile?: boolean }) {
  const { wallet, working, error, ready, connect, disconnect } = useWalletAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* close dropdown on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* ── Not connected ── */
  if (!wallet) {
    const label = !ready ? "Connect wallet" : working ? "Signing in…" : "Connect wallet";
    return (
      <div className="relative">
        <button
          onClick={() => connect()}
          disabled={working || !ready}
          className={`flex items-center justify-center gap-2 rounded-full bg-[#1A00E8] text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70 ${
            mobile ? "w-full py-3.5" : "px-4 py-2"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
          {label}
        </button>
        {error && (
          <p className="absolute right-0 top-full z-50 mt-2 w-64 text-right text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  /* ── Connected — address badge + dropdown ── */
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border border-[#e3e3ea] bg-white text-sm font-medium text-[#0a0a14] transition hover:bg-[#f5f5f8] ${
          mobile ? "w-full justify-center py-3" : "px-3 py-1.5"
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        {shortAddr(wallet)}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#e5e5ed] bg-white shadow-xl">
          <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#91919d]">
            Wallet
          </p>
          <p className="px-4 pb-3 text-xs text-[#0a0a14] break-all">{wallet}</p>
          <div className="border-t border-[#eeeeF2]" />
          <button
            onClick={() => { setMenuOpen(false); router.push("/dashboard"); }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-[#0a0a14] hover:bg-[#f7f7fa]"
          >
            Open dashboard
          </button>
          <button
            onClick={() => { setMenuOpen(false); void disconnect(); }}
            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
