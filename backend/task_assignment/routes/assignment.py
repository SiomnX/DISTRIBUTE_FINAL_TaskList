from flask import Blueprint, request, jsonify
from config import Config
import psycopg2, requests

# flask  for app.py
assignment_bp = Blueprint("assignment", __name__)

# POsgre的資訊，db連綫
# conn = psycopg2.connect(
#     host = DB_HOST,
#     port = DB_PORT,
#     dbname = DB_NAME,
#     user = DB_USER,
#     password = DB_PASSWORD
# )
# Establish DB connection using Config
conn = psycopg2.connect(
    host=Config.DB_HOST,
    port=Config.DB_PORT,
    dbname=Config.DB_NAME,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD
)
cursor = conn.cursor() # 建立cursor, 負責與db互動

# send POST request to notification 微服務
# def notify(event_type, user, task_id, title):
#     try:
#         requests.post("http://notification:5003", json = { # notification的port
#             "type": event_type,
#             "user": user,
#             "task_id": task_id,
#             "title": title
#         })
#     except Exception as e:
#         print("Notificatio failed:", e)

# 槍任務(POST)
# change status from 'pending' to 'in_process' && 通知
# @assignment_bp.route("/claim", methods=["POST"])
# def claim_task():
#     data = request.get_json()
#     user = data.get("user")
#     task_id = data.get("task_id")

#     if not user or not task_id:
#         return jsonify({"error": "Missing user or task_id"}), 400
    
#     # 操作 db
#     cursor.execute("""
#             UPDATE task SET status = 'in_process'
#             WHERE task_id = %s AND status = 'pending'
#             RETURNING title;
#             """,(task_id,))
    
