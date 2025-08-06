from .utils.storage_server import get_local_ip
from decouple import config

def get_file_list_from_server() -> list:
    import socket

    server_host = config("SERVER_HOST", default=get_local_ip(socket))
    port = 5001
    print(f"Connecting to server at {server_host}:{port} to get file list...")

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
        client_socket.connect((server_host, port))
        client_socket.sendall(b'LIST_FILES')  # 要求コマンド

        buffer = b''
        while True:
            chunk = client_socket.recv(1024)
            if b'END_OF_LIST' in chunk:
                buffer += chunk.replace(b'END_OF_LIST', b'')
                break
            buffer += chunk

    # Return file metadata (name, uploadedAt, size) as a list
    lines = buffer.decode().splitlines()
    print("Received file list from server:", lines)
    file_list = []

    for line in lines:
        parts = line.split('|')
        print("File metadata parts:", parts)
        if len(parts) != 4:
            continue
        name, uploaded_at, size, uploaded_by = parts
        file_list.append({
            'name': name,
            'uploadedAt': uploaded_at,
            'uploadedBy': uploaded_by,
            'size': size
        })

    return file_list