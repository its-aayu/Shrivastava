"""add subcategory and is_new to products

Revision ID: 0003
Revises: 0002
Create Date: 2026-07-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("subcategory", sa.String(), nullable=True))
    op.create_index("ix_products_subcategory", "products", ["subcategory"])

    op.add_column(
        "products",
        sa.Column("is_new", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("ix_products_is_new", "products", ["is_new"])


def downgrade() -> None:
    op.drop_index("ix_products_is_new", table_name="products")
    op.drop_column("products", "is_new")

    op.drop_index("ix_products_subcategory", table_name="products")
    op.drop_column("products", "subcategory")
