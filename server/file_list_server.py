# サーバー側 PC
import socket
import os

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('', 5003))
    server_socket.listen(1)
    print("Listening for file list requests...")

    while True:
        conn, addr = server_socket.accept()
        with conn:
            print(f"Connected by {addr}")
            command = conn.recv(1024).decode().strip()
            if command == 'LIST_FILES':
                file_list = os.listdir('store')  # store/ にあるファイル一覧
                data = '\n'.join(file_list).encode() + b'END_OF_LIST'
                conn.sendall(data)

if __name__ == '__main__':
    start_server()