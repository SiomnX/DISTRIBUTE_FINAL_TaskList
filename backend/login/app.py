# DISTRIBUTE_FINAL\backend\login\app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db.database import db
from login.routes.login import login_bp
from login import jwt_setup as jwt
from etcd.etcd_config import get_jwt_secret

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "your_actual_jwt_secret"
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://user:password@docker-db-1:5432/tasklistdb"


    CORS(app)
    JWTManager(app)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(login_bp, url_prefix="/auth")

    @app.route("/")
    def index():
        return "login service is running!"

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
