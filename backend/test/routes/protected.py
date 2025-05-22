from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.model import User
from db.database import db

protected_bp = Blueprint("protected", __name__)

@protected_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected_route():
    #return "hit"
    user_id = get_jwt_identity()
    print(f"Decoded user_id: {user_id}")  # debug log
    
    user = db.session.get(User, user_id)
    if user is None:
        print("User not found in DB!")    # debug log
        return jsonify({"error": "User not found"}), 404

    print(f"Found user: {user.username}") # debug log

    if user.username != "testuser":
        return jsonify({"error": "Access denied. Not allowed for this user."}), 403

    return jsonify({
        "message": f"Welcome {user.username}, you have access!",
        "user_id": user_id
    }), 200

@protected_bp.route("/probe")
def probe():
    return "probe ok"

