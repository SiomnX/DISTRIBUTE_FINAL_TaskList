#etcd的初始資料
import etcd3
import os
from etcd.etcd_client import connect_etcd


etcd = connect_etcd()#連上etcd

#將初始資料存進etcd
etcd.put("/database/database_url", "postgresql://user:password@db:5432/tasklistdb")
etcd.put("/secrets/jwt_secret", "super-secret-jwt")
print("etcd settings initialized.")

