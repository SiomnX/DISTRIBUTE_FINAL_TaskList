from flask import Flask
from flask_socketio import SocketIO
# from backend.db.database import socketio  # 直接用你 database.py 的 socketio 實例
from backend.db.model import db 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/tasklistdb'

db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return "SocketIO Server Running!"

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)