FROM python:3.11-slim

#container裡的執行目錄
WORKDIR /app

#將本地端backend目錄搬遷到container的app目錄
COPY backend/ /app/
#Python從/app目錄當作模組根目錄開始找
ENV PYTHONPATH=/app
#安裝相關套件
RUN pip install etcd3==0.12.0 protobuf==3.20.*
#container執行時的預設執行指令
CMD ["python", "-m", "etcd.init_etcd_config"]
