import os

class Config:
    ETCD_ENDPOINTS = os.getenv("ETCD_ENDPOINTS","etcd1:2379,etcd2:2379,etcd3:2379").split(",")
    SERVICE_NAME = os.getenv("SERVICE_NAME", "task_list")
    PORT = int(os.getenv("PORT", 5003))
    SQLALCHEMY_TRACK_MODIFICATIONS = False

