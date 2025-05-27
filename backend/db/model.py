from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from datetime import datetime
import enum

db = SQLAlchemy()


# 任務狀態列舉
class TaskStatus(enum.Enum):
    pending = 'pending'
    in_process = 'in_process'
    completed = 'completed'

# 使用者模型
class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # 關聯
    assignments = db.relationship('Assignment', back_populates='user', cascade='all, delete')
    user_groups = db.relationship('UserGroup', back_populates='user', cascade='all, delete')

    def set_password(self, password):
        self.password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password, password)

# 群組模型
class Group(db.Model):
    __tablename__ = 'groups'

    group_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)

    # 關聯
    tasks = db.relationship('Task', back_populates='group', cascade='all, delete')
    user_groups = db.relationship('UserGroup', back_populates='group', cascade='all, delete')

# 多對多中介表
class UserGroup(db.Model):
    __tablename__ = 'user_group'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), primary_key=True)

    # 關聯
    user = db.relationship('User', back_populates='user_groups')
    group = db.relationship('Group', back_populates='user_groups')

# 任務模型
class Task(db.Model):
    __tablename__ = 'task'

    task_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.pending, nullable=False)
    end_date = db.Column(db.DateTime)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'))

    # 關聯
    group = db.relationship('Group', back_populates='tasks')
    assignment = db.relationship('Assignment', back_populates='task', uselist=False, cascade='all, delete')

# 任務指派模型（每個任務只給一個使用者）
class Assignment(db.Model):
    __tablename__ = 'assignment'

    task_id = db.Column(db.Integer, db.ForeignKey('task.task_id',ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id',ondelete='CASCADE'))

    # 關聯
    task = db.relationship('Task', back_populates='assignment')
    user = db.relationship('User', back_populates='assignments')
#群組通知
class GroupNotification(db.Model):
    __tablename__ = 'group_notifications'

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.group_id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)  
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    group = db.relationship('Group', backref=db.backref('notifications', cascade='all, delete'))

