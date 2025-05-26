import socket

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from task_list.config import Config
from task_list.routes.task import task_bp
from task_list.jwt_setup import jwt
from db.database import db, bind_socketio
from etcd.etcd_client import register_to_etcd
from etcd.etcd_config import get_jwt_secret, get_database_url

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()
    app.config["JWT_SECRET_KEY"] = get_jwt_secret()


    db.init_app(app)
    CORS(app)
    jwt.init_app(app)

    # 初始化 socketio 並綁定
    socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
    bind_socketio(socketio)  # 傳給 database.py

    # 註冊 blueprint
    app.register_blueprint(task_bp)

    # 註冊到 etcd
    with app.app_context():
        service_name = app.config["SERVICE_NAME"]                     # 從環境變數讀取服務名稱
        port = app.config["PORT"]                                     # 服務使用的 port
        ip = socket.gethostbyname(socket.gethostname())               # 自動取得本機 IP（在容器中會是內網 IP）

        # 將服務註冊進 etcd（用於服務發現）
        register_to_etcd(service_name=service_name, ip=ip, port=port)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT)

