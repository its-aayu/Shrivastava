from pydantic import BaseModel


class UploadData(BaseModel):
    filename: str            # stored (UUID-prefixed) filename
    original_filename: str
    path: str                # absolute path on server
    size: int                # bytes
    content_type: str


class UploadResponse(BaseModel):
    success: bool = True
    message: str
    data: UploadData
