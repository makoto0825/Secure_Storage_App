import os
from utils import STORE_DIR

def download_file_from_server(conn, filename):
    """Send requested file contents."""
    file_path = os.path.join(STORE_DIR, filename)
    if os.path.isfile(file_path):
        try:
            with open(file_path, 'rb') as f:
                while True:
                    chunk = f.read(1024)
                    if not chunk:
                        break
                    conn.sendall(chunk)
            conn.sendall(b'END_OF_FILE')
        except Exception:
            conn.sendall(b'ERROR: File read error')
    else:
        conn.sendall(b'ERROR: File not found')