import socket

def start_server():
    # Create a TCP/IP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # Bind the socket to all available interfaces on a chosen port (e.g., 5001)
    host = ''  # listens on all interfaces
    port = 5001
    server_socket.bind((host, port))
    
    # Listen for incoming connections (max backlog of 1)
    server_socket.listen(1)
    print("Server listening....")
    
    while True:
        # Wait for a connection from a client
        connection, client_address = server_socket.accept()
        try:
            print("You got connection from", client_address)
            
            # Receive the file name from the client (assume file name fits within 1024 bytes)
            file_name = connection.recv(1024).decode().strip()
            print("Server received the file name:", file_name)
            
            try:
                with open("store/" + file_name, 'wb') as f:
                    while True:
                        chunk = connection.recv(1024)
                        if b'END of file' in chunk:
                            chunk = chunk.replace(b'END of file', b'')
                            f.write(chunk)
                            break
                        f.write(chunk)
                # 保存成功
                connection.send(b'true')
            except Exception as e:
                # 保存失敗
                print("保存エラー:", e)
                connection.send(b'false')
        finally:
            # Close the connection to indicate file transfer completion
            connection.close()

if __name__ == '__main__':
    start_server()
