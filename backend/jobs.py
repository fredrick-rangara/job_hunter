from flask import Blueprint, request, jsonify
from models import Job

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/api/jobs', methods=['GET'])
def get_jobs():
    search_query = request.args.get('search', '')
    
    if search_query:
        # Simple search filter for title or company
        jobs = Job.query.filter(
            (Job.title.ilike(f'%{search_query}%')) | 
            (Job.company.ilike(f'%{search_query}%'))
        ).all()
    else:
        jobs = Job.query.all()

    return jsonify([{
        "id": j.id,
        "title": j.title,
        "company": j.company,
        "location": j.location,
        "salary": j.salary
    } for j in jobs]), 200