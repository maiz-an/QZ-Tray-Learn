import React from "react";

/**
 * App footer.
 *
 * Surfaces the demo signing certificate that ships in /public/Demo.crt
 * so anyone testing against the live Vercel deployment can drop it into
 * the QZ Tray Site Manager and enable silent printing without prompts.
 *
 * Two paths are documented side by side:
 *   1. Using the hosted demo (qz-tray.vercel.app)  → use the shipped Demo.crt
 *   2. Cloned the repo from GitHub                 → generate your own cert
 */
export function Footer() {
  const certUrl = "/Demo.crt";
  const certFileName = "Demo.crt";
  const readmeUrl = "https://github.com/maiz-an/QZ-Tray-Learn#certificate-setup-for-silent-printing";
  const liveUrl = "https://qz-tray.vercel.app";

  return (
    <footer className="mt-8 border-t border-line-dim pt-6">
      <div className="border-l-2 border-l-line bg-panel px-[18px] py-4 text-xs leading-relaxed text-ink-dim">
        {/* -------- header row -------- */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[.14em] text-ink-dim">
            <span className="text-accent-glow">▸</span>
            Remove the QZ Tray "Allow / Block" popup
          </div>
          <span className="rounded-sm border border-accent-dim px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[.18em] text-accent-glow">
            pick one
          </span>
        </div>

        <p className="mb-4">
          QZ Tray asks permission on every print unless it <b className="text-ink">trusts</b> the
          site. Choose the path that matches how you&apos;re running this app:
        </p>

        {/* ============================================================
            OPTION 1 — Hosted demo
            ============================================================ */}
        <div className="mb-3 border border-line-dim bg-panel-2 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[11px] font-bold uppercase tracking-[.12em] text-ink">
              1 · Using the hosted demo
            </div>
            <code className="border-b border-line-dim text-[11px] text-ink-dim">
              qz-tray.vercel.app
            </code>
          </div>

          <p className="mb-3 text-[11.5px] leading-relaxed">
            Download the demo certificate below, then load it into your QZ Tray Site Manager.
            That tells QZ Tray to trust requests signed by{" "}
            <code className="border-b border-line-dim text-ink">{liveUrl}</code> — no popup,
            no prompt.
          </p>

          {/* -------- download button -------- */}
          <div className="mb-3 flex flex-wrap gap-2">
            <a
              href={certUrl}
              download={certFileName}
              className="
                inline-flex items-center justify-center gap-2
                rounded-sm border border-accent bg-accent
                px-4 py-2.5 text-[12.5px] font-semibold tracking-[.03em]
                text-void transition
                hover:border-accent-glow hover:bg-accent-glow
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-accent focus-visible:outline-offset-2
              "
            >
              ↓ download Demo.crt
            </a>
          </div>

          {/* -------- install steps -------- */}
          <div className="border border-line-dim bg-panel p-3 text-[11.5px] leading-relaxed">
            <div className="mb-2 font-semibold uppercase tracking-[.12em] text-ink-dim">
              Add it to QZ Tray
            </div>
            <ol className="ml-4 list-decimal space-y-1.5">
              <li>
                Right-click the <b className="text-ink">QZ Tray</b> tray icon →{" "}
                <b className="text-ink">Advanced</b> → <b className="text-ink">Site Manager</b>.
              </li>
              <li>
                Click the <b className="text-ink">+</b> button (bottom-left) to add a new site.
              </li>
              <li>
                In the <b className="text-ink">Site</b> field, enter{" "}
                <code className="border-b border-line-dim text-ink">{liveUrl}</code>.
              </li>
              <li>
                Next to <b className="text-ink">Certificate</b>, click{" "}
                <b className="text-ink">Browse…</b> and pick the{" "}
                <code className="text-ink">Demo.crt</code> you just downloaded.
              </li>
              <li>
                Click <b className="text-ink">Save</b>. That site is now trusted for silent
                printing.
              </li>
            </ol>
          </div>
        </div>

        {/* ============================================================
            OPTION 2 — Cloned from GitHub
            ============================================================ */}
        <div className="mb-3 border border-line-dim bg-panel-2 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-[11px] font-bold uppercase tracking-[.12em] text-ink">
              2 · Cloned from GitHub
            </div>
            <code className="border-b border-line-dim text-[11px] text-ink-dim">
              local dev
            </code>
          </div>

          <p className="mb-2 text-[11.5px] leading-relaxed">
            If you cloned this repo, don&apos;t use the demo cert —{" "}
            <b className="text-ink">generate your own</b> pair with QZ Tray&apos;s built-in
            generator and drop the two files into the project&apos;s{" "}
            <code className="border-b border-line-dim text-ink">certs/</code> folder. The full
            walk-through (Site Manager → Create New → install → copy{" "}
            <code className="text-ink">override.crt</code>) is in the README:
          </p>

          <div className="flex flex-wrap gap-2">
            <a
              href={readmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center justify-center gap-2
                rounded-sm border border-line bg-panel
                px-4 py-2.5 text-[12.5px] font-semibold tracking-[.03em]
                text-ink transition
                hover:border-accent-dim hover:bg-[#241210]
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-accent focus-visible:outline-offset-2
              "
            >
              ↗ open README — certificate setup
            </a>
          </div>

          <div className="mt-3 border border-line-dim bg-panel p-3 text-[11.5px] leading-relaxed">
            <div className="mb-2 font-semibold uppercase tracking-[.12em] text-ink-dim">
              At a glance
            </div>
            <ol className="ml-4 list-decimal space-y-1.5">
              <li>
                QZ Tray → <b className="text-ink">Advanced</b> →{" "}
                <b className="text-ink">Site Manager</b> → <b className="text-ink">+</b> →{" "}
                <b className="text-ink">Create New</b> → generate a key pair.
              </li>
              <li>
                Copy <code className="text-ink">digital-certificate.txt</code> and{" "}
                <code className="text-ink">private-key.pem</code> from the{" "}
                <b className="text-ink">QZ Tray Demo Cert</b> folder on your Desktop.
              </li>
              <li>
                Paste both into this project&apos;s{" "}
                <code className="border-b border-line-dim text-ink">certs/</code> folder.
              </li>
              <li>
                Restart the server (<code className="text-ink">npm run dev</code>) and reload
                the page. Popup gone.
              </li>
            </ol>
          </div>
        </div>

        {/* -------- warning -------- */}
        <div className="text-[10.5px] leading-relaxed">
          ⚠ <b className="text-ink">Demo certificate only.</b> It&apos;s trusted on the machine
          that generated it, so don&apos;t reuse it in production and don&apos;t share it as a
          drop-in for other deployments. See the{" "}
          <a
            href={readmeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-accent-dim text-accent-glow no-underline hover:border-b-accent-glow"
          >
            README
          </a>{" "}
          for the full certificate guide.
        </div>
      </div>
    </footer>
  );
}

export default Footer;