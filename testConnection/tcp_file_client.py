import socket

def start_client():
    # Set server address and port
    server_host = 'localhost'  # change to server IP if running on a different machine
    port = 5001
    
    # Create a TCP/IP socket and connect to the server
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_host, port))
    
    # Prompt the user for the file name to request
    file_name = input("Enter the file name to retrieve: ").strip()
    client_socket.send(file_name.encode())
    
    # Open a new file to write the received data
    with open("received_" + file_name, 'wb') as f:
        print("File opened. Receiving data...")
        while True:
            # Receive data in chunks from the server
            data = client_socket.recv(1024)
            if not data:
                # No more data received
                break
            # Check if the end-of-file marker is within the received chunk
            if b'END of file' in data:
                # Remove the marker before writing data to the file
                data = data.replace(b'END of file', b'')
                f.write(data)
                break
            f.write(data)
    
    print("Successfully got the file")
    # Display the received file content (try to decode as text)
    try:
        with open("received_" + file_name, 'rb') as f:
            content = f.read()
            print("===== File Content =====")
            print(content.decode('utf-8'))
            print("===== End of Content =====")
    except Exception as e:
        print("[Binary file or decode error]", e)
    client_socket.close()
    print("Connection closed")

if __name__ == '__main__':
    start_client()
