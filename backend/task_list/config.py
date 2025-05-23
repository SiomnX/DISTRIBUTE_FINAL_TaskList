import os

class Config:
    SERVICE_NAME = os.getenv("SERVICE_NAME", "task_list")
    PORT = int(os.getenv("PORT", 5003))
    DATABASE_URL = os.getenv("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'postgresql://user:password@db:5432/tasklistdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

