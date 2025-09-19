from models.User import User
from models.Job import Job
from models import db
from flask import request, jsonify, Blueprint

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
    data = request.get_json()

    job_name = data.get('job_name', None)
    payment_low = data.get('payment_low', None)
    payment_high = data.get('payment_high', None)

    date_start = data.get('date_start', None)
    date_end = data.get('date_end', None)

    job_type = data.get('job_type', None) # no necessary

    provider_id = data.get('provider_id', None)

    if not job_name or not payment_low or not payment_high or not date_start or not date_end or not provider_id:
        return { 'message': 'Lack of necessary information' }, 400
    

    try:
        job = Job(
            job_name = job_name,
            payment_low = payment_low,
            payment_high = payment_high,
            date_start = date_start,
            date_end = date_end,
            job_type = job_type,
            provider_id = provider_id
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

@job_bp.route('/job', methods=['GET'])
def getAlljob():
    jobs = Job.query.all()
    jobs_list = [job.to_dict() for job in jobs]
    return jsonify(jobs_list), 200