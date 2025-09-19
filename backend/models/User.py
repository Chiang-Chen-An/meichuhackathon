from models import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone_number = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), nullable=True, unique=True)

    created_at = db.Column(db.Date, nullable=False, default=db.func.current_date())

    def __repr__(self):
        return f'<User {self.user_id}>'

    def get_id(self):
        return str(self.user_id)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }