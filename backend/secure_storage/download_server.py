import socket

def download_server(file_name: str) -> bytes:
    server_host = '10.0.0.78'
    port = 5001
    file_data = b''

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
        client_socket.connect((server_host, port))
        client_socket.send(file_name.encode())

        while True:
            chunk = client_socket.recv(1024)
            if b'END_OF_FILE' in chunk:
                file_data += chunk.replace(b'END_OF_FILE', b'')
                break
            elif b'ERROR:' in chunk:
                raise Exception(chunk.decode())
            file_data += chunk

    return file_data
