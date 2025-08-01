import socket
import os

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = ''
    port = 5002
    server_socket.bind((host, port))
    server_socket.listen(1)
    print("Server listening....")
    
    while True:
        connection, client_address = server_socket.accept()
        try:
            print("You got connection from", client_address)
            file_name = connection.recv(1024).decode().strip()
            print("Requested file:", file_name)
            file_path = os.path.join("store", file_name)
            if os.path.isfile(file_path):
                try:
                    with open(file_path, 'rb') as f:
                        while True:
                            chunk = f.read(1024)
                            if not chunk:
                                break
                            connection.sendall(chunk)
                    connection.sendall(b'END_OF_FILE')
                    print("File sent successfully.")
                except Exception as e:
                    print("File send error:", e)
                    connection.sendall(b'ERROR: File read error')
            else:
                print("File not found.")
                connection.sendall(b'ERROR: File not found')
        finally:
            connection.close()

if __name__ == '__main__':
    start_server() 