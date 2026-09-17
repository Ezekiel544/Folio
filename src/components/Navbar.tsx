"use client";

import Link from "next/link";
import { useState } from "react";
import WalletConnectButton from "./WalletConnectButton";

/* ── tiny SVG icons ── */
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 4l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.85 13.85 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── Learn icon ── */
const LearnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 13l1.5-4.5L11 1l3 3-7.5 7.5L2 13z"
      stroke="#111"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M9 3l3 3" stroke="#111" strokeWidth="1.2" />
  </svg>
);

/* ── Build icon ── */
const BuildIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
      stroke="#4040FF"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <circle
      cx="8"
      cy="8"
      r="2.5"
      stroke="#4040FF"
      strokeWidth="1.3"
    />
  </svg>
);

const ArrowUpRight = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M3 11L11 3M11 3H5M11 3v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PulsingDot = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400" />
  </span>
);

/* ── Hamburger ── */
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Close icon ── */
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 5l14 14M19 5L5 19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        style={{
          background: "rgba(245,245,247,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 h-[60px] flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 font-bold text-[17px] tracking-tight text-[#0A0A0A]"
          >
            <PharosLogo />
            FOLIO
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink label="Explore" href="/dashboard" />
            <NavLink label="Learn" icon={<LearnIcon />} href="#features" />
            <NavLink label="Build" icon={<BuildIcon />} href="/dashboard#api" />
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-5">

           
            {/* <div className="flex items-center gap-4 text-[#0A0A0A]">
              <a
                href="#"
                aria-label="X / Twitter"
                className="hover:opacity-60 transition-opacity"
              >
                <XIcon />
              </a>

              <a
                href="#"
                aria-label="Discord"
                className="hover:opacity-60 transition-opacity"
              >
                <DiscordIcon />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:opacity-60 transition-opacity"
              >
                <LinkedInIcon />
              </a>
            </div> */}

            {/* CTA */}
            <WalletConnectButton />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="
              md:hidden
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              text-[#0A0A0A]
              hover:bg-black/5
              transition-colors
            "
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* ── Mobile menu ── */}
      <div
        className={`
          fixed
          top-[60px]
          left-0
          right-0
          z-40
          md:hidden
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          ${
            menuOpen
              ? "max-h-[calc(100vh-60px)] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
      >
        <div
          className="
            min-h-[calc(100vh-60px)]
            px-5
            py-7
            flex
            flex-col
          "
          style={{
            background: "rgba(245,245,247,0.98)",
            backdropFilter: "blur(18px)",
          }}
        >

          {/* Mobile navigation */}
          <nav className="flex flex-col">

            <MobileNavLink
              label="Explore"
              href="/dashboard"
              onClick={closeMenu}
            />

            <MobileNavLink
              label="Learn"
              icon={<LearnIcon />}
              href="#features"
              onClick={closeMenu}
            />

            <MobileNavLink
              label="Build"
              icon={<BuildIcon />}
              href="/dashboard#api"
              onClick={closeMenu}
            />

          </nav>

          {/* Divider */}
          <div className="w-full h-px bg-black/10 my-6" />

          {/* Socials */}
          <div className="flex items-center gap-5 text-[#0A0A0A]">
            <a
              href="#"
              aria-label="X / Twitter"
              className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <XIcon />
            </a>
{/* 
            <a
              href="#"
              aria-label="Discord"
              className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <DiscordIcon />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <LinkedInIcon />
            </a> */}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-8">
            <WalletConnectButton mobile />
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Desktop nav link ── */
function NavLink({
  label,
  icon,
  href,
}: {
  label: string;
  icon?: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-[14px] font-medium text-[#111] hover:opacity-60 transition-opacity"
    >
      {icon && icon}
      {label}
      <ChevronDown />
    </Link>
  );
}

/* ── Mobile nav link ── */
function MobileNavLink({
  label,
  icon,
  href,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  href: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        w-full
        flex
        items-center
        justify-between
        py-5
        text-left
        text-[18px]
        font-medium
        text-[#111]
        border-b
        border-black/10
      "
    >
      <span className="flex items-center gap-3">
        {icon && icon}
        {label}
      </span>

      <ChevronDown />
    </Link>
  );
}

/* ── Reusable CTA ── */
function ExploreButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <a
      href="/dashboard"
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-full
        text-white
        text-sm
        font-medium
        transition-all
        hover:opacity-90
        ${mobile ? "w-full py-3.5" : "px-4 py-2"}
      `}
      style={{
        background: "#1A00E8",
      }}
    >
      <PulsingDot />
      <ArrowUpRight />
      Explore Folio
    </a>
  );
}

function PharosLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="4" fill="#0A0A0A" />
      <path
        d="M13 3L6 12h5l-2 7 9-10h-5l2-9z"
        fill="white"
      />
    </svg>
  );
}
