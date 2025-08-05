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

    # Return file metadata (name, uploadedAt, uploadedBy, size) as a list
    lines = buffer.decode().splitlines()
    file_list = []

    for line in lines:
        parts = line.split('|')
        if len(parts) != 4:
            continue
        name, uploaded_at, uploaded_by, size = parts
        file_list.append({
            'name': name,
            'uploadedAt': uploaded_at,
            'uploadedBy': uploaded_by,
            'size': size
        })

    return file_list
    
    # Mock data for testing
    # return [
    #     {
    #         "name": "mydoc.txt",
    #         "uploadedAt": "2025-08-04T12:34:56",
    #         "uploadedBy": "Lisa",
    #         "size": "24896"
    #     },
    #     {
    #         "name": "assignment.docx",
    #         "uploadedAt": "2025-08-03T17:00:00",
    #         "uploadedBy": "TestUser",
    #         "size": "10240"
    #     }
    # ]