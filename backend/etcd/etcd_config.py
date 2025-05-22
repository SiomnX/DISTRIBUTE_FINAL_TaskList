#etcd裡的config data
from etcd.etcd_client import get_config

def get_database_url(default=""):
    return get_config("/database/database_url", default)

def get_jwt_secret(default=""):
    return get_config("/secrets/jwt_secret", default)
