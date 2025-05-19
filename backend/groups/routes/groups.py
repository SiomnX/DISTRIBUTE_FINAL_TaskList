from flask import Blueprint, request, jsonify
from db.database import create_group, update_group,delete_group,add_user_to_group,remove_user_from_group

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('/create', methods=['POST'])
def create():
    data = request.json
    group = create_group(data['title'])
    return jsonify({'message': 'Group created successfully'}), 201

@groups_bp.route('/update', methods=['POST'])
def update():
    data = request.json
    group = update_group(data['group_id'],data['new_title'])
    return jsonify({'message': 'Group updated successfully'}), 201

@groups_bp.route('/delete', methods=['DELETE'])
def delete():
    data = request.json
    delete_group(data['group_id'])
    return jsonify({'message': 'Group deleteed successfully'}), 201

@groups_bp.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    user_group = add_user_to_group(data['username'],data['group_id'])
    return jsonify({'message': 'User added successfully'}), 201

@groups_bp.route('/remove_user', methods=['DELETE'])
def remove_user():
    data = request.json
    remove_user_from_group(data['username'],data['group_id'])
    return jsonify({'message': 'User removeed successfully'}), 201
