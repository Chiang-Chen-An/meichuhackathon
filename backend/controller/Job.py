from models.User import User
from models.JobApplication import JobApplication
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
        return {'message': 'Please login first', 'session': session}, 401
    
    # data = request.get_json()

    job_name = request.form.get('job_name', None)
    payment_low = request.form.get('payment_low', None)
    payment_high = request.form.get('payment_high', None)
    date_start = request.form.get('date_start', None)
    date_end = request.form.get('date_end', None)
    job_type = request.form.get('job_type', None)  # no necessary

    if not job_name or not payment_low or not payment_high or not date_start or not date_end:
        return { 'message': 'Lack of necessary information' }, 400
    
    try:
        payment_low = float(payment_low)
        payment_high = float(payment_high)
        
        if payment_low > payment_high:
            return { 'message': 'Payment low must be less than or equal to payment high' }, 400
            
    except (ValueError, TypeError):
        return { 'message': 'Invalid payment values' }, 400
    
    # 驗證日期格式和邏輯
    try:
        # 嘗試解析日期字符串（假設格式為 YYYY-MM-DD）
        start_date = datetime.strptime(date_start, '%Y-%m-%d').date()
        end_date = datetime.strptime(date_end, '%Y-%m-%d').date()
        
        # 驗證開始日期必須早於結束日期
        if start_date > end_date:
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
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    provider = User.query.get(current_user_id)
    if not provider:
        session.clear()  
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
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    data = request.get_json()
    new_status = data.get('status', None)
    
    if not new_status or new_status not in ['open', 'closed']:
        return {'message': 'Status must be either "open" or "closed"'}, 400
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to update this job status'}, 403
    
    try:
        if new_status == 'open':
            job.status = JobStatus.OPEN
            message = 'Job opened for applications'
        else:  
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

@job_bp.route('/job/<int:job_id>', methods=['PUT'])
def updateJob(job_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to update this job'}, 403
    
    data = request.get_json()
    
    job_name = data.get('job_name', None)
    payment_low = data.get('payment_low', None)
    payment_high = data.get('payment_high', None)
    date_start = data.get('date_start', None)
    date_end = data.get('date_end', None)
    job_type = data.get('job_type', None)
    
    start_date = None
    end_date = None
    
    if date_start or date_end:
        try:
            if date_start:
                start_date = datetime.strptime(date_start, '%Y-%m-%d').date()
            else:
                start_date = job.date_start
                
            if date_end:
                end_date = datetime.strptime(date_end, '%Y-%m-%d').date()
            else:
                end_date = job.date_end
                
            if start_date > end_date:
                return {'message': 'Date start must be earlier than date end'}, 400
                
        except ValueError as e:
            return {'message': 'Invalid date format. Please use YYYY-MM-DD format'}, 400
    
    if payment_low is not None and payment_high is not None:
        if payment_low > payment_high:
            return {'message': 'Payment low must be less than or equal to payment high'}, 400
    elif payment_low is not None and job.payment_high is not None:
        if payment_low > job.payment_high:
            return {'message': 'Payment low must be less than or equal to current payment high'}, 400
    elif payment_high is not None and job.payment_low is not None:
        if job.payment_low > payment_high:
            return {'message': 'Current payment low must be less than or equal to payment high'}, 400
    
    try:
        if job_name is not None:
            job.job_name = job_name.strip()
        if payment_low is not None:
            job.payment_low = payment_low
        if payment_high is not None:
            job.payment_high = payment_high
        if date_start:
            job.date_start = start_date
        if date_end:
            job.date_end = end_date
        if job_type is not None:
            job.job_type = job_type.strip() if job_type else None
        
        db.session.commit()
        
        return {
            'message': 'Job updated successfully',
            'job': job.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to update job',
            'error': str(e)
        }, 500

@job_bp.route('/job/<int:job_id>', methods=['DELETE'])
def deleteJob(job_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to delete this job'}, 403
    
    try: 
        JobApplication.query.filter_by(job_id=job_id).delete()
        
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