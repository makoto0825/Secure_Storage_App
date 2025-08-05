# サーバー側 PC
import datetime
import socket
import os
from utils import get_local_ip

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('', 5003))
    server_socket.listen(1)
    server_ip = get_local_ip(socket)
    print(f"Server is listening on IP {server_ip}, port 5003...")

    while True:
        conn, addr = server_socket.accept()
        with conn:
            print(f"Connected by {addr}")
            command = conn.recv(1024).decode().strip()
            if command == 'LIST_FILES':
                file_list = []
                for filename in os.listdir('store'):
                    path = os.path.join('store', filename)
                    size = os.path.getsize(path)
                    uploaded_at = datetime.datetime.fromtimestamp(
                        os.path.getmtime(path)
                    ).isoformat()

                    # Format: name|uploadedAt|size
                    file_list.append(f"{filename}|{uploaded_at}|{size}")

                print("Sending file list with metadata:", file_list)
                data = '\n'.join(file_list).encode() + b'END_OF_LIST'
                conn.sendall(data)

if __name__ == '__main__':
    start_server()