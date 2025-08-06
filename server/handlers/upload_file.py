import os
import json
from datetime import datetime
from utils import STORE_DIR

def upload_file_to_server(conn, filename, metadata):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(STORE_DIR, safe_filename)
    meta_path = os.path.join(STORE_DIR, safe_filename + ".meta.json")

    try:
        os.makedirs(STORE_DIR, exist_ok=True)

        # Receive file data
        with open(file_path, 'wb') as f:
            while True:
                chunk = conn.recv(1024)
                if b'END_OF_FILE' in chunk:
                    chunk = chunk.replace(b'END_OF_FILE', b'')
                    f.write(chunk)
                    break
                f.write(chunk)

        # Add timestamp server-side
        metadata["uploadedAt"] = datetime.utcnow().isoformat()

        # Save metadata
        with open(meta_path, 'w') as meta_f:
            json.dump(metadata, meta_f)

        conn.sendall(b'true')

    except Exception as e:
        print("Upload error:", e)
        conn.sendall(b'false')
