from models import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255))
    phone_number = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=True, unique=True)

    jobs = db.relationship('Job', back_populates='job_provider', cascade='all, delete-orphan')
    saved_jobs = db.relationship('UserJob', back_populates='user', cascade='all, delete-orphan')
    
    created_at = db.Column(db.Date, nullable=False, default=db.func.current_date())

    def __repr__(self):
        return f'<User {self.user_id}>'

    def get_id(self):
        return str(self.user_id)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'phone_number': self.phone_number,  # 添加電話號碼
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }