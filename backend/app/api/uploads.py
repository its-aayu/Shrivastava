import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, File, Request, UploadFile
from sqlalchemy.orm import Session

from app.core.limiter import limiter
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
        "Admin uploads are also ingested into the RAG knowledge base."
    ),
)
@limiter.limit("10/minute")
async def upload_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="PDF / PNG / JPG, max 10 MB"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    metadata = await save_upload(file)

    is_admin = getattr(current_user, "role", "") == "admin"

    # Only admin-uploaded files are ingested into the RAG knowledge base.
    # Customer artwork uploads are saved but never injected into the AI context
    # to prevent knowledge-base poisoning.
    if is_admin and metadata.get("path"):
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

    msg = (
        "File uploaded and queued for AI ingestion"
        if is_admin
        else "File uploaded successfully"
    )
    return UploadResponse(
        success=True,
        message=msg,
        data=UploadData(**metadata),
    )
