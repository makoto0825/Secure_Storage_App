import socket
import json
import os
from decouple import config
from .utils.storage_server import get_local_ip
from cryptography.fernet import Fernet

# Load encryption key from .env
ENCRYPTION_KEY = config("ENCRYPTION_KEY").encode()
fernet = Fernet(ENCRYPTION_KEY)

def encrypt_file(file_path: str) -> bytes:
    """
    Encrypt file using Fernet symmetric encryption.
    """
    with open(file_path, 'rb') as f:
        file_data = f.read()

    encrypted_data = fernet.encrypt(file_data)
    return encrypted_data

def send_file_to_server(file_path, file_name, user_id, username) -> bool:
    server_host = config("SERVER_HOST", default=get_local_ip(socket))
    port = 5001

    safe_filename = os.path.basename(file_name)  # sanitize

    try:
        # Encrypt file before sending
        encrypted_data = encrypt_file(file_path)

        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))

            # Build metadata
            metadata = {
                "action": "UPLOAD",
                "filename": safe_filename,
                "user_id": user_id,
                "uploaded_by": username,
                "updated_by": user_id,
                "uploaded_at": "",
                "size": len(encrypted_data)  # encrypted size
            }

            # Send metadata
            client_socket.sendall((json.dumps(metadata) + "\n").encode())

            # Wait for READY acknowledgment
            ack = client_socket.recv(1024).decode().strip()
            if ack != "READY":
                print(f"[Server Error] Expected READY, got: {ack}")
                return False

            # Send encrypted file
            client_socket.sendall(encrypted_data)
            client_socket.sendall(b'END_OF_FILE')

            # Confirmation
            result = client_socket.recv(1024)
            return result == b'true'

    except Exception as e:
        print(f"[Socket Error] {e}")
        return False
