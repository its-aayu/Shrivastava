"""
Seed the VELORA STUDIO knowledge base into ChromaDB.

Run once (or re-run to refresh) from the backend/ directory:
    python seed_knowledge.py

The document is stored with doc_id="velora_knowledge_base" so re-running
replaces the old chunks cleanly without duplication.
"""

import sys
from pathlib import Path

KNOWLEDGE_FILE = Path(__file__).parent.parent / "app" / "data" / "aayu_knowledge.txt"
DOC_ID = "velora_knowledge_base"


def main():
    if not KNOWLEDGE_FILE.exists():
        print(f"ERROR: Knowledge file not found at {KNOWLEDGE_FILE}")
        sys.exit(1)

    print(f"Reading knowledge base from {KNOWLEDGE_FILE} ...")
    text = KNOWLEDGE_FILE.read_text(encoding="utf-8")
    print(f"  {len(text)} characters loaded.")

    # Chunk the document
    from app.services.rag_service import chunk_document
    chunks = chunk_document(text, chunk_size=400, overlap=40)
    print(f"  {len(chunks)} chunks created.")

    # Store in ChromaDB (replaces any existing chunks for this doc_id)
    from app.services.chroma_service import add_chunks
    metadata = {
        "source": "velora_knowledge_base.txt",
        "uploaded_by": "system",
        "doc_type": "knowledge_base",
    }
    stored = add_chunks(DOC_ID, chunks, metadata)
    print(f"  {stored} chunks stored in ChromaDB under doc_id='{DOC_ID}'.")
    print("Done. The chatbot can now answer questions about VELORA STUDIO.")


if __name__ == "__main__":
    main()
