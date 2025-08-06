import socket
from .utils.storage_server import get_local_ip
from decouple import config
from cryptography.fernet import Fernet

# Load the same key used for encryption (must match client upload)
ENCRYPTION_KEY = config("ENCRYPTION_KEY").encode()
fernet = Fernet(ENCRYPTION_KEY)

def download_server(file_name: str) -> bytes:
    server_host = config("SERVER_HOST", default=get_local_ip(socket))
    port = 5001
    file_data = b''

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
        client_socket.connect((server_host, port))
        client_socket.send(f"GET_FILE:{file_name}".encode())

        while True:
            chunk = client_socket.recv(1024)
            if b'END_OF_FILE' in chunk:
                file_data += chunk.replace(b'END_OF_FILE', b'')
                break
            elif b'ERROR:' in chunk:
                raise Exception(chunk.decode())
            file_data += chunk

    # Decrypt the received file data before returning
    try:
        decrypted_data = fernet.decrypt(file_data)
        return decrypted_data
    except Exception as e:
        raise Exception(f"Decryption failed: {e}")
