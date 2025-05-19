from flask import Flask
from routes.assignment import assignment_bp
from config import SERVICE_PORT

app = Flask(__name__)
app.register_blueprint(assignment_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=SERVICE_PORT)