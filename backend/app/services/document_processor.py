"""
Document Processor — text extraction from uploaded files.

Supports:
  PDF  → pypdf (text layer only; scanned PDFs produce empty text)
  PNG/JPG → placeholder; add pytesseract for OCR later
"""

import re
from pathlib import Path


def extract_text_from_file(file_path: str) -> str:
    """Dispatch to the correct extractor based on file extension."""
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        return _extract_pdf(file_path)
    elif suffix in (".png", ".jpg", ".jpeg"):
        return _extract_image(file_path)
    return ""


def _extract_pdf(file_path: str) -> str:
    """Extract text from a PDF using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(file_path)
        pages = [page.extract_text() or "" for page in reader.pages]
        raw = "\n\n".join(p.strip() for p in pages if p.strip())
        return _clean(raw)
    except Exception:
        return ""


def _extract_image(file_path: str) -> str:
    """
    OCR for images — requires pytesseract + Tesseract installed.
    Gracefully returns empty string if not available.
    """
    try:
        from PIL import Image
        import pytesseract
        image = Image.open(file_path)
        return _clean(pytesseract.image_to_string(image))
    except ImportError:
        return ""
    except Exception:
        return ""


def _clean(text: str) -> str:
    """Normalise whitespace without destroying paragraph breaks."""
    text = re.sub(r"[ \t]+", " ", text)          # collapse inline whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)        # max two newlines
    return text.strip()
