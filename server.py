#!/usr/local/bin/python3

import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

httpd = socketserver.TCPServer(('', PORT), Handler)

print('serving at port', PORT)
print('open http://localhost:{0}/docs/'.format(PORT))

httpd.serve_forever()
