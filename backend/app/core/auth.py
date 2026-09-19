import hashlib
import hmac
import base64
import json
import time
from typing import Optional

from fastapi import Cookie, HTTPException, status

from app.core.config import settings

SESSION_MAX_AGE = 60 * 60 * 24 * 7


def hash_password(password: str) -> str:
    salt = hashlib.sha256(f"{settings.JWT_SECRET_KEY}:campuscart".encode()).digest()[:16]
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000)
    return base64.urlsafe_b64encode(digest).decode()


def verify_password(password: str, stored_hash: str) -> bool:
    return hmac.compare_digest(hash_password(password), stored_hash or "")


def create_session_token(user_id: str, email: str, name: str | None = None) -> str:
    payload = {"sub": user_id, "email": email, "name": name or "Verified Student", "exp": int(time.time()) + SESSION_MAX_AGE}
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(settings.JWT_SECRET_KEY.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{signature}"


def decode_session_token(token: str) -> Optional[dict]:
    try:
        raw, signature = token.split(".", 1)
        expected = hmac.new(settings.JWT_SECRET_KEY.encode(), raw.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        padded = raw + "=" * (-len(raw) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded).decode())
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return payload
    except (ValueError, TypeError, json.JSONDecodeError, UnicodeDecodeError):
        return None


async def get_current_user(session: Optional[str] = Cookie(default=None, alias="campuscart_session")):
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    payload = decode_session_token(session)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    return payload
