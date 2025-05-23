# 使用 Python 3.11 Slim 版本作為基底
FROM python:3.11-slim

# 設定工作目錄
WORKDIR /app

# 複製 task_list 自己的程式碼
COPY backend/task_list /app/task_list

# 複製共用的 db 和 etcd
COPY backend/db /app/db
COPY backend/etcd /app/etcd

# 安裝相依套件flask和cors和flask_sqlalchemy
RUN pip install --no-cache-dir flask flask-cors flask_sqlalchemy flask-jwt-extended psycopg2-binary etcd3

# 設定環境變數（設定 PYTHONPATH 讓你可以 import task_list.*）
ENV PYTHONPATH=/app
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python

# 執行 Flask 應用程式（main 改為 app）
CMD ["python", "-m", "task_list.app"]

