import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.schemas.upload import UploadData, UploadResponse
from app.services.upload_service import save_upload
from app.utils.auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])


def _ingest(doc_id: str, file_path: str, metadata: dict) -> None:
    """Background task — runs after the upload response is already sent."""
    try:
        from app.services.rag_service import ingest_document
        result = ingest_document(doc_id=doc_id, file_path=file_path, metadata=metadata)
        print(f"[ingestion] {doc_id}: {result['status']} — {result.get('chunks', 0)} chunks")
    except Exception as exc:
        print(f"[ingestion] {doc_id}: failed — {exc}")


@router.post(
    "",
    response_model=UploadResponse,
    status_code=201,
    summary="Upload a file",
    description=(
        "Accepts PDF, PNG, or JPG files up to 10 MB. "
        "Requires a valid bearer token. "
        "After upload the file is ingested into the RAG pipeline in the background."
    ),
)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="PDF / PNG / JPG, max 10 MB"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    metadata = await save_upload(file)

    # Unique doc_id for the vector store — scoped to this upload
    doc_id = f"upload_{uuid.uuid4().hex[:12]}"
    background_tasks.add_task(
        _ingest,
        doc_id,
        metadata["path"],
        {
            "original_filename": metadata["original_filename"],
            "content_type": metadata["content_type"],
            "uploaded_by": getattr(current_user, "id", "unknown"),
        },
    )

    return UploadResponse(
        success=True,
        message="File uploaded and queued for AI ingestion",
        data=UploadData(**metadata),
    )
