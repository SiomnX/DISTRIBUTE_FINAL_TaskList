# app.py
from flask import Flask, request, jsonify
from routes.assignment import assignment_bp
from config import Config
from etcd.etcd_client import register_to_etcd
import socket
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import get_jwt_secret   


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
   
    # ★ 一定要用 JWT_SECRET_KEY ★
    app.config['JWT_SECRET_KEY'] = get_jwt_secret()
    
     # ★ 初始化 JWTManager ★
    jwt = JWTManager(app)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # 4️⃣ 註冊你的 assignment blueprint
    app.register_blueprint(assignment_bp)

    # Register service in etcd within app context
    with app.app_context():
        ip = socket.gethostbyname(socket.gethostname())
        register_to_etcd(service_name=app.config["SERVICE_NAME"], ip=ip, port=app.config["SERVICE_PORT"])

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=app.config["SERVICE_PORT"])