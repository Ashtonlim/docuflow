from pathlib import Path

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the path to the directory where this Python file is located
current_file_dir = Path(__file__).resolve().parent
dotenv_path = current_file_dir / '.env'
print(dotenv_path, 'dotenv_path')


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=dotenv_path,
        extra='ignore',
    )
    DATABASE_URL: PostgresDsn
    DB_ECHO: bool = False
