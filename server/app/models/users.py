from sqlmodel import Field, Relationship, SQLModel

# from app.models.docs import Docs

# need to add users so fastapi is aware of tables


class Users(SQLModel, table=True):
    __tablename__ = 'users'  # type: ignore
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    email: str = Field(unique=True)

    # documents: list['Docs'] = Relationship(back_populates='users', cascade_delete=True)
