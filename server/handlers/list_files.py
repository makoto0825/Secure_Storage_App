import datetime
import os
import json
from utils import STORE_DIR

def list_files_from_server(conn):
    """Send list of files with metadata (includes user_id if available)."""
    file_list = []
    for filename in os.listdir(STORE_DIR):
        # Skip hidden files and .meta.json files themselves
        if filename.startswith('.') or filename.endswith('.meta.json'):
            continue

        path = os.path.join(STORE_DIR, filename)
        size = os.path.getsize(path)
        uploaded_at = datetime.datetime.fromtimestamp(
            os.path.getmtime(path)
        ).isoformat()

        # Try to load uploaded_by from meta.json
        meta_path = path + ".meta.json"
        uploaded_by = "unknown"
        if os.path.exists(meta_path):
            try:
                with open(meta_path, 'r') as meta_file:
                    meta = json.load(meta_file)
                    uploaded_by = meta.get("uploaded_by", "unknown")
            except Exception:
                pass  # If meta is malformed, fallback to unknown

        # Format: name|uploadedAt|size|uploaded_by
        file_list.append(f"{filename}|{uploaded_at}|{size}|{uploaded_by}")

    # Send the formatted list
    conn.sendall('\n'.join(file_list).encode() + b'END_OF_LIST')
