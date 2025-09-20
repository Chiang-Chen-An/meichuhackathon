from models import db

class UserJob(db.Model):
    __tablename__ = 'userjob'

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)

    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), primary_key=True)

    saved_date = db.Column(db.Date, nullable=False, default=db.func.current_date())

    user = db.relationship('User', back_populates='saved_jobs')
    job = db.relationship('Job', back_populates='saved_by_users')

    def to_dict(self):  # 修正：加入 self 參數
        return {
            'user_id': self.user_id,
            'job_id': self.job_id,
            'saved_date': self.saved_date.isoformat() if self.saved_date else None
        }

    def __repr__(self):
        return f'<UserJob user_id={self.user_id}, job_id={self.job_id}>'