from sqlmodel import Field, SQLModel


class Users(SQLModel, table=True):
    __tablename__ = 'users'  # type: ignore
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    email: str = Field(unique=True)