#     # 拿回查詢 results (fetch title)
#     result = cursor.fetchone() 
#     if result:
#         title = result[0]
#         conn.commit()
#         # notify("task_claimed", user, task_id, title)
#         return jsonify({"message": "Task claimed!!", "task_id": task_id, "title": title})
#     else:
#         return jsonify ({"error": "Task already claimed or not found :("}),
@assignment_bp.route("/claim", methods=["POST"])
def claim_task():
    data = request.get_json()
    user_id = data.get("user_id")      # 前端要傳 "user_id"
    task_id = data.get("task_id")

    if not user_id or not task_id:
        return jsonify({"error": "Missing user_id or task_id"}), 400

    try:
        # 先清掉上次失敗的 transaction
        conn.rollback()

        # 1. 更新 task 為 in_process
        cursor.execute("""
            UPDATE task
               SET status = 'in_process'
             WHERE task_id = %s
               AND status = 'pending'
            RETURNING title;
        """, (task_id,))
        task_row = cursor.fetchone()
        if not task_row:
            conn.rollback()
            return jsonify({"error": "Task already claimed or not found"}), 404
        title = task_row[0]

        # 2. 在 assignment 表新增指派
        cursor.execute("""
            INSERT INTO assignment (task_id, user_id)
            VALUES (%s, %s)
            RETURNING task_id, user_id;
        """, (task_id, user_id))
        assigned = cursor.fetchone()  # (task_id, user_id)

        # 3. 一起 commit
        conn.commit()

        # 4. 回傳結果
        return jsonify({
            "message": "Task claimed and assigned",
            "task_id": assigned[0],
            "user_id": assigned[1],
            "title": title
        }), 201

    except psycopg2.IntegrityError:
        # 已存在同樣的 (task_id, user_id)
        conn.rollback()
        return jsonify({"error": "Assignment already exists"}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# 取消任務 POST
# 釋出名額 ('in_process' to 'pending') && 通知
# @assignment_bp.route("/cancel", methods=["POST"])
# def cancel_task():
#     data = request.get_json()
#     user = data.get("user")
#     task_id = data.get("task_id")

#     if not user or not task_id:
#         return jsonify({"error !": "Missing task_id"}), 400
    
#     cursor.execute("""
#                    UPDATE task SET status = 'pending'
#                    WHERE task_id = %s AND status = 'in_process'
#                    RETURNING title;
#                    """, (task_id,))
#     result = cursor.fetchone()
#     if result:
#         title = result[0]
#         conn.commit()
#         # notify("task_cancelled", user, task_id, title)
#         return jsonify({"message": "Task_released, 任務已釋出", "task_id": task_id})
#     else:
#         return jsonify({"error": "Task not in progress or not found!"})

@assignment_bp.route("/cancel", methods=["POST"])
def cancel_task():
    data = request.get_json()
    user_id = data.get("user_id")
    task_id = data.get("task_id")

    if not user_id or not task_id:
        return jsonify({"error": "Missing user_id or task_id"}), 400

    try:
        # 清掉任何殘留的失敗 transaction
        conn.rollback()

        # 1. 刪除 assignment 並回傳 task_id, user_id
        cursor.execute(
            """
            DELETE FROM assignment
             WHERE task_id = %s
               AND user_id = %s
            RETURNING task_id, user_id;
            """,
            (task_id, user_id)
        )
        deleted = cursor.fetchone()
        if not deleted:
            conn.rollback()
            return jsonify({"error": "No assignment found for this user and task"}), 404

        # 2. 更新 task 狀態
        cursor.execute(
            """
            UPDATE task
               SET status = 'pending'
             WHERE task_id = %s
               AND status = 'in_process'
            RETURNING title;
            """,
            (task_id,)
        )
        task_row = cursor.fetchone()
        if not task_row:
            conn.rollback()
            return jsonify({
                "error": "Task was not in progress; assignment removed but status unchanged"
            }), 400

        title = task_row[0]

        # 3. 提交
        conn.commit()

        return jsonify({
            "message": "Assignment removed and task released",
            "task_id": deleted[0],
            "user_id": deleted[1],
            "title": title
        }), 200

    except Exception as e:
        conn.rollback()
        # 印出詳細錯誤到日誌
        print("cancel_task ERROR:", e)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500



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

@assignment_bp.route("/assign", methods=["POST"])
def add_assignment():
    data = request.get_json()
    user_id = data.get("user_id")
    task_id = data.get("task_id")
    if not user_id or not task_id:
        return jsonify({"error": "Missing user_id or task_id"}), 400

    try:
        # 先回滾上一次錯誤 transaction（若有）
        conn.rollback()

        # 1. 新增 assignment 紀錄
        cursor.execute(
            """
            INSERT INTO assignment (task_id, user_id)
            VALUES (%s, %s)
            RETURNING task_id, user_id;
            """,
            (task_id, user_id)
        )
        assigned = cursor.fetchone()  # (task_id, user_id)

        # 2. 將 task 狀態標為 in_process 並取回 title
        cursor.execute(
            """
            UPDATE task
               SET status = 'in_process'
             WHERE task_id = %s
               AND status = 'pending'
            RETURNING title;
            """,
            (task_id,)
        )
        task_row = cursor.fetchone()
        if not task_row:
            # 如果沒更新到（可能已被認領），就回 409 並 rollback
            conn.rollback()
            return jsonify({"error": "Task already claimed or not pending"}), 409
        title = task_row[0]

        # 3. 全部成功後 commit
        conn.commit()

        return jsonify({
            "message": "Assignment added and task claimed",
            "task_id": assigned[0],
            "user_id": assigned[1],
            "title": title
        }), 201

    except psycopg2.IntegrityError:
        conn.rollback()
        return jsonify({"error": "Assignment already exists"}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500



@assignment_bp.route("/assign", methods=["DELETE"])
def remove_assignment():
    data = request.get_json()
    user_id = data.get("user_id")
    task_id = data.get("task_id")
    if not user_id or not task_id:
        return jsonify({"error": "Missing user_id or task_id"}), 400

    try:
        # 先回滾任何殘留錯誤
        conn.rollback()

        # 1. 刪除 assignment 並回傳 (task_id, user_id)
        cursor.execute(
            """
            DELETE FROM assignment
             WHERE task_id = %s
               AND user_id = %s
            RETURNING task_id, user_id;
            """,
            (task_id, user_id)
        )
        deleted = cursor.fetchone()
        if not deleted:
            conn.rollback()
            return jsonify({"error": "Assignment not found"}), 404

        # 2. 重設 task 狀態為 pending
        cursor.execute(
            """
            UPDATE task
               SET status = 'pending'
             WHERE task_id = %s
            RETURNING title;
            """,
            (task_id,)
        )
        row = cursor.fetchone()
        if not row:
            conn.rollback()
            return jsonify({
                "error": "Task not found or not in a state that can be reset"
            }), 400
        title = row[0]

        # 3. 一起提交
        conn.commit()

        # 4. 回傳結果
        return jsonify({
            "message": "Assignment removed and task reset to pending",
            "task_id": deleted[0],
            "user_id": deleted[1],
            "title": title
        }), 200

    except Exception as e:
        conn.rollback()
        # 印出到日誌才能看到細節
        print("remove_assignment ERROR:", e)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
