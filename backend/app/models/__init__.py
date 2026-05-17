# Import all models here so Base.metadata knows about every table.
# create_tables() calls `import app.models` which triggers this file,
# registering all tables before Base.metadata.create_all() runs.

from app.models.product import Product
from app.models.user import User
from app.models.order import Order
from app.models.document import Document
from app.models.chat_history import ChatHistory
from app.models.faq import FAQ

__all__ = ["Product", "User", "Order", "Document", "ChatHistory", "FAQ"]
