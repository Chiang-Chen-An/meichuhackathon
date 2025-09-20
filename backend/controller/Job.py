from models.User import User
from models.Job import Job, JobStatus
from models import db
from flask import request, jsonify, Blueprint, session
from datetime import datetime

job_bp = Blueprint('job', __name__)

@job_bp.route('/job/<int:job_id>', methods=['GET'])
def getJobbyId(job_id):
    job = Job.query.get(job_id)

    if not job:
        return { 'message': 'Job does not exist' }, 404
    
    return jsonify(job.to_dict()), 200

@job_bp.route('/job/provider/<int:provider_id>', methods=['GET'])
def getJobbyProvider(provider_id):
    provider = User.query.get(provider_id)

    if not provider:
        return { 'message': 'Provider is not exist' }, 404
    
    jobs = provider.jobs
    jobs_list = [job.to_dict() for job in jobs]
    
    return jsonify(jobs_list), 200

@job_bp.route('/job', methods=['POST'])
def createJob():
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    data = request.get_json()

    job_name = data.get('job_name', None)
    payment_low = data.get('payment_low', None)
    payment_high = data.get('payment_high', None)

    date_start = data.get('date_start', None)
    date_end = data.get('date_end', None)

    job_type = data.get('job_type', None) # no necessary

    if not job_name or not payment_low or not payment_high or not date_start or not date_end:
        return { 'message': 'Lack of necessary information' }, 400
    
    # 驗證日期格式和邏輯
    try:
        # 嘗試解析日期字符串（假設格式為 YYYY-MM-DD）
        start_date = datetime.strptime(date_start, '%Y-%m-%d').date()
        end_date = datetime.strptime(date_end, '%Y-%m-%d').date()
        
        # 驗證開始日期必須早於結束日期
        if start_date >= end_date:
            return { 'message': 'Date start must be earlier than date end' }, 400
            
    except ValueError as e:
        return { 'message': 'Invalid date format. Please use YYYY-MM-DD format' }, 400

    try:
        job = Job(
            job_name = job_name,
            payment_low = payment_low,
            payment_high = payment_high,
            date_start = start_date,
            date_end = end_date,
            job_type = job_type,
            provider_id = current_user_id
        )

        db.session.add(job)
        db.session.commit()
    
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Create Job Failed',
            'error': str(e)
        }, 500
    
    return {
        'message': 'Create Job Successfully',
        'Job': job.to_dict()
    }, 201

@job_bp.route('/job/my-jobs', methods=['GET'])
def getMyJobs():
    """取得當前登入用戶發布的所有工作"""
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    provider = User.query.get(current_user_id)
    if not provider:
        session.clear()  # 清除無效的 session
        return {'message': 'User not found'}, 404
    
    jobs = provider.jobs
    jobs_list = [job.to_dict() for job in jobs]
    
    return jsonify({
        'provider_id': current_user_id,
        'provider_email': provider.email,
        'jobs': jobs_list,
        'total_jobs': len(jobs_list)
    }), 200

@job_bp.route('/job', methods=['GET'])
def getAlljob():
    jobs = Job.query.all()
    jobs_list = [job.to_dict() for job in jobs]
    return jsonify(jobs_list), 200

@job_bp.route('/job/<int:job_id>/status', methods=['PUT'])
def updateJobStatus(job_id):
    """更新工作狀態 - 開放或關閉應徵"""
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    data = request.get_json()
    new_status = data.get('status', None)
    
    # 驗證狀態值
    if not new_status or new_status not in ['open', 'closed']:
        return {'message': 'Status must be either "open" or "closed"'}, 400
    
    # 檢查工作是否存在
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    # 檢查是否為工作發布者
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to update this job status'}, 403
    
    try:
        # 更新工作狀態
        if new_status == 'open':
            job.status = JobStatus.OPEN
            message = 'Job opened for applications'
        else:  # new_status == 'closed'
            job.status = JobStatus.CLOSED
            message = 'Job closed for applications'
        
        db.session.commit()
        
        return {
            'message': message,
            'job': job.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to update job status',
            'error': str(e)
        }, 500

@job_bp.route('/job/<int:job_id>', methods=['DELETE'])
def deleteJob(job_id):
    """刪除工作 - 只有工作發布者可以刪除"""
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    # 檢查工作是否存在
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    # 檢查是否為工作發布者
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to delete this job'}, 403
    
    try:
        # 先刪除相關的應徵記錄
        from models.JobApplication import JobApplication
        JobApplication.query.filter_by(job_id=job_id).delete()
        
        # 然後刪除工作
        db.session.delete(job)
        db.session.commit()
        
        return {
            'message': 'Job deleted successfully',
            'deleted_job_id': job_id
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to delete job',
            'error': str(e)
        }, 500