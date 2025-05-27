from flask import Blueprint, request, jsonify
from db.database import create_group_notification
from db.model import UserGroup, GroupNotification
from flask_jwt_extended import jwt_required, get_jwt_identity

notification_bp = Blueprint('notification', __name__)




# ✅ 查詢通知
@notification_bp.route("/<int:group_id>/notifications", methods=["GET"])
@jwt_required()
def get_group_notifications(group_id):
    user_id = get_jwt_identity()

    # 檢查是否為該群組成員
    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({"error": "你不是此群組的成員，無法查看通知"}), 403

    notifications = GroupNotification.query.filter_by(group_id=group_id)\
        .order_by(GroupNotification.created_at.desc()).all()

    return jsonify([
        {
            "id": n.id,
            "group_id": n.group_id,
            "title": n.title,
            "content": n.content,
            "created_at": n.created_at.strftime("%Y-%m-%d %H:%M")
        } for n in notifications
    ])


# ✅ 建立通知（測試用）
@notification_bp.route("/<int:group_id>/notifications", methods=["POST"])
@jwt_required()
def create_notification(group_id):
    user_id = get_jwt_identity()

    # 檢查是否為該群組成員
    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({"error": "你不是此群組的成員，無法建立通知"}), 403

    data = request.get_json()
    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "缺少 title 或 content"}), 400

    create_group_notification(group_id, title, content)
    return jsonify({"message": "通知建立成功"}), 201

