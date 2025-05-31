import time
import subprocess
from etcd.etcd_client import connect_etcd

def watch_database_url():
    etcd = connect_etcd()

    def callback(response):
        try:
            event = response.events[0]
            key = event.key.decode('utf-8')
            value = event.value.decode('utf-8')
            print(f"[WATCH] {key} 改變為: {value}", flush=True)
            print("[ACTION] 重新啟動 container", flush=True)
            subprocess.run(["docker", "restart", "docker-register-1"])
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Restart failed: {e}")
        except Exception as e:
            print(f"[ERROR] 無法處理事件: {e}", flush=True)

    print("📡 開始監聽 /database/database_url ...", flush=True)
    etcd.add_watch_callback('/database/database_url', callback)

if __name__ == "__main__":
    watch_database_url()
    while True:
        time.sleep(1)

