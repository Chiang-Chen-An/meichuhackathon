from models.User import User
from models.Job import Job, JobStatus
from models.JobApplication import JobApplication, ApplicationStatus
from models import db
from flask import request, jsonify, Blueprint, session
from datetime import datetime
from sqlalchemy.exc import IntegrityError

recruit_bp = Blueprint('recruit', __name__)

@recruit_bp.route('/recruit/apply', methods=['POST'])
def apply_for_job():
    """簡化版應徵工作 - 只需要 job_id，自動從 session 取得應徵者 ID"""
    data = request.get_json()
    
    # 從 session 取得當前登入用戶
    applicant_id = session.get('user_id')
    if not applicant_id:
        return {'message': 'Please login first'}, 401
    
    job_id = data.get('job_id', None)
    
    # 驗證必要欄位
    if not job_id:
        return {'message': 'Job ID is required'}, 400
    
    # 檢查應徵者是否存在
    applicant = User.query.get(applicant_id)
    if not applicant:
        return {'message': 'Applicant does not exist'}, 404
    
    # 檢查工作是否存在
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    # 檢查工作是否開放應徵
    if job.status != JobStatus.OPEN:
        return {'message': 'This job is no longer accepting applications'}, 400
        
    # 檢查是否為自己發布的工作
    if job.provider_id == applicant_id:
        return {'message': 'Cannot apply to your own job'}, 400
    
    try:
        # 創建簡化的應徵記錄（自動記錄應徵時間）
        application = JobApplication(
            applicant_id=applicant_id,
            job_id=job_id,
            status=ApplicationStatus.APPLIED
        )
        
        db.session.add(application)
        db.session.commit()
        
        return {
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }, 201
        
    except IntegrityError:
        db.session.rollback()
        return {'message': 'You have already applied for this job'}, 409
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to submit application',
            'error': str(e)
        }, 500

@recruit_bp.route('/recruit/applications/user/<int:user_id>', methods=['GET'])
def get_user_applications(user_id):
    """取得使用者的所有應徵記錄"""
    user = User.query.get(user_id)
    if not user:
        return {'message': 'User does not exist'}, 404
    
    applications = JobApplication.query.filter_by(applicant_id=user_id).all()
    applications_list = [app.to_dict_for_applicant() for app in applications]
    
    return jsonify({
        'user_id': user_id,
        'applications': applications_list,
        'total_applications': len(applications_list)
    }), 200

@recruit_bp.route('/recruit/applications/job/<int:job_id>', methods=['GET'])
def get_job_applications(job_id):
    """取得特定工作的所有應徵者（僅限工作發布者查看）"""
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    # 驗證請求者是否為工作發布者
    if job.provider_id != current_user_id:
        return {'message': 'You are not authorized to view applications for this job'}, 403
    
    applications = JobApplication.query.filter_by(job_id=job_id).all()
    applications_list = [app.to_dict_for_employer() for app in applications]
    
    return jsonify({
        'job_id': job_id,
        'job_name': job.job_name,
        'applications': applications_list,
        'total_applications': len(applications_list)
    }), 200

@recruit_bp.route('/recruit/application/<int:application_id>/review', methods=['PUT'])
def review_application(application_id):
    """雇主審核應徵 - 只能選擇接受或拒絕"""
    data = request.get_json()
    action = data.get('action', None)  # 'accept' 或 'reject'
    
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    if not action or action not in ['accept', 'reject']:
        return {'message': 'Action must be either "accept" or "reject"'}, 400
    
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    # 驗證請求者是否為工作發布者
    if application.job.provider_id != current_user_id:
        return {'message': 'You are not authorized to review this application'}, 403
    
    # 只有在 APPLIED 狀態下才能審核
    if application.status != ApplicationStatus.APPLIED:
        return {'message': 'This application has already been reviewed'}, 400
    
    try:
        # 根據雇主的選擇設定狀態
        if action == 'accept':
            application.status = ApplicationStatus.ACCEPTED
            message = 'Application accepted successfully'
        else:  # action == 'reject'
            application.status = ApplicationStatus.REJECTED
            message = 'Application rejected successfully'
        
        db.session.commit()
        
        return {
            'message': message,
            'application': application.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to review application',
            'error': str(e)
        }, 500

@recruit_bp.route('/recruit/application/<int:application_id>', methods=['GET'])
def get_application_detail(application_id):
    """取得特定應徵記錄詳情"""
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    return jsonify(application.to_dict()), 200

@recruit_bp.route('/recruit/application/<int:application_id>', methods=['DELETE'])
def withdraw_application(application_id):
    """撤回應徵（僅限應徵者本人）"""
    # 從 session 取得當前登入用戶
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    # 驗證請求者是否為應徵者本人
    if application.applicant_id != current_user_id:
        return {'message': 'You are not authorized to withdraw this application'}, 403
    
    # 只有在"已應徵"狀態下才能撤回
    if application.status != ApplicationStatus.APPLIED:
        return {'message': 'Can only withdraw applications that have not been reviewed'}, 400
    
    try:
        db.session.delete(application)
        db.session.commit()
        
        return {'message': 'Application withdrawn successfully'}, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to withdraw application',
            'error': str(e)
        }, 500