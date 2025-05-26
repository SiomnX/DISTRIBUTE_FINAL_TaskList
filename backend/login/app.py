import socket

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from login.config import Config
from login.routes.login import login_bp
from login import jwt_setup as jwt
from db.database import db
from etcd.etcd_client import register_to_etcd
from etcd.etcd_config import get_jwt_secret, get_database_url

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = get_jwt_secret()
    app.config['SQLALCHEMY_DATABASE_URI'] = get_database_url()


    CORS(app)
    JWTManager(app)
    db.init_app(app)

    with app.app_context():
        service_name = app.config["SERVICE_NAME"]                     # 從環境變數讀取服務名稱
        port = app.config["PORT"]                                     # 服務使用的 port
        ip = socket.gethostbyname(socket.gethostname())               # 自動取得本機 IP（在容器中會是內網 IP）

        # 將服務註冊進 etcd（用於服務發現）
        register_to_etcd(service_name=service_name, ip=ip, port=port)

    app.register_blueprint(login_bp, url_prefix="/auth")

    @app.route("/")
    def index():
        return "login service is running!"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001)
