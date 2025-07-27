import socket

def start_client():
    server_host = '10.111.24.63'
    port = 5001

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_host, port))

    file_name = input("送信したいファイル名を入力してください: ").strip()
    client_socket.send(file_name.encode())

    # ファイルを開いてサーバーに送信
    try:
        with open(file_name, 'rb') as f:
            while True:
                chunk = f.read(1024)
                if not chunk:
                    break
                client_socket.send(chunk)
        # 送信終了マーカー
        client_socket.send(b'END of file')
        print("ファイル送信完了")
    except Exception as e:
        print("ファイル送信エラー:", e)

    # サーバーから保存結果を受信
    result = client_socket.recv(1024)
    if result == b'true':
        print("サーバー側でファイルが正しく保存されました。")
    else:
        print("サーバー側でファイルの保存に失敗しました。")

    client_socket.close()
    print("Connection closed")

if __name__ == '__main__':
    start_client()
