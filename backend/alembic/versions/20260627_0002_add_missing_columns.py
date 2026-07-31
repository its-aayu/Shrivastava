"""add missing order and document columns

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-27

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── orders: add columns added after initial create_all() ──────────────────
    op.add_column("orders", sa.Column("subtotal", sa.Integer(), nullable=True))
    op.add_column("orders", sa.Column("gst", sa.Integer(), nullable=True))
    op.add_column("orders", sa.Column("customer_name", sa.String(), nullable=True))
    op.add_column("orders", sa.Column("customer_email", sa.String(), nullable=True))
    op.add_column("orders", sa.Column("customer_phone", sa.String(), nullable=True))
    op.add_column("orders", sa.Column("customer_city", sa.String(), nullable=True))
    op.add_column("orders", sa.Column("razorpay_order_id", sa.String(), nullable=True))
    op.add_column("orders", sa.Column("razorpay_payment_id", sa.String(), nullable=True))
    # NOT NULL with server_default so existing rows get a value
    op.add_column("orders", sa.Column("payment_status", sa.String(), nullable=False, server_default="unpaid"))

    # ── documents: add columns added after initial create_all() ───────────────
    op.add_column("documents", sa.Column("file_path", sa.String(), nullable=True))
    op.add_column("documents", sa.Column("file_size", sa.BigInteger(), nullable=True))
    op.add_column("documents", sa.Column("mime_type", sa.String(), nullable=True))
    op.add_column("documents", sa.Column("uploaded_by", sa.String(), nullable=True))
    op.add_column("documents", sa.Column("created_at", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("documents", "created_at")
    op.drop_column("documents", "uploaded_by")
    op.drop_column("documents", "mime_type")
    op.drop_column("documents", "file_size")
    op.drop_column("documents", "file_path")

    op.drop_column("orders", "payment_status")
    op.drop_column("orders", "razorpay_payment_id")
    op.drop_column("orders", "razorpay_order_id")
    op.drop_column("orders", "customer_city")
    op.drop_column("orders", "customer_phone")
    op.drop_column("orders", "customer_email")
    op.drop_column("orders", "customer_name")
    op.drop_column("orders", "gst")
    op.drop_column("orders", "subtotal")
