from models import db
from enum import Enum

class JobStatus(Enum):
    OPEN = "open"        # 開放應徵
    CLOSED = "closed"    # 關閉應徵

class Job(db.Model):
    __tablename__ = 'jobs'

    job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_name = db.Column(db.String(255), nullable=False)

    payment_low = db.Column(db.Integer, nullable=False)
    payment_high = db.Column(db.Integer, nullable=False)

    date_start = db.Column(db.Date, nullable=False)
    date_end = db.Column(db.Date, nullable=False)
    job_type = db.Column(db.String(255))

    video_filename = db.Column(db.String(255))
    
    # 工作狀態
    status = db.Column(db.Enum(JobStatus), nullable=False, default=JobStatus.OPEN)

    provider_id = db.Column(db.Integer, db.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False)
    job_provider = db.relationship('User', back_populates='jobs')

    saved_by_users = db.relationship('UserJob', back_populates='job', cascade='all, delete-orphan')
    
    created_at = db.Column(db.Date, nullable=False, default=db.func.current_date())
    
    # 與 JobApplication 的關聯關係，設定 cascade 刪除
    applications = db.relationship('JobApplication', backref='job_ref', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Job {self.job_id}, {self.job_name}>'

    def get_id(self):
        return str(self.job_id)

    def to_dict(self):
        return {
            'job_id': self.job_id,
            'job_name': self.job_name,
            'type': self.job_type,
            'payment': f'{self.payment_low} ~ {self.payment_high}',
            'date': f'{self.date_start} ~ {self.date_end}',
            'status': self.status.value,
            'job_provider_id': self.provider_id,
            'create_at': self.created_at,
            'video_filename': self.video_filename
        }