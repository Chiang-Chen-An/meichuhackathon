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
    # 從 session 取得當前登入用戶 ID
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    data = request.get_json()
    job_id = data.get('job_id', None)

    if not job_id:
        return {'message': 'job_id is required'}, 400
    
    # 檢查是否已經收藏過這個工作
    existing = UserJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return {'message': 'Job already saved'}, 409
    
    user_job = UserJob(user_id=user_id, job_id=job_id)

    db.session.add(user_job)

    db.session.commit()

    return {
        'message': 'Saved job successfully',
        'job': user_job.to_dict()
    }, 200

@user_job_bp.route('/user/jobs/check/<int:job_id>', methods=['GET'])
def checkJobSaved(job_id):
    """檢查指定工作是否已被當前用戶收藏"""
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    existing = UserJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    
    return {
        'is_saved': existing is not None,
        'job_id': job_id
    }, 200

@user_job_bp.route('/user/jobs/batch_check', methods=['POST'])
def batchCheckJobsSaved():
    """批量檢查多個工作的收藏狀態"""
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    data = request.get_json()
    job_ids = data.get('job_ids', [])
    
    if not job_ids:
        return {'message': 'job_ids is required'}, 400
    
    # 查詢這些工作的收藏狀態
    saved_jobs = UserJob.query.filter(
        UserJob.user_id == user_id,
        UserJob.job_id.in_(job_ids)
    ).all()
    
    # 建立收藏狀態字典
    saved_job_ids = {uj.job_id for uj in saved_jobs}
    
    result = {}
    for job_id in job_ids:
        result[str(job_id)] = job_id in saved_job_ids
    
    return {
        'saved_status': result
    }, 200

@user_job_bp.route('/user/jobs/<int:job_id>', methods=['DELETE'])
def unsaveJob(job_id):
    """取消收藏指定的工作"""
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    # 查找要刪除的收藏記錄
    user_job = UserJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    
    if not user_job:
        return {'message': 'Job not found in your saved list'}, 404
    
    try:
        db.session.delete(user_job)
        db.session.commit()
        
        return {
            'message': 'Job removed from saved list successfully',
            'job_id': job_id
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to remove job from saved list',
            'error': str(e)
        }, 500