import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from flask import Blueprint, request, jsonify
from db.database import create_task, get_task, update_task, delete_task, db
from db.model import Task
from flask_jwt_extended import jwt_required, get_jwt_identity

task_bp = Blueprint('task_bp', __name__)

# 建立任務 (Create)
@task_bp.route('/task', methods=['POST'])
@jwt_required()
def create_task_route():
    data = request.get_json()
    title = data.get('title')
    end_date = data.get('end_date')
    group_id = data.get('group_id')

    task = create_task(title=title, status='pending', end_date=end_date, group_id=group_id)

    return jsonify({
        'id': task.task_id,
        'title': task.title,
        'status': task.status.value,
        'end_date': task.end_date.isoformat() if task.end_date else None,
    }), 201

# 查詢任務 (Read)
@task_bp.route('/task/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_route(task_id):
    task = get_task(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify({
        'id': task.task_id,
        'title': task.title,
        'status': task.status.value,
        'end_date': task.end_date.isoformat() if task.end_date else None,
        'group_id': task.group_id
    }), 200

# 更新任務 (Update)
@task_bp.route('/task/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task_route(task_id):
    data = request.get_json()
    title = data.get('title')
    end_date = data.get('end_date')

    task = update_task(task_id, title=title, end_date=end_date)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify({
        'id': task.task_id,
        'title': task.title,
        'status': task.status.value,
        'end_date': task.end_date.isoformat() if task.end_date else None,
        'group_id': task.group_id
    }), 200

# 刪除任務 (Delete)
@task_bp.route('/task/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task_route(task_id):
    db.session.expire_all()
    task = get_task(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete task: {str(e)}'}), 500

# 根據 group 查詢任務
@task_bp.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_tasks_by_group(group_id):
    from db.model import Task
    tasks = Task.query.filter_by(group_id=group_id).all()

    task_list = []
    for task in tasks:
        assignment = task.assignment  # 透過 ORM 關聯
        user = assignment.user if assignment else None
        task_list.append({
            'id': task.task_id,
            'title': task.title,
            'status': task.status.value,
            'end_date': task.end_date.isoformat() if task.end_date else None,
            'group_id': task.group_id,
            'current_owner_id': user.user_id if user else None,
            'current_owner_name': user.username if user else '未指派'
        })
    return jsonify(task_list), 200

