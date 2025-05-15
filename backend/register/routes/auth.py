from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from backend.db.model import create_user, get_user_by_username

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if get_user_by_username(data['username']):
        return jsonify({'message': 'Username already exists'}), 400

    user = create_user(data['username'], data['password'])
    return jsonify({'message': 'User registered successfully'}), 201


