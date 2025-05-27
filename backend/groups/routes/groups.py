from flask import Blueprint, request, jsonify
from db.database import create_group, update_group,delete_group,add_user_to_group,remove_user_from_group
from db.model import UserGroup,User,Group
from flask_jwt_extended import jwt_required,get_jwt_identity

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/create', methods=['POST'])
@jwt_required()
def create():
    data = request.json
    user_id = get_jwt_identity()
    
    group = create_group(data['title'])  
    add_user_to_group(user_id, group.group_id)  

    return jsonify({'error': 'Group created', 'group_id': group.group_id}), 201
@groups_bp.route('/update', methods=['POST'])
@jwt_required()
def update():
    data = request.json
    user_id = get_jwt_identity()

    group_id = data.get('group_id')
    new_title = data.get('new_title')

    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({'error': '你不是這個群組的成員，不能修改群組名稱'}), 403
    group = update_group(group_id, new_title)
    return jsonify({'error': 'Group updated successfully'}), 200

@groups_bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete():
    data = request.get_json(force=True)
    user_id = get_jwt_identity()
    group_id = data.get('group_id')

    group = Group.query.get(group_id)
    if not group:
        return jsonify({'message': '查無此群組'}), 404

    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({'message': '你不是這個群組的成員，不能刪除'}), 403

    delete_group(group_id)
    return jsonify({'message': '群組已成功刪除'}), 200



@groups_bp.route('/add_user', methods=['POST'])
@jwt_required()
def add_user():
    data = request.json
    user_id = get_jwt_identity()
    target_user_id = data['user_id']
    group_id = data['group_id']

    target_user = User.query.get(target_user_id)
    if not target_user:
        return jsonify({'message': '查無該使用者'}), 404



    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({'error': '你不是這個群組的成員，不能邀請他人'}), 403

    already_in_group = UserGroup.query.filter_by(user_id=target_user_id, group_id=group_id).first()
    if already_in_group:
        return jsonify({'error': '該使用者已經在群組中'}), 400

    add_user_to_group(target_user_id, group_id)
    return jsonify({'error': 'User added successfully'}), 201


@groups_bp.route('/remove_user', methods=['DELETE'])
@jwt_required()
def remove_user():
    data = request.json
    user_id = get_jwt_identity()
    target_user_id = data['user_id']
    group_id = data['group_id']

    is_member = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not is_member:
        return jsonify({'message': '你不是群組成員，不能移除他人'}), 403

    target_user = User.query.get(target_user_id)
    if not target_user:
        return jsonify({'message': '查無該使用者'}), 404

    already_in_group = UserGroup.query.filter_by(user_id=target_user_id, group_id=group_id).first()
    if not already_in_group:
        return jsonify({'message': '該使用者不在群組中'}), 400

    remove_user_from_group(target_user_id, group_id)
    return jsonify({'message': '使用者已成功移除'}), 200


@groups_bp.route("/my-groups", methods=["GET"])
@jwt_required(optional=True)
def get_user_groups():

    user_id = get_jwt_identity()

    user_groups = UserGroup.query.filter_by(user_id=user_id).all()
    group_ids = [ug.group_id for ug in user_groups]

    groups = Group.query.filter(Group.group_id.in_(group_ids)).all()

    result = []
    for g in groups:
        result.append({
            "id": g.group_id,
            "title": g.title
        })

    return jsonify(result), 200



@groups_bp.route("/", methods=["GET"])
def get_groups():
    groups = Group.query.all()
    return jsonify([{"id": g.group_id, "title": g.title} for g in groups]), 200


@groups_bp.route("/<int:group_id>/members", methods=["GET"])
@jwt_required()
def get_group_members(group_id):
    user_groups = UserGroup.query.filter_by(group_id=group_id).all()
    member_ids = [ug.user_id for ug in user_groups]
    return jsonify(member_ids), 200

