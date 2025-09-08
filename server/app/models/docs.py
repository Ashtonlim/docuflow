from sqlmodel import Field, SQLModel


class Docs(SQLModel, table=True):
	__tablename__ = 'documents'
	id: int | None = Field(default=None, primary_key=True)
	num_pages: int = Field()
	file_name: str | None = Field(default=None)
	file_path: str = Field(unique=True)
