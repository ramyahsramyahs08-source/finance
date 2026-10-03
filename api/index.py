import sys
import os
import urllib.parse

# Set root and backend paths
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app

flask_app = create_app()

def app(environ, start_response):
    query = environ.get('QUERY_STRING', '')
    if query:
        params = urllib.parse.parse_qs(query, keep_blank_values=True)
        if '__path__' in params:
            subpath = params['__path__'][0].strip()
            other_params = {k: v for k, v in params.items() if k != '__path__'}
            environ['QUERY_STRING'] = urllib.parse.urlencode(other_params, doseq=True)
            
            if not subpath or subpath in ('api/index.py', 'index.py'):
                environ['PATH_INFO'] = '/'
            else:
                environ['PATH_INFO'] = '/' + subpath.lstrip('/')

    if environ.get('PATH_INFO') in ('/api/index.py', '/api/index.py/', '/index.py'):
        environ['PATH_INFO'] = '/'

    return flask_app(environ, start_response)
