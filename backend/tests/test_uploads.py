"""
Upload endpoint security tests.

Verifies: unauthenticated upload is blocked, disallowed file types are rejected,
oversized files are rejected, and MIME-type/magic-byte mismatch is caught.
"""
import io
from tests.conftest import auth_headers, signup_user

# Valid PNG magic bytes (first 8 bytes of any PNG file)
_PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
# Valid JPEG magic bytes
_JPEG_MAGIC = b"\xff\xd8\xff\xe0"
# Valid PDF magic bytes
_PDF_MAGIC = b"%PDF-1.4"


def _user_headers(client):
    signup_user(client, "uploader@test.com")
    return auth_headers(client, "uploader@test.com")


# ── Auth guard ─────────────────────────────────────────────────────────────────

def test_upload_requires_auth(client):
    files = {"file": ("test.png", _PNG_MAGIC + b"\x00" * 20, "image/png")}
    r = client.post("/api/v1/uploads", files=files)
    assert r.status_code == 401


# ── Extension / MIME checks ────────────────────────────────────────────────────

def test_svg_upload_rejected(client):
    """SVG is a script-injection vector — must be rejected at the extension check."""
    headers = _user_headers(client)
    svg_body = b"<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>"
    files = {"file": ("evil.svg", svg_body, "image/svg+xml")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400


def test_exe_upload_rejected(client):
    """Executables must be rejected."""
    headers = _user_headers(client)
    files = {"file": ("virus.exe", b"MZ\x90\x00", "application/octet-stream")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400


def test_html_upload_rejected(client):
    headers = _user_headers(client)
    files = {"file": ("page.html", b"<html/>", "text/html")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400


# ── Size limit ─────────────────────────────────────────────────────────────────

def test_oversized_file_rejected(client):
    """Files over 10 MB must be rejected with 400."""
    headers = _user_headers(client)
    # Valid PNG magic + 10 MB + 1 byte of payload
    big = _PNG_MAGIC + b"\x00" * (10 * 1024 * 1024 + 1)
    files = {"file": ("big.png", big, "image/png")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400


# ── Magic-byte / MIME mismatch ─────────────────────────────────────────────────

def test_magic_byte_mismatch_rejected(client):
    """
    File with PNG magic bytes declared as PDF must be caught by the magic-byte
    validator and rejected — even if extension and MIME would otherwise pass.
    """
    headers = _user_headers(client)
    # Use valid PNG magic bytes but declare the MIME as image/jpeg
    fake = _PNG_MAGIC + b"\x00" * 100
    files = {"file": ("photo.jpg", fake, "image/jpeg")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400


def test_random_bytes_rejected(client):
    """Completely random bytes (no recognised header) must be rejected."""
    headers = _user_headers(client)
    random_bytes = b"\x00\x01\x02\x03\x04\x05garbage"
    files = {"file": ("random.png", random_bytes, "image/png")}
    r = client.post("/api/v1/uploads", files=files, headers=headers)
    assert r.status_code == 400
