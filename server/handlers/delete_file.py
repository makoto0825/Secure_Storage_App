import json
import os
from utils import STORE_DIR

def delete_file_from_server(conn, filename, requester_id):
    """Delete file if user is authorized."""
    file_path = os.path.join(STORE_DIR, filename)
    meta_path = file_path + ".meta.json"

    if not os.path.exists(file_path) or not os.path.exists(meta_path):
        conn.sendall(b'NOT_FOUND')
        return

    with open(meta_path, 'r') as f:
        meta = json.load(f)

    if meta.get("user_id") != requester_id:
        conn.sendall(b'UNAUTHORIZED')
        return

    os.remove(file_path)
    os.remove(meta_path)
    conn.sendall(b'DELETE_OK')