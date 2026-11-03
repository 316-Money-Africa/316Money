"""Local dev server for apps/marketing-web with caching disabled, so edits show on a normal refresh."""
import functools, http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "apps", "marketing-web")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4316

def site_headers():
    """The security headers production sends (the /* block of _headers), so a CSP violation shows up here and not only after deploy."""
    out, active = [], False
    try:
        for line in open(os.path.join(ROOT, "_headers"), encoding="utf-8"):
            if not line.strip(): continue
            if not line.startswith((" ", "	")): active = line.strip() == "/*"; continue
            if active and ":" in line: k, v = line.strip().split(":", 1); out.append((k.strip(), v.strip()))
    except OSError: pass
    return out
SITE_HEADERS = site_headers()

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        for k, v in SITE_HEADERS: self.send_header(k, v)
        super().end_headers()

handler = functools.partial(NoCache, directory=ROOT)
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()
