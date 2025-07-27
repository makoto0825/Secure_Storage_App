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
                # Open the requested file in binary read mode
                with open(file_name, 'rb') as f:
                    file_content = f.read()
                    # Display file content (try to decode binary to text)
                    try:
                        print("===== File Content =====")
                        print(file_content.decode('utf-8'))
                        print("===== End of Content =====")
                    except Exception as e:
                        print("[Binary file or decode error]", e)
                    # Send file (original logic)
                    f.seek(0)
                    chunk = f.read(1024)
                    while chunk:
                        connection.send(chunk)
                        chunk = f.read(1024)
                # After file transfer, send an end-of-file marker
                connection.send(b'END of file')
                print("You finished to send the file.")
            except Exception as e:
                # If the file cannot be opened, send an error message
                error_msg = "Error: File not found or cannot be opened."
                connection.send(error_msg.encode())
                print("Error sending file:", e)
        finally:
            # Close the connection to indicate file transfer completion
            connection.close()

if __name__ == '__main__':
    start_server()
