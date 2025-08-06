import socket
import json
import os
from decouple import config
from .utils.storage_server import get_local_ip

def send_file_to_server(file_path, file_name, user_id, username) -> bool:
    server_host = config("SERVER_HOST", default=get_local_ip(socket))
    port = 5001

    safe_filename = os.path.basename(file_name)  # sanitize

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))

            # Build metadata
            metadata = {
                "action": "UPLOAD",
                "filename": safe_filename,
                "user_id": user_id,
                "uploaded_by": username,
                "updated_by": user_id,  # Initially same as uploader
                "uploaded_at": "",  # Let server set timestamp
                "size": os.path.getsize(file_path)
            }

            # Send metadata as JSON
            client_socket.sendall((json.dumps(metadata) + "\n").encode())

            # Wait for READY acknowledgment
            ack = client_socket.recv(1024).decode().strip()
            if ack != "READY":
                print(f"[Server Error] Expected READY, got: {ack}")
                return False

            # Stream file content
            with open(file_path, 'rb') as f:
                while chunk := f.read(1024):
                    client_socket.sendall(chunk)

            # End marker
            client_socket.sendall(b'END_OF_FILE')

            # Confirmation
            result = client_socket.recv(1024)
            return result == b'true'

    except Exception as e:
        print(f"[Socket Error] {e}")
        return False
