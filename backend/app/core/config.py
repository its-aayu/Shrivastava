from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = ""
    SECRET_KEY: str = "dev-secret-key-replace-in-production"
    OPENAI_API_KEY: str = ""
    DEBUG: bool = True
    # Stored as comma-separated string to avoid pydantic-settings JSON-decoding List[str]
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    def get_allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


settings = Settings()
