from flask import Flask
from flask_cors import CORS
from task_list.config import Config
from db.database import db
from task_list.routes.task import task_bp
from etcd.etcd_client import register_to_etcd
from etcd.etcd_config import get_jwt_secret
from task_list.jwt_setup import jwt
import socket

app = Flask(__name__)
app.config.from_object(Config)

jwt_secret = get_jwt_secret()
if jwt_secret:
    app.config["JWT_SECRET_KEY"] = jwt_secret

db.init_app(app)
CORS(app)
jwt.init_app(app)

# 註冊 blueprint
app.register_blueprint(task_bp)

# 註冊到 etcd
def register_service():
    service_name = "task_list"
    port = Config.PORT
    ip = socket.gethostbyname(socket.gethostname())
    register_to_etcd(service_name=service_name, ip=ip, port=port)

register_service()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT)

