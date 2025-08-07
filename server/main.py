import json
import socket
from utils import get_local_ip
from handlers.list_files import list_files_from_server
from handlers.download_file import download_file_from_server
from handlers.upload_file import upload_file_to_server
from handlers.delete_file import delete_file_from_server

PORT = 5001

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('', PORT))
    server_socket.listen(1)
    server_ip = get_local_ip(socket)
    print(f"Server is listening on IP {server_ip}, port {PORT}...")

    while True:
        conn, addr = server_socket.accept()
        with conn:
            print(f"Connected by {addr}")
            command = conn.recv(1024).decode().strip()

            # Command routing
            if command == 'LIST_FILES':
                list_files_from_server(conn)

            elif command.startswith('GET_FILE:'):
                print("Download request received.")
                filename = command.split('GET_FILE:')[1]
                download_file_from_server(conn, filename)

            elif command.startswith('DELETE:'):
                parts = command.split('DELETE:')[1].split('|')
                if len(parts) == 2:
                    filename, requester_id = parts
                    delete_file_from_server(conn, filename, requester_id)
                else:
                    conn.sendall(b'INVALID_REQUEST')
            elif command.startswith('{'):  # UPLOAD command is JSON
                try:
                    metadata = json.loads(command)
                    if metadata.get("action") == "UPLOAD":
                        filename = metadata["filename"]
                        conn.sendall(b'READY')  # handshake
                        upload_file_to_server(conn, filename, metadata)
                    else:
                        conn.sendall(b'UNKNOWN_ACTION')
                except json.JSONDecodeError:
                    conn.sendall(b'INVALID_JSON')
            else:
                conn.sendall(b'UNKNOWN_COMMAND')


if __name__ == '__main__':
    start_server()