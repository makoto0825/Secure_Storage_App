import socket
from django.views.decorators.csrf import csrf_exempt
import json
import os

def send_file_to_server(file_path, file_name, user_id, username) -> bool:
# Sends the file to the file storage socket server (port 5001) along with metadata.
# Metadata includes: filename, user_id (owner), uploadedBy, uploadedAt (empty), size.
    
    server_host = '10.0.0.78'
    port = 5001

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))

            # 1. Prepare metadata
            metadata = {
                "filename": file_name,
                "user_id": user_id, # Supabase UID
                "uploadedBy": username,
                "uploadedAt": "",  # Let server set actual timestamp
                "size": os.path.getsize(file_path)
            }
            
            # 2. Send metadata as newline-terminated JSON
            client_socket.sendall((json.dumps(metadata) + "\n").encode())
            
            # 3. Send raw file content
            with open(file_path, 'rb') as f:
                while chunk := f.read(1024):
                    client_socket.sendall(chunk)

            # 4. Signal end of file
            client_socket.sendall(b'END of file')

            # 5. Wait for confirmation from the server
            result = client_socket.recv(1024)
            return result == b'true'

    except Exception as e:
        print(f"[Socket Error] {e}")
        return False


