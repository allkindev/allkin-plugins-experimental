// Web browser plugin — the service.
//
// The interface shows a site in a frame of its own. Whether the site accepts
// to be shown in a frame of another site is said by its headers
// (X-Frame-Options, Content-Security-Policy: frame-ancestors) — and the page
// of Allkin cannot read them: the browser hides the refusal behind a blank
// frame. This service reads them for it.
//
//   GET /check?url=<address>&origin=<origin of Allkin>
//     → { frameable: true | false | null, reason, finalUrl, status }
//
// Listens on 127.0.0.1 only: Allkin relays /plugins/web-browser/web/… to it,
// behind its own session. No dependency, nothing written.
import { createServer } from "node:http";

const PORT = Number(process.env.PORT || process.env.PLUGIN_PORT || 9345);
const TIMEOUT_MS = 8000;

/** Whether `origin` may frame a page sending these headers. */
export function framingVerdict(headers, origin) {
  const csp = headers.get("content-security-policy") || "";
  const directive = csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith("frame-ancestors"));
  if (directive) {
    const sources = directive.split(/\s+/).slice(1).map((s) => s.toLowerCase());
    // frame-ancestors wins over X-Frame-Options when both are sent.
    if (sources.includes("*")) return { frameable: true, reason: null };
    const allowed = sources.some((source) => {
      if (source === "'none'" || source === "'self'") return false;
      if (!origin) return false;
      const pattern = source.replace(/\/+$/, "");
      if (pattern === origin) return true;
      if (pattern.includes("*")) {
        const re = new RegExp("^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+") + "$");
        return re.test(origin);
      }
      return false;
    });
    return allowed ? { frameable: true, reason: null } : { frameable: false, reason: "frame-ancestors" };
  }
  const xfo = (headers.get("x-frame-options") || "").trim().toLowerCase();
  if (xfo === "deny" || xfo === "sameorigin") return { frameable: false, reason: "x-frame-options" };
  return { frameable: true, reason: null };
}

async function check(url, origin) {
  let target;
  try {
    target = new URL(url);
  } catch {
    return { frameable: null, reason: "invalid-url" };
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") return { frameable: null, reason: "invalid-url" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(target, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36", Accept: "text/html,*/*" },
    });
    // Only the headers matter: the body is not read.
    res.body?.cancel().catch(() => {});
    return { ...framingVerdict(res.headers, origin), finalUrl: res.url, status: res.status };
  } catch (error) {
    return { frameable: null, reason: controller.signal.aborted ? "timeout" : "unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

const PAGE = {
  en: "This plugin opens websites in tabs of Allkin. Open one from the Tools list, or click a link.",
  fr: "Ce plugin ouvre des sites web dans des onglets d'Allkin. Ouvrez-en un depuis la liste Outils, ou cliquez sur un lien.",
  es: "Este plugin abre sitios web en pestañas de Allkin. Abre uno desde la lista Herramientas o haz clic en un enlace.",
  de: "Dieses Plugin öffnet Websites in Tabs von Allkin. Öffnen Sie eine über die Werkzeugliste oder klicken Sie auf einen Link.",
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (url.pathname === "/check") {
    const result = await check(url.searchParams.get("url") || "", url.searchParams.get("origin") || "");
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify(result));
    return;
  }
  if (url.pathname === "/") {
    const lang = (req.headers["accept-language"] || "en").slice(0, 2).toLowerCase();
    const text = PAGE[lang] || PAGE.en;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>body{font:15px system-ui,sans-serif;margin:2rem;color:#334}@media (prefers-color-scheme:dark){body{background:#232529;color:#dde}}</style><p>${text}</p>`);
    return;
  }
  res.writeHead(404).end();
});

server.listen(PORT, "127.0.0.1", () => console.log(`[web-browser] listening on 127.0.0.1:${PORT}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
