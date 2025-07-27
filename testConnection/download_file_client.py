import socket

def start_client():
    server_host = '10.111.24.63'
    port = 5001
    
    file_name = input("ダウンロードしたいファイル名を入力してください: ").strip()
    
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_host, port))
    
    # ファイル名を送信
    client_socket.send(file_name.encode())
    
    # サーバーからファイルデータを受信し保存
    with open(file_name, 'wb') as f:
        while True:
            data = client_socket.recv(1024)
            if b'END_OF_FILE' in data:
                data = data.replace(b'END_OF_FILE', b'')
                f.write(data)
                print("ファイルのダウンロードが完了しました。")
                break
            elif b'ERROR:' in data:
                print(data.decode())
                break
            f.write(data)
    client_socket.close()
    print("接続を終了しました。")

if __name__ == '__main__':
    start_client() 