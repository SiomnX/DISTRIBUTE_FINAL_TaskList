import os

class Config:
    # 從環境變數中讀取 etcd 的 endpoint，預設為 etcd1、etcd2、etcd3 的 2379 port
    # 用來做設定管理或服務註冊
    ETCD_ENDPOINTS = os.getenv("ETCD_ENDPOINTS", "etcd1:2379,etcd2:2379,etcd3:2379").split(",")

    # 設定目前的運行環境（例如 development、production）
    # FLASK_ENV 可由 .env 或外部注入設定
    ENV = os.getenv("FLASK_ENV", "production")

    # Flask 執行時要使用的 port（預設 5000）
    PORT = int(os.getenv("FLASK_RUN_PORT", 5000))

    # 關閉 SQLAlchemy 的物件變更追蹤功能（節省記憶體用）
    SQLALCHEMY_TRACK_MODIFICATIONS = False

