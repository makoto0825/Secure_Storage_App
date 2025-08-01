# utils.py など
def get_file_list_from_server() -> list:
    import socket

    server_host = '10.0.0.78'
    port = 5003

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

    return buffer.decode().splitlines()  # 改行区切りのファイル名リストとして返す
