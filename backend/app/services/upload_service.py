import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def _validate_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' is not allowed. Accepted: {allowed}",
        )
    return ext


def _validate_mime_type(content_type: str) -> None:
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"MIME type '{content_type}' is not allowed.",
        )


def generate_safe_filename(original: str) -> str:
    """Prefix original name with a UUID hex to prevent collisions and path traversal."""
    ext = Path(original).suffix.lower()
    stem = Path(original).stem
    safe_stem = "".join(c if c.isalnum() or c in "-_" else "_" for c in stem)[:60]
    return f"{uuid.uuid4().hex}_{safe_stem}{ext}"


async def save_upload(file: UploadFile) -> dict:
    """
    Validate file type/size, persist to uploads/, return metadata.
    Raises HTTP 400 for invalid files.
    """
    _validate_extension(file.filename)
    _validate_mime_type(file.content_type)

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE // (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds the {max_mb} MB size limit.",
        )

    safe_name = generate_safe_filename(file.filename)
    dest = UPLOADS_DIR / safe_name
    dest.write_bytes(contents)

    return {
        "filename": safe_name,
        "original_filename": file.filename,
        "path": str(dest),
        "size": len(contents),
        "content_type": file.content_type,
    }
