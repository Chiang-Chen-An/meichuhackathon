from models.User import User
from models.Job import Job, JobStatus
from models.JobApplication import JobApplication, ApplicationStatus
from models import db
from flask import request, jsonify, Blueprint, session
from sqlalchemy.exc import IntegrityError

recruit_bp = Blueprint('recruit', __name__)

@recruit_bp.route('/recruit/apply', methods=['POST'])
def apply_for_job():
    data = request.get_json()
    
    applicant_id = session.get('user_id')
    if not applicant_id:
        return {'message': 'Please login first'}, 401
    
    job_id = data.get('job_id', None)
    
    if not job_id:
        return {'message': 'Job ID is required'}, 400
    
    applicant = User.query.get(applicant_id)
    if not applicant:
        return {'message': 'Applicant does not exist'}, 404
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
    if job.status != JobStatus.OPEN:
        return {'message': 'This job is no longer accepting applications'}, 400
        
    if job.provider_id == applicant_id:
        return {'message': 'Cannot apply to your own job'}, 400
    
    try:
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

@recruit_bp.route('/recruit/applications', methods=['GET'])
def get_my_applications():
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()  
        return {'message': 'User not found'}, 404
    
    applications = JobApplication.query.filter_by(applicant_id=user_id).all()
    applications_list = [app.to_dict_for_applicant() for app in applications]
    
    return jsonify({
        'user_id': user_id,
        'applications': applications_list,
        'total_applications': len(applications_list)
    }), 200

@recruit_bp.route('/recruit/applications/user/<int:user_id>', methods=['GET'])
def get_user_applications(user_id):
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
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job does not exist'}, 404
    
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
    data = request.get_json()
    action = data.get('action', None)  
    
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    if not action or action not in ['accept', 'reject']:
        return {'message': 'Action must be either "accept" or "reject"'}, 400
    
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    if application.job.provider_id != current_user_id:
        return {'message': 'You are not authorized to review this application'}, 403
    
    if application.status != ApplicationStatus.APPLIED:
        return {'message': 'This application has already been reviewed'}, 400
    
    try:
        if action == 'accept':
            application.status = ApplicationStatus.ACCEPTED
            message = 'Application accepted successfully'
        else:  
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
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    return jsonify(application.to_dict()), 200

@recruit_bp.route('/recruit/application/<int:application_id>', methods=['DELETE'])
def withdraw_application(application_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return {'message': 'Please login first'}, 401
    
    application = JobApplication.query.get(application_id)
    if not application:
        return {'message': 'Application does not exist'}, 404
    
    if application.applicant_id != current_user_id:
        return {'message': 'You are not authorized to withdraw this application'}, 403
    
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