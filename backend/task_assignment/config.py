import os

# container 
SERVICE_PORT = int(os.getenv("PORT", 5000))

# 連db: separate components for psycopg2.connect()
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "tasklistdb")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# 其他微服務的 url
NOTIF_URL = os.getenv("NOTIF_URL", "http://notification:5003")
TASKLIST_URL = os.getenv("TASKLIST_URL", "http://tasklist:5002")
