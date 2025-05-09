#用戶端連etcd與向etcd註冊的程式碼
import etcd3
import os
import random
import uuid
import socket

ETCD_ENDPOINTS = os.getenv("ETCD_ENDPOINTS", "etcd1:2379,etcd2:2379,etcd3:2379").split(",")

#連上etcd
def connect_etcd():
    for ep in random.sample(ETCD_ENDPOINTS, len(ETCD_ENDPOINTS)):
        host, port = ep.split(":") 
        try:
            etcd = etcd3.client(host=host, port=int(port)) #向etcd其中一個節點連線
            etcd.status()
            print(f"Connected to etcd at {host}:{port}")
            return etcd #只需要成功連上一個就返回
        except Exception as e:
            print(f"Failed to connect to etcd at {ep}: {e}")
    raise ConnectionError("Could not connect to any etcd endpoint")

#向etcd註冊
def register_to_etcd(service_name: str,ip:str ,port: int):
    etcd = connect_etcd() #連上其中一個etcd節點
    #設定好key-value
    service_id = str(uuid.uuid4())
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    value = f"http://{ip}:{port}"
    key = f"/services/{service_name}/{service_id}"
    #將資料存進etcd
    etcd.put(key, value)
    print(f"Registered {key} -> {value}")

#向etcd存取config
def get_config(key, default=""):
    etcd = connect_etcd() #連上其中一個etcd節點
    try:
        val, _ = etcd.get(key) #取得資料
        return val.decode() if val else default
    except Exception as e:
        print(f"etcd get error for key '{key}': {e}")
        return default

