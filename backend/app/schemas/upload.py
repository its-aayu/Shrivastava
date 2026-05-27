from typing import Optional

from pydantic import BaseModel


class UploadData(BaseModel):
    filename: str
    original_filename: str
    path: str                    # Cloudinary secure_url or local abs path
    url: Optional[str] = None    # Cloudinary URL (None for local storage)
    public_id: Optional[str] = None
    size: int
    content_type: str
    storage: str = "local"       # "cloudinary" | "local"


class UploadResponse(BaseModel):
    success: bool = True
    message: str
    data: UploadData
