"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

type WalletAuth = {
  /** Wallet address of the established Folio session, or null. */
  wallet: string | null;
  address?: string;
  isConnected: boolean;
  working: boolean;
  error: string;
  ready: boolean;
  /** Connect (if needed), sign the SIWE-style message, then optionally redirect. */
  connect: (redirectTo?: string) => void;
  /** Clear the session cookie and disconnect the wallet. */
  disconnect: () => Promise<void>;
};

const WalletAuthContext = createContext<WalletAuth | null>(null);

export function WalletAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const [wallet, setWallet] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  /* Restore an existing Folio session. */
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setWallet(data.wallet ?? null))
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const authenticate = useCallback(
    async (addr: string) => {
      const { nonce } = (await (await fetch("/api/auth/nonce")).json()) as {
        nonce: string;
      };
      const message = `Sign in to Folio\nNonce: ${nonce}`;
      const signature = await signMessageAsync({
        message,
        account: addr as `0x${string}`,
      });
      const response = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: addr, message, signature }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Wallet sign-in failed.");
      setWallet(data.wallet as string);
    },
    [signMessageAsync],
  );

  /* Once a connection exists and a redirect was requested, sign in then route. */
  useEffect(() => {
    if (!ready || !pending || !isConnected || !address || wallet) return;
    let cancelled = false;
    setWorking(true);
    setError("");
    authenticate(address)
      .then(() => {
        if (!cancelled) router.push(pending);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Wallet sign-in failed.");
      })
      .finally(() => {
        if (!cancelled) {
          setWorking(false);
          setPending(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ready, pending, isConnected, address, wallet, authenticate, router]);

  const connect = useCallback(
    (redirectTo?: string) => {
      const destination = redirectTo ?? "/dashboard";
      setError("");
      if (wallet) {
        router.push(destination);
        return;
      }
      if (isConnected && address) {
        setPending(destination);
        return;
      }
      setPending(destination);
      if (openConnectModal) openConnectModal();
      else setError("Wallet connection is unavailable. Please refresh and try again.");
    },
    [wallet, isConnected, address, router, openConnectModal],
  );

  const disconnect = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
    setWallet(null);
    setPending(null);
    try {
      await disconnectAsync();
    } catch {
      /* ignore */
    }
  }, [disconnectAsync]);

  const value = useMemo<WalletAuth>(
    () => ({ wallet, address, isConnected, working, error, ready, connect, disconnect }),
    [wallet, address, isConnected, working, error, ready, connect, disconnect],
  );

  return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>;
}

export function useWalletAuth(): WalletAuth {
  const context = useContext(WalletAuthContext);
  if (!context) throw new Error("useWalletAuth must be used within a WalletAuthProvider");
  return context;
}
