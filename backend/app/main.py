from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Task
from cache import redis_cache
from security import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from schema import TaskCreate, TaskUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/tasks/")
def add_task(task: TaskCreate,  db: Session = Depends(get_db)):
    if not task.title:
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    new_task = Task(title=task.title, description=task.description, status=task.status) #Alterar aqui
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    # redis_cache.set(f"task:{new_task.id}", new_task)
    return new_task

@app.get("/tasks/")
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks

@app.put("/tasks/{task_id}")
def update_task_status(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = task_update.status
    db.commit()
    # redis_cache.set(f"task:{task.id}", task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    # redis_cache.delete(f"task:{task.id}")
    return {"detail": "Task deleted"}

@app.get("/")
def index():
    return {"status": "api is running"}