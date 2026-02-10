from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Replace with your actual PostgreSQL credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost/job_hunter'
app.config['JWT_SECRET_KEY'] = 'your-super-secret-key'

db = SQLAlchemy(app)
jwt = JWTManager(app)

@app.route('/')
def index():
    return {"message": "RecruitConnect API is running"}
if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Successfully connected to the database and created tables!")
        except Exception as e:
            print(f"Database error: {e}")
            
    app.run(debug=True)