import os
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
    ext = Path(original).suffix.lower()
    stem = Path(original).stem
    safe_stem = "".join(c if c.isalnum() or c in "-_" else "_" for c in stem)[:60]
    return f"{uuid.uuid4().hex}_{safe_stem}{ext}"


def _cloudinary_configured() -> bool:
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )


def _upload_to_cloudinary(contents: bytes, original_filename: str, content_type: str) -> dict:
    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True,
    )

    safe_name = generate_safe_filename(original_filename)
    public_id = f"aayu-uploads/{Path(safe_name).stem}"

    # resource_type "auto" handles PDFs and images correctly
    result = cloudinary.uploader.upload(
        contents,
        public_id=public_id,
        resource_type="auto",
        use_filename=False,
        overwrite=False,
    )

    return {
        "filename": safe_name,
        "original_filename": original_filename,
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "path": result["secure_url"],  # kept for backwards compat
        "size": result.get("bytes", len(contents)),
        "content_type": content_type,
        "storage": "cloudinary",
    }


def _upload_local(contents: bytes, original_filename: str, content_type: str) -> dict:
    safe_name = generate_safe_filename(original_filename)
    dest = UPLOADS_DIR / safe_name
    dest.write_bytes(contents)

    return {
        "filename": safe_name,
        "original_filename": original_filename,
        "url": None,
        "path": str(dest),
        "size": len(contents),
        "content_type": content_type,
        "storage": "local",
    }


async def save_upload(file: UploadFile) -> dict:
    """
    Validate file type/size, then:
    - If Cloudinary env vars are set: upload to Cloudinary (production-ready)
    - Otherwise: save to local uploads/ directory (dev fallback)
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

    if _cloudinary_configured():
        try:
            return _upload_to_cloudinary(contents, file.filename, file.content_type)
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Cloudinary upload failed: {exc}",
            )

    return _upload_local(contents, file.filename, file.content_type)
