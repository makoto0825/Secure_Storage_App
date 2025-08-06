import socket
from .utils.storage_server import get_local_ip
from decouple import config

# Sends a DELETE request to the file socket server with file name and user_id.
# Server checks whether the user owns the file before deletion.
def delete_file_on_server(file_name: str, user_id: str) -> bool:  
    server_host = config("SERVER_HOST", default=get_local_ip(socket))
    port = 5001

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))
            command = f"DELETE:{file_name}|{user_id}"
            print(f"🚨 Sending DELETE:{file_name}|{user_id} to socket server")
            client_socket.sendall(command.encode())

            response = client_socket.recv(1024)
            return response == b'DELETE_OK'
    except Exception as e:
        print(f"[Delete Error] {e}")
        return False