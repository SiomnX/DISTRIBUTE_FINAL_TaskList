# import os

# # container 
# SERVICE_PORT = int(os.getenv("PORT", 5000))

# # 連db: separate components for psycopg2.connect()
# DB_HOST = os.getenv("DB_HOST", "db")
# DB_PORT = int(os.getenv("DB_PORT", 5432))
# DB_NAME = os.getenv("DB_NAME", "tasklistdb")
# DB_USER = os.getenv("DB_USER", "user")
# DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# # 其他微服務的 url
# NOTIF_URL = os.getenv("NOTIF_URL", "http://notification:5003")
# TASKLIST_URL = os.getenv("TASKLIST_URL", "http://tasklist:5002")

# from etcd.etcd_client import register_to_etcd            
# from etcd.etcd_config import get_database_url, get_jwt_secret  
# from urllib.parse import urlparse
# import os

# SERVICE_PORT = int(os.getenv("PORT", 5000))
# print("here", SERVICE_PORT)
# url = urlparse(get_database_url())
# DB_HOST = url.hostname
# DB_PORT = url.port
# DB_NAME = url.path.lstrip("/")
# DB_USER = url.username
# DB_PASSWORD = url.password

# config.py
import os
from urllib.parse import urlparse
from etcd.etcd_config import get_database_url, get_jwt_secret
from etcd.etcd_client import get_config

class Config:
    """
    Configuration class for Task Assignment Service.
    Reads settings from environment variables and etcd.
    """
    # Service
    SERVICE_NAME = os.getenv("SERVICE_NAME", "task_assignment")
    SERVICE_PORT = int(os.getenv("PORT", 5000))

    # Database
    _db_url = urlparse(get_database_url())
    DB_HOST = _db_url.hostname
    DB_PORT = _db_url.port
    DB_NAME = _db_url.path.lstrip("/")
    DB_USER = _db_url.username
    DB_PASSWORD = _db_url.password

    # JWT
    #JWT_SECRET = get_jwt_secret()
     # ★ 新增 JWT_SECRET ★
    JWT_SECRET_KEY = get_config("/secrets/jwt_secret")
