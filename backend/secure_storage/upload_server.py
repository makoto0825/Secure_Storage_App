import socket

def send_file_to_server(file_path, file_name) -> bool:
    server_host = '10.0.0.78'
    port = 5001

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))
            client_socket.send(file_name.encode())

            with open(file_path, 'rb') as f:
                while chunk := f.read(1024):
                    client_socket.send(chunk)

            client_socket.send(b'END of file')

            result = client_socket.recv(1024)
            return result == b'true'  # ✅ 成功なら True を返す

    except Exception as e:
        print(f"[Socket Error] {e}")
        return False
