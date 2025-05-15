from model import db
from model import User
from model import UserGroup
from model import Group
from model import Task
from model import Assignment

# User CRUD operations
# Create
def create_user(username, password):
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

# Read
def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_user_by_username(username):
    return User.query.filter_by(username=username).first()

# Update
def update_user(user_id, new_username=None, new_password=None):
    user = User.query.get(user_id)
    if not user:
        return None
    if new_username:
        user.username = new_username
    if new_password:
        user.set_password(new_password)
    db.session.commit()
    return user

# Delete
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    return False

# Group CRUD operations
# Create Group
def create_group(title):
    group = Group(title=title)
    db.session.add(group)
    db.session.commit()
    return group

# Read Group
def get_group(group_id):
    return Group.query.get(group_id)

# Update Group
def update_group(group_id, new_title):
    group = get_group(group_id)
    if group:
        group.title = new_title
        db.session.commit()
    return group

# Delete Group
def delete_group(group_id):
    group = get_group(group_id)
    if group:
        db.session.delete(group)
        db.session.commit()

# Add User to Group
def add_user_to_group(username, group_id):
    user_group = UserGroup(username=username, group_id=group_id)
    db.session.add(user_group)
    db.session.commit()
    return user_group

# Remove User from Group
def remove_user_from_group(username, group_id):
    user_group = UserGroup.query.filter_by(username=username, group_id=group_id).first()
    if user_group:
        db.session.delete(user_group)
        db.session.commit()

# Task CRUD operations
# Create Task
def create_task(title, status, end_date, group_id):
    task = Task(title=title, status=status, end_date=end_date, group_id=group_id)
    db.session.add(task)
    db.session.commit()
    return task

# Read Task
def get_task(task_id):
    return Task.query.get(task_id)

# Update Task
def update_task(task_id, title=None, status=None, end_date=None):
    task = get_task(task_id)
    if task:
        if title: task.title = title
        if status: task.status = status
        if end_date: task.end_date = end_date
        db.session.commit()
    return task

# Delete Task
def delete_task(task_id):
    task = get_task(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()

# Assignment CRUD operations
# Assign Task to User
def assign_task(task_id, user_id):
    assignment = Assignment(task_id=task_id, user_id=user_id)
    db.session.add(assignment)
    db.session.commit()
    return assignment

# Get Task Assignment
def get_assignment(task_id):
    return Assignment.query.get(task_id)

# Update Assignment
def update_assignment(task_id, new_user_id):
    assignment = get_assignment(task_id)
    if assignment:
        assignment.user_id = new_user_id
        db.session.commit()
    return assignment

# Remove Assignment
def remove_assignment(task_id):
    assignment = get_assignment(task_id)
    if assignment:
        db.session.delete(assignment)
        db.session.commit()