from datetime import datetime
from model import db, create_app
# from database import (
#     create_user,
#     create_group, add_user_to_group,
#     create_task, assign_task,
#     get_task, get_assignment
# )
from database import (
    assign_task,delete_user, delete_group, delete_task, remove_user_from_group, remove_assignment,create_user
)


# 建立 Flask App 並初始化資料庫
app = create_app()
with app.app_context():
    # 清空所有資料表（⚠️開發測試用，正式環境請勿使用）
    #db.drop_all()
    db.create_all()

    #user = create_user("testuser", "password123")
    #assignment = assign_task(1, 1)
    #print(user.user_id)

    #print("== 刪除使用者 ==")
    delete_user(1)
    print("User deleted")

    # # print("== 刪除群組 ==")
    # delete_group(1)
    # print("Group deleted")

    # # print("== 刪除task ==")
    # delete_task(1)
    # print("task deleted")

    # # print("== 建立任務 ==")
    # assignment = remove_assignment(1)
    # print("assignment deleted")
