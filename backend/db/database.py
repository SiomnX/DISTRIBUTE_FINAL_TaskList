from db.model import db, User, UserGroup, Group, Task, Assignment,GroupNotification

# 為了讓外部可以注入 SocketIO 實例（從 app.py 傳入）
socketio = None

def bind_socketio(instance):
    global socketio
    socketio = instance

# =======================
# User CRUD
# =======================

def create_user(username, password):
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_user_by_username(username):
    return User.query.filter_by(username=username).first()

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

def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    return False

# =======================
# Group CRUD
# =======================

def create_group(title):
    group = Group(title=title)
    db.session.add(group)
    db.session.commit()
    return group

def get_group(group_id):
    return Group.query.get(group_id)

def update_group(group_id, new_title):
    group = get_group(group_id)
    if group:
        group.title = new_title
        db.session.commit()
    return group

def delete_group(group_id):
    group = get_group(group_id)
    if group:
        db.session.delete(group)
        db.session.commit()

def add_user_to_group(user_id, group_id):
    user_group = UserGroup(user_id=user_id, group_id=group_id)
    db.session.add(user_group)
    db.session.commit()
    return user_group

def remove_user_from_group(user_id, group_id):
    user_group = UserGroup.query.filter_by(user_id=user_id, group_id=group_id).first()
    if user_group:
        db.session.delete(user_group)
        db.session.commit()

# =======================
# Task CRUD
# =======================

def create_task(title, status, end_date, group_id):
    task = Task(title=title, status=status, end_date=end_date, group_id=group_id)
    db.session.add(task)
    db.session.commit()
    create_group_notification(group_id, "新任務", f"任務「{title}」已建立 🎯")

    if socketio:
        print("[SocketIO] Emitting create_task")
        socketio.emit('create_task', {
            "task_id": task.task_id,
            "title": title,
            "status": status,
            "end_date": end_date,
            "group_id": group_id,
            "message": f"任務 {task.task_id} 已建立！"
        },  namespace="/")

    return task

def get_task(task_id):
    return Task.query.get(task_id)

def update_task(task_id, title=None, status=None, end_date=None):
    task = get_task(task_id)
    if task:
        if title:
            create_group_notification(task.group_id, "任務更新", f"任務「{title}」名稱已被修改")
            task.title = title
            if socketio:
                socketio.emit('update_task_title', {
                    "task_id": task_id,
                    "title": title,
                    "message": f"任務 {task_id} 名稱變更為 {title}"
                }, namespace="/")
        if status:
            create_group_notification(task.group_id, "任務狀態更新", f"任務「{task.title}」狀態更新為「{status}」")
            task.status = status
            if socketio:
                socketio.emit('update_task_status', {
                    "task_id": task_id,
                    "status": status,
                    "message": f"任務 {task_id} 狀態變更為 {status}"
                },  namespace="/")
        if end_date:
            if isinstance(end_date, str):
                try:
                    end_date = datetime.strptime(end_date, "%Y-%m-%d")
                except ValueError:
                    return {"error": "日期格式錯誤"}, 400
            create_group_notification(task.group_id, "任務截止日期更新", f"任務「{task.title}」截止時間更新為 {end_date.strftime('%Y-%m-%d')}")
            task.end_date = end_date
            if socketio:
                socketio.emit('update_task_end_date', {
                    "task_id": task_id,
                    "end_date": end_date,
                    "message": f"任務 {task_id} 截止日期變更為 {end_date}"
                }, namespace="/")
        db.session.commit()
    return task

def delete_task(task_id):
    task = get_task(task_id)
    if task:
        db.session.delete(task)
        db.session.commit()
        create_group_notification(task.group_id, "任務刪除", f"任務「{task.title}」已被刪除 ❌")
        if socketio:
            socketio.emit('delete_task', {
                "task_id": task_id,
                "message": f"任務 {task_id} 已刪除！"
            }, namespace="/")

# =======================
# Assignment CRUD
# =======================

def assign_task(task_id, user_id):
    assignment = Assignment(task_id=task_id, user_id=user_id)
    db.session.add(assignment)
    db.session.commit()
    return assignment

def get_assignment(task_id):
    return Assignment.query.get(task_id)

def update_assignment(task_id, new_user_id):
    assignment = get_assignment(task_id)
    if assignment:
        assignment.user_id = new_user_id
        db.session.commit()
    return assignment

def remove_assignment(task_id):
    assignment = get_assignment(task_id)
    if assignment:
        db.session.delete(assignment)
        db.session.commit()
#====================
#通知
#====================
def create_group_notification(group_id: int, title: str, content: str):
    print(f"📝 建立通知：{title} - {content}")
    notification = GroupNotification(group_id=group_id, title=title, content=content)
    db.session.add(notification)
    db.session.commit()

