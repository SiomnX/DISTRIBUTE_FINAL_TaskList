from flask import Blueprint, request, jsonify
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
import psycopg2, requests

# flask  for app.py
assignment_bp = Blueprint("assignment", __name__)

# POsgre的資訊，db連綫
conn = psycopg2.connect(
    host = DB_HOST,
    port = DB_PORT,
    dbname = DB_NAME,
    user = DB_USER,
    password = DB_PASSWORD
)
cursor = conn.cursor() # 建立cursor, 負責與db互動

# send POST request to notification 微服務
def notify(event_type, user, task_id, title):
    try:
        requests.post("http://notification:5003", json = { # notification的port
            "type": event_type,
            "user": user,
            "task_id": task_id,
            "title": title
        })
    except Exception as e:
        print("Notificatio failed:", e)

# 槍任務(POST)
# change status from 'pending' to 'in_process' && 通知
@assignment_bp.route("/claim", methods=["POST"])
def claim_task():
    data = request.get_json()
    user = data.get("user")
    task_id = data.get("task_id")

    if not user or not task_id:
        return jsonify({"error": "Missing user or task_id"}), 400
    
    # 操作 db
    cursor.execute("""
            UPDATE task SET status = 'in_process'
            WHERE task_id = %s AND status = 'pending'
            RETURNING title;
            """,(task_id,))
    
    # 拿回查詢 results (fetch title)
    result = cursor.fetchone() 
    if result:
        title = result[0]
        conn.commit()
        notify("task_claimed", user, task_id, title)
        return jsonify({"message": "Task claimed!!", "task_id": task_id, "title": title})
    else:
        return jsonify ({"error": "Task already claimed or not found :("}),

# 取消任務 POST
# 釋出名額 ('in_process' to 'pending') && 通知
@assignment_bp.route("/cancel", methods=["POST"])
def cancel_task():
    data = request.get_json()
    user = data.get("user")
    task_id = data.get("task_id")

    if not user or not task_id:
        return jsonify({"error !": "Missing task_id"}), 400
    
    cursor.execute("""
                   UPDATE task SET status = 'pending'
                   WHERE task_id = %s AND status = 'in_process'
                   RETURNING title;
                   """, (task_id,))
    result = cursor.fetchone()
    if result:
        title = result[0]
        conn.commit()
        notify("task_cancelled", user, task_id, title)
        return jsonify({"message": "Task_released, 任務已釋出", "task_id": task_id})
    else:
        return jsonify({"error": "Task not in progress or not found!"})


# GET 尚未被認領的任務清單
@assignment_bp.route("/available-tasks", methods=["GET"])
def get_available_tasks():
    cursor.execute("SELECT task_id, title FROM task WHERE status = 'pending';")
    rows = cursor.fetchall()    # 從db查詢結果中取出所有列
    tasks = [{"task_id": r[0], "title": r[1]} for r in rows]
    return jsonify(tasks)

# 去 db 抓 'in_process' 的任務
@assignment_bp.route("/status", methods=["GET"])
def get_in_progress_tasks():
    cursor.execute("SELECT task_id, title FROM task WHERE status = 'in_process';")
    rows = cursor.fetchall()
    tasks = [{"task_id":r[0], "title": r[1]} for r in rows]
    return jsonify(tasks)