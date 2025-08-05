import jwt
from decouple import config

# Load the secret from environment variables
SUPABASE_JWT_SECRET = config("SUPABASE_JWT_SECRET", default=None)

if SUPABASE_JWT_SECRET is None:
    raise Exception("SUPABASE_JWT_SECRET is not set")

def verify_token(auth_header: str):
    print("✨Starting token verification...")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        print("❌ Invalid or missing Authorization header")
        raise Exception("Invalid authorization header")

    token = auth_header.replace("Bearer ", "")
    print("✨JWT token received:", token)

    try:
        # Decode the token using HS256 algorithm and your Supabase JWT secret
        print("✨Decoding with secret (first 8 bytes):", SUPABASE_JWT_SECRET[:8])
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}  # disable audience verification
        )
        print("✅Decoded payload:", payload)
        return payload
    except jwt.ExpiredSignatureError:
        print("❌Token expired")
        raise Exception("Token has expired")
    except jwt.InvalidTokenError as e:
        print("❌Invalid token:", e)
        raise Exception(f"Invalid token: {e}")