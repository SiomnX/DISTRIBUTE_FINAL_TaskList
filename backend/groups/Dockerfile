FROM python:3.11-slim

#設定container的工作目錄
WORKDIR /app
#將本地的backend搬遷到container的app
COPY backend/ /app
#安裝套件
RUN pip install --no-cache-dir -r requirements.txt

#Python從/app目錄當作模組根目錄開始找
ENV PYTHONPATH=/app

#container執行時的預設指令
CMD ["python", "-m", "groups.app"]
