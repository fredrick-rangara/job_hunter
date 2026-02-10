from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Replace with your actual PostgreSQL credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/recruit_connect'
app.config['JWT_SECRET_KEY'] = 'your-super-secret-key'

db = SQLAlchemy(app)
jwt = JWTManager(app)

@app.route('/')
def index():
    return {"message": "RecruitConnect API is running"}

if __name__ == '__main__':
    app.run(debug=True)