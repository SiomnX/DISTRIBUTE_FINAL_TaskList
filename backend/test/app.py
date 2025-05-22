# backend/test/app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db.database import db
from test.routes.protected import protected_bp
from register.config import Config
from etcd.etcd_config import get_database_url, get_jwt_secret
from etcd.etcd_client import register_to_etcd
import socket

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = get_jwt_secret()

    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_url()
    jwt_secret = get_jwt_secret()
    if jwt_secret:
        app.config["JWT_SECRET_KEY"] = jwt_secret

    CORS(app)
    JWTManager(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # 動態註冊服務到 etcd
        ip = socket.gethostbyname(socket.gethostname())
        register_to_etcd(app.config["SERVICE_NAME"], ip, app.config["PORT"])

    app.register_blueprint(protected_bp, url_prefix="/auth")

    @app.route("/")
    def index():
        return "protected service is running!"

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5002)
