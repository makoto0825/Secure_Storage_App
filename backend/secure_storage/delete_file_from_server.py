import socket

# Sends a DELETE request to the file socket server with file name and user_id.
# Server checks whether the user owns the file before deletion.
def delete_file_on_server(file_name: str, user_id: str) -> bool:  
    server_host = '10.0.0.78'
    port = 5004

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
            client_socket.connect((server_host, port))
            command = f"DELETE:{file_name}|{user_id}"
            print(f"🚨 Sending DELETE:{file_name}|{user_id} to socket server")
            client_socket.sendall(command.encode())

            response = client_socket.recv(1024)
            return response == b'DELETE_OK'
    except Exception as e:
        print(f"[Delete Error] {e}")
        return False

    print(f"[SIMULATION] Pretending to delete '{file_name}' for user '{user_id}'")

    # Testing
    # Simulate success for correct user
    # if user_id == "45648985-8a4f-4790-bcff-f0b13eeb538f":
    #     return True
    # else:
    #     return False