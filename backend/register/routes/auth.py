from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
from db.database import create_user, get_user_by_username

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if get_user_by_username(data['username']):
        return jsonify({'message': 'Username already exists'}), 400

    user = create_user(data['username'], data['password'])
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/debug/db_url', methods=['GET'])
def debug_db_url():
    return jsonify({
        "SQLALCHEMY_DATABASE_URL": current_app.config.get("SQLALCHEMY_DATABASE_URI")
    })
