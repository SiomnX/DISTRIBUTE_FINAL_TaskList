from flask import Blueprint, request, jsonify
from config import Config
import psycopg2, requests
from flask_jwt_extended import jwt_required, get_jwt_identity

# flask  for app.py
assignment_bp = Blueprint("assignment", __name__)

conn = psycopg2.connect(
    host=Config.DB_HOST,
    port=Config.DB_PORT,
    dbname=Config.DB_NAME,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD
)
cursor = conn.cursor() # 建立cursor, 負責與db互動

@assignment_bp.route("/claim", methods=["POST"])
@jwt_required()
def claim_task():
    data = request.get_json()
    task_id = data.get("task_id")
    user_id = get_jwt_identity()

    if not user_id or not task_id:
        return jsonify({"error": "Missing user_id or task_id"}), 400

    conn = psycopg2.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        dbname=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD
    )

    try:
        with conn.cursor() as cursor:
            conn.rollback()

            # 1️⃣ 嘗試將任務設為 in_process
            cursor.execute("""
                UPDATE task
                   SET status = 'in_process'
                 WHERE task_id = %s AND status = 'pending'
                RETURNING title;
            """, (task_id,))
            task_row = cursor.fetchone()

            if not task_row:
                conn.rollback()
                return jsonify({
                    "error": "Task already claimed or not found",
                    "details": f"Task {task_id} is not in 'pending' status or does not exist."
                }), 404

            title = task_row[0]

            # 2️⃣ 先查是否 assignment 存在
            cursor.execute("""
                SELECT 1 FROM assignment
                 WHERE task_id = %s AND user_id = %s;
            """, (task_id, user_id))
            if cursor.fetchone():
                conn.rollback()
                return jsonify({"error": "Assignment already exists"}), 409

            # 3️⃣ 插入 assignment
            cursor.execute("""
                INSERT INTO assignment (task_id, user_id)
                VALUES (%s, %s)
                RETURNING task_id, user_id;
            """, (task_id, user_id))
            assigned = cursor.fetchone()

            conn.commit()

            return jsonify({
                "message": "Task claimed and assigned",
                "task_id": assigned[0],
                "user_id": assigned[1],
                "title": title
            }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

    finally:
        conn.close()


@assignment_bp.route("/cancel", methods=["POST"])
@jwt_required()
def cancel_task():
    data = request.get_json()
    #user_id = data.get("user_id")
    task_id = data.get("task_id")
    user_id = get_jwt_identity()  # 从 JWT 拿到的身份（identity）

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
@jwt_required()
def add_assignment():
    data = request.get_json()
    #user_id = data.get("user_id")
    task_id = data.get("task_id")
    user_id = get_jwt_identity()
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
@jwt_required()
def remove_assignment():
    data = request.get_json()
    # user_id = data.get("user_id")
    task_id = data.get("task_id")
    user_id = get_jwt_identity()
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

# NEW：完成任務
@assignment_bp.route("/complete", methods=["POST"])
@jwt_required()
def complete_task():
    data = request.get_json()
    task_id = data.get("task_id")
    user_id = get_jwt_identity()

    if not task_id or not user_id:
        return jsonify({"error": "Missing task_id"}), 400

    try:
        conn.rollback()

        # 確保這個 user 正在做這個任務（可選）
        cursor.execute("""
            SELECT 1 FROM assignment
             WHERE task_id = %s AND user_id = %s;
        """, (task_id, user_id))
        if not cursor.fetchone():
            return jsonify({"error": "Not assigned or not in process"}), 403

        # 把 task 狀態改成 completed
        cursor.execute("""
            UPDATE task
               SET status = 'completed'
             WHERE task_id = %s
               AND status = 'in_process'
            RETURNING title;
        """, (task_id,))
        row = cursor.fetchone()
        if not row:
            conn.rollback()
            return jsonify({"error": "Task not in progress or not found"}), 404

        conn.commit()
        return jsonify({
            "message": "Task completed",
            "task_id": task_id,
            "title": row[0]
        }), 200

    except Exception as e:
        conn.rollback()
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

# NEW: 顯示目前自己 in_process 的任務
@assignment_bp.route("/my-tasks", methods=["GET"])
@jwt_required()
def get_my_tasks():
    user_id = get_jwt_identity()

    try:
        cursor.execute("""
            SELECT t.task_id, t.title, t.status, t.end_date, t.group_id
              FROM task t
              JOIN assignment a ON t.task_id = a.task_id
             WHERE a.user_id = %s AND t.status = 'in_process';
        """, (user_id,))
        tasks = cursor.fetchall()

        result = [
            {
                "task_id": row[0],
                "title": row[1],
                "status": row[2],
                "end_date": row[3],
                "group_id": row[4]
            } for row in tasks
        ]

        return jsonify(result), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Internal error", "details": str(e)}), 500