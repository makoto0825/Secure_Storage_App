def get_local_ip(socket):
    try:
        # This doesn't send data, just forces OS to select the right interface
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Google's DNS, any public IP works
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"  # Fallback
    finally:
        s.close()
    return ip