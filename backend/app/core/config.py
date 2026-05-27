from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Database ───────────────────────────────────────────────────────────────
    DATABASE_URL: str = ""

    # ── Auth ───────────────────────────────────────────────────────────────────
    # No default — the app will raise at startup if this is empty in production
    SECRET_KEY: str = "dev-only-secret-change-before-deploy"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # ── AI ─────────────────────────────────────────────────────────────────────
    GROQ_API_KEY: str = ""

    # ── Cloudinary ─────────────────────────────────────────────────────────────
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ── App ────────────────────────────────────────────────────────────────────
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    def get_allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    def is_production(self) -> bool:
        return not self.DEBUG


settings = Settings()
