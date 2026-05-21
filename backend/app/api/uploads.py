from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.upload import UploadData, UploadResponse
from app.services.upload_service import save_upload
from app.utils.auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post(
    "",
    response_model=UploadResponse,
    status_code=201,
    summary="Upload a file",
    description=(
        "Accepts PDF, PNG, or JPG files up to 10 MB. "
        "Requires a valid bearer token. "
        "Returns the stored filename, path, size, and MIME type."
    ),
)
async def upload_file(
    file: UploadFile = File(..., description="File to upload (PDF / PNG / JPG, max 10 MB)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    metadata = await save_upload(file)
    return UploadResponse(
        success=True,
        message="File uploaded successfully",
        data=UploadData(**metadata),
    )
