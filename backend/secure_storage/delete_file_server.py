import socket
import os
import json

def start_server():
    # Starts a socket server that listens for DELETE commands.
    # Deletes the file only if the requesting user_id matches the file's user_id in its metadata.
    
    host = ''
    port = 5004
    store_dir = 'store' # Default location – adjust as needed to match upload path

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print("Delete server listening on port 5004...")

    while True:
        conn, addr = server_socket.accept()
        with conn:
            print(f"Connected by {addr}")
            data = conn.recv(1024).decode().strip()
            if data.startswith("DELETE:"):
                # Expecting format: DELETE:filename|user_id
                parts = data.split("DELETE:")[1].split("|")
                if len(parts) != 2:
                    conn.sendall(b'INVALID_REQUEST')
                    continue
                
                filename, requester_id = parts
                print(f"🧾 DELETE request received for file: {filename} by user: {requester_id}")
                print(f"📄 File owner: {meta.get('user_id')}")

                file_path = os.path.join(store_dir, filename)
                meta_path = file_path + ".meta.json"

                # Check that both file and metadata exist
                if not os.path.exists(file_path) or not os.path.exists(meta_path):
                    conn.sendall(b'NOT_FOUND')
                    continue

                # Load metadata and check if requester is the owner
                with open(meta_path, 'r') as f:
                    meta = json.load(f)
                
                if meta.get("user_id") != requester_id:
                    conn.sendall(b'UNAUTHORIZED')
                    continue

                # Delete file and its metadata
                os.remove(file_path)
                os.remove(meta_path)
                conn.sendall(b'DELETE_OK')

if __name__ == "__main__":
    start_server()
