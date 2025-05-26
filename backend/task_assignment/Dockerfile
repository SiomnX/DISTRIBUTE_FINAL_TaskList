# 使用 Python 3.9 的輕量級映像檔
FROM python:3.9-slim

# 設定 task_assignment container 的工作目錄
WORKDIR /app

# 複製 requirements.txt 到工作目錄
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製其餘程式檔案到工作目錄
COPY backend/task_assignment/ .
COPY backend/etcd/ ./etcd


# 建立一個非 root 用戶運行應用程式
# 這樣做是為了安全性，避免容器以 root 身份運行
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
USER appuser

# 暴露應用程式的port
EXPOSE 5000

# 啟動應用程式
CMD ["python", "app.py"]