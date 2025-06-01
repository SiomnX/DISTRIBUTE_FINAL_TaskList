請在專案根目錄建立 `.env` 檔案，並填入以下內容：

```dotenv
ETCD_ENDPOINTS=etcd1:2379,etcd2:2379,etcd3:2379
FLASK_RUN_PORT=5000
FLASK_ENV=development
```

請先確保已安裝 [Docker](https://www.docker.com/) 和 [Docker Compose](https://docs.docker.com/compose/)。

完成 `.env` 設定後，啟動服務：

```bash
cd docker
docker-compose up --build -d
```


