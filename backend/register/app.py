import os
import socket
from flask import Flask
from flask_cors import CORS
from register.config import Config                     
from register.routes.auth import auth_bp               
from backend.db.model import db                                    
from etcd.etcd_client import register_to_etcd            
from etcd.etcd_config import get_database_url, get_jwt_secret  

# 建立並設定好 Flask 應用程式
def create_app():
    app = Flask(__name__)

    # 使用 config.py 的設定值作為基礎
    app.config.from_object(Config)
    
    # 使用 etcd 拿到的參數動態設定資料庫連線與 JWT 金鑰
    app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
    app.config['JWT_SECRET'] = get_jwt_secret()

    # 允許跨來源請求（跨網域）
    CORS(app)

    # 初始化 SQLAlchemy 資料庫
    db.init_app(app)

    # 在 app context 中註冊服務並建立資料表
    with app.app_context():
        service_name = app.config["SERVICE_NAME"]                     # 從環境變數讀取服務名稱
        port = app.config["PORT"]                                     # 服務使用的 port
        ip = socket.gethostbyname(socket.gethostname())               # 自動取得本機 IP（在容器中會是內網 IP）

        # 將服務註冊進 etcd（用於服務發現）
        register_to_etcd(service_name=service_name, ip=ip, port=port)

        # 根據 model 自動建立資料表（如果尚未建立）
        db.create_all()

    # 註冊 Blueprint 處理 /auth 路由
    app.register_blueprint(auth_bp, url_prefix="/auth")

    # 根目錄路由（測試用）
    @app.route("/")
    def index():
        return " user_service is running!"

    return app

# 如果是用 `python app.py` 執行，則啟動伺服器
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)

