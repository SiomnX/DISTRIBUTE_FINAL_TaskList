# from flask import Flask
# from routes.assignment import assignment_bp
# from config import SERVICE_PORT
# from etcd.etcd_client import register_to_etcd


# app = Flask(__name__)
# app.register_blueprint(assignment_bp)


# if __name__ == "__main__":
    
#     app.run(host="0.0.0.0", port=SERVICE_PORT)
# app.py
from flask import Flask, request, jsonify
from routes.assignment import assignment_bp
from config import Config
from etcd.etcd_client import register_to_etcd
import socket


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.register_blueprint(assignment_bp)

    # Register service in etcd within app context
    with app.app_context():
        ip = socket.gethostbyname(socket.gethostname())
        register_to_etcd(service_name=app.config["SERVICE_NAME"], ip=ip, port=app.config["SERVICE_PORT"])

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=app.config["SERVICE_PORT"])