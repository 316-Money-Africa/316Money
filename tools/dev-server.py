"""Local dev server for apps/marketing-web with caching disabled, so edits show on a normal refresh."""
import functools, http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "apps", "marketing-web")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4316

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

handler = functools.partial(NoCache, directory=ROOT)
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler).serve_forever()
