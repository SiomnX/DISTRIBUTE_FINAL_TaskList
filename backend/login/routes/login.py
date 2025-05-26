# backend/login/routes/login.py
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from db.database import get_user_by_username, get_user_by_id

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = get_user_by_username(username)
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=str(user.user_id))  # 強制轉成字串
    return jsonify({'access_token': access_token}), 200

@login_bp.route('/whoami', methods=['GET'])
@jwt_required()
def whoami():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'user_id': user.user_id,
        'username': user.username
    }), 200
    return jsonify({"status": "ok"}), 200