from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: str = None
    status: bool

class TaskUpdate(BaseModel):
    status: bool