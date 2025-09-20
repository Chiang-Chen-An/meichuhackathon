from models import db
from enum import Enum

class ApplicationStatus(Enum):
    APPLIED = "applied"        # 已應徵（等待雇主審核）
    ACCEPTED = "accepted"      # 已接受
    REJECTED = "rejected"      # 已拒絕

class JobApplication(db.Model):
    __tablename__ = 'job_applications'

    application_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # 外鍵關聯
    applicant_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id', ondelete='CASCADE'), nullable=False)
    
    # 應徵狀態（簡化為三種狀態）
    status = db.Column(db.Enum(ApplicationStatus), nullable=False, default=ApplicationStatus.APPLIED)
    
    # 時間戳記
    applied_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # 關聯關係
    applicant = db.relationship('User', foreign_keys=[applicant_id], backref='applications')
    job = db.relationship('Job', foreign_keys=[job_id])
    
    # 複合唯一約束：同一使用者不能重複應徵同一工作
    __table_args__ = (db.UniqueConstraint('applicant_id', 'job_id', name='unique_user_job_application'),)

    def __repr__(self):
        return f'<JobApplication {self.application_id}: User {self.applicant_id} -> Job {self.job_id}>'

    def to_dict(self):
        return {
            'application_id': self.application_id,
            'applicant_id': self.applicant_id,
            'job_id': self.job_id,
            'job_name': self.job.job_name if self.job else None,
            'applicant_email': self.applicant.email if self.applicant else None,
            'status': self.status.value,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict_for_applicant(self):
        """為應徵者提供的簡化資訊"""
        return {
            'application_id': self.application_id,
            'job_id': self.job_id,
            'job_name': self.job.job_name if self.job else None,
            'company_email': self.job.job_provider.email if self.job and self.job.job_provider else None,
            'status': self.status.value,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict_for_employer(self):
        """為雇主提供的簡化資訊"""
        return {
            'application_id': self.application_id,
            'applicant_id': self.applicant_id,
            'applicant_email': self.applicant.email if self.applicant else None,
            'status': self.status.value,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }