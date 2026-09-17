"use client";

const ArrowUpRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M3 12 12 3m0 0H5m7 0v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DiscordIcon = () => <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>♣</span>;
const CodeIcon = () => <span aria-hidden="true" style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>&lt;/&gt;</span>;
const BuildIcon = () => <span aria-hidden="true" style={{ fontSize: 19, lineHeight: 1, transform: "rotate(-18deg)" }}>▰</span>;

const footerColumns = [
  { title: "Build", links: ["Docs", "API Reference", "SDKs"] },
  { title: "Explore", links: ["Dashboard", "Verify a receipt"] },
  { title: "Learn", links: ["How it works", "Blog", "News", "FAQ"] },
  { title: "Company", links: ["Careers", "User Agreement", "Privacy Policy", "Security"] },
  { title: "Community", links: ["Discord", "Twitter", "LinkedIn"] },
];

export default function PharosFooterSection() {
  return (
    <>
      <style>{`
        .pharos-footer-section { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        .pharos-cta { min-height: 505px; display: grid; place-content: center; padding: 56px 24px; background: #fff; text-align: center; }
        .pharos-cta h2 { margin: 0 0 38px; color: #090909; font-size: clamp(34px, 3.35vw, 54px); font-weight: 400; letter-spacing: -.045em; line-height: 1.05; }
        .pharos-actions { display: flex; justify-content: center; gap: 31px; flex-wrap: wrap; }
        .pharos-action { display: flex; align-items: center; gap: 15px; min-width: 245px; height: 52px; padding: 0 7px 0 22px; border-radius: 7px; background: #f6f6f7; color: #151515; font-size: 16px; text-decoration: none; text-align: left; transition: transform .18s ease, background .18s ease; }
        .pharos-action:hover { background: #eeeeff; transform: translateY(-3px); }
        .pharos-action-icon { width: 22px; display: grid; place-items: center; }
        .pharos-action-arrow { display: grid; place-items: center; width: 38px; height: 38px; margin-left: auto; border-radius: 6px; background: #1300ca; color: white; }
        .pharos-footer { position: relative; overflow: hidden; min-height: 486px; padding: 106px max(40px, calc((100vw - 1650px) / 2)) 68px; background: #343434; color: #fff; }
        .pharos-footer::after { content: ""; position: absolute; z-index: 0; top: 10px; right: -5px; width: min(49vw, 795px); height: 520px; opacity: .085; background: linear-gradient(59deg, transparent 0 46%, #fff 46% 52%, transparent 52%), linear-gradient(-31deg, transparent 0 44%, #fff 44% 51%, transparent 51%), linear-gradient(0deg, transparent 0 78%, #fff 78% 96%, transparent 96%); clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%); }
        .pharos-footer-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(300px, 2.3fr) repeat(5, minmax(100px, 1fr)); gap: 44px; max-width: 1650px; margin: 0 auto; }
        .pharos-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 29px; color: #fff; font-size: 23px; font-weight: 700; letter-spacing: .13em; }
        .pharos-mark { display: inline-grid; gap: 3px; transform: skewY(-15deg); }
        .pharos-mark i { display: block; width: 16px; height: 5px; background: #fff; }
        .pharos-socials { display: flex; gap: 22px; margin-bottom: 29px; }
        .pharos-socials a { color: #fff; font-size: 18px; font-weight: 700; text-decoration: none; }
        .pharos-newsletter { display: flex; width: 270px; height: 40px; overflow: hidden; border-radius: 7px; background: #505050; }
        .pharos-newsletter input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; padding: 0 13px; color: #fff; font: inherit; font-size: 13px; }
        .pharos-newsletter input::placeholder { color: #c8c8c8; }
        .pharos-newsletter button { border: 0; margin: 4px; padding: 0 15px; border-radius: 6px; background: #1300ca; color: #fff; font: inherit; font-size: 13px; cursor: pointer; }
        .pharos-copyright { margin: 47px 0 0; font-size: 13px; color: #f4f4f4; }
        .pharos-column h3 { margin: 0 0 31px; color: #969696; font-size: 14px; font-weight: 400; }
        .pharos-column ul { display: grid; gap: 19px; padding: 0; margin: 0; list-style: none; }
        .pharos-column a { color: #fff; font-size: 14px; line-height: 1.15; text-decoration: none; }
        .pharos-column a:hover, .pharos-socials a:hover { color: #bdb6ff; }
        @media (max-width: 1050px) { .pharos-footer-grid { grid-template-columns: 1.8fr repeat(3, 1fr); } .pharos-column:nth-last-child(-n+2) { margin-top: 16px; } }
        @media (max-width: 700px) { .pharos-cta { min-height: auto; padding: 84px 20px; } .pharos-actions { gap: 12px; } .pharos-action { min-width: min(100%, 320px); } .pharos-footer { padding: 64px 24px; } .pharos-footer-grid { grid-template-columns: repeat(2, 1fr); gap: 42px 26px; } .pharos-footer-brand { grid-column: 1 / -1; } .pharos-newsletter { width: 100%; max-width: 300px; } .pharos-column h3 { margin-bottom: 18px; } .pharos-column ul { gap: 14px; } }
      `}</style>

      <section className="pharos-footer-section">
        <div className="pharos-cta">
          <h2>Give every purchase a proof that lasts.</h2>
          <div className="pharos-actions">
            <a className="pharos-action" href="/dashboard"><span className="pharos-action-icon">  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.85 13.85 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg></span>Open your wallet <span className="pharos-action-arrow"><ArrowUpRight /></span></a>
            <a className="pharos-action" href="/dashboard#api"><span className="pharos-action-icon"><CodeIcon /></span>Read the docs <span className="pharos-action-arrow"><ArrowUpRight /></span></a>
            <a className="pharos-action" href="/dashboard"><span className="pharos-action-icon"><BuildIcon /></span>Issue a receipt <span className="pharos-action-arrow"><ArrowUpRight /></span></a>
          </div>
        </div>

        <footer className="pharos-footer">
          <div className="pharos-footer-grid">
            <div className="pharos-footer-brand">
              <div className="pharos-logo"><span style={{ display: "inline-grid", placeItems: "center", width: 24, height: 24, borderRadius: 5, background: "#fff", color: "#343434", fontSize: 15, fontWeight: 800 }}>F</span>FOLIO</div>
              <div className="pharos-socials">
                <a href="#x" aria-label="X"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg></a>
              {/* <a href="#discord" aria-label="Discord">  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.85 13.85 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
  </svg></a>
  <a href="#linkedin" aria-label="LinkedIn"> <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg></a> */}
  </div>
              <form className="pharos-newsletter" onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Your email" aria-label="Your email" /><button type="submit">Subscribe</button></form>
              <p className="pharos-copyright">© 2026 Folio All Rights Reserved.</p>
            </div>
            {footerColumns.map((column) => <nav className="pharos-column" key={column.title} aria-label={column.title}><h3>{column.title}</h3><ul>{column.links.map((link) => <li key={link}><a href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</a></li>)}</ul></nav>)}
          </div>
        </footer>
      </section>
    </>
  );
}
