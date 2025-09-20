from models.UserJob import UserJob
from models.User import User
from models import db
from flask import request, jsonify, Blueprint, session

user_job_bp = Blueprint('userJob', __name__)

@user_job_bp.route('/user/jobs', methods=['GET'])
def getSavedJob():
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    user = User.query.get(user_id)

    savedJobs = user.saved_jobs

    saved_jobs_list = []
    for user_job in savedJobs:
        job_data = {
            'saved_date': user_job.saved_date.isoformat() if user_job.saved_date else None,
            'job': user_job.job.to_dict() if user_job.job else None  # 取得關聯的 Job 物件
        }
        saved_jobs_list.append(job_data)

    return {
        'message': 'Load saved jobs successfully',
        'jobs': saved_jobs_list
    }, 200

@user_job_bp.route('/user/jobs', methods=['POST'])
def savedJob():
    data = request.get_json()

    user_id = data.get('user_id', None)
    job_id = data.get('job_id', None)

    if not user_id or not job_id:
        return { 'message': 'Lack of necessary parameter' }, 404
    
    user_job = UserJob(user_id=user_id, job_id=job_id)

    db.session.add(user_job)

    db.session.commit()

    return {
        'message': 'Saved jobs successfully',
        'jobs': user_job.to_dict()
    }, 200