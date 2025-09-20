from models.User import User
from models import db
from flask import request, jsonify, Blueprint, session
from werkzeug.security import generate_password_hash, check_password_hash


user_bp = Blueprint('user', __name__)

@user_bp.route('/user/<int:user_id>', methods=['GET'])
def getUserbyId(user_id):
    user = User.query.get(user_id)

    if not user:
        return { 'message': 'User not found' }, 404
    
    return jsonify(user.to_dict())

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    phone_number = data.get("phone_number", None)
    password = data.get("password", None)
    email = data.get("email", None)

    if not phone_number or not password:
        return { 'message': 'Lack of necessary parameter' }, 404
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)

    try:
        user = User(
            phone_number = phone_number,
            password = hashed_password,
            email = email
        )

        db.session.add(user)
        db.session.commit()

        return {
            'message': 'Register Successfully',
            'User': user.__repr__(),
        }, 200
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Registration Failed',
            'error': str(e)
        }, 500
    
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    phone_number = data.get("phone_number", None)
    password = data.get("password", None)

    if not phone_number or not password:
        return { 'message': 'Lack of necessary parameter' }, 404
    
    try:
        user = User.query.filter_by(phone_number=phone_number).first()

        if not user:
            return { 'message': 'phone number or password not correct' }, 401
        
        check = check_password_hash(user.password, password)

        if not check:
            return { 'message': 'phone number or password not correct' }, 401
        
        # 設定 session 記錄登入狀態
        session['user_id'] = user.user_id
        session['phone_number'] = user.phone_number
        
        return { 
            'message': 'Login Successfully',
            'User': user.to_dict()
        }, 200
    
    except Exception as e:
        return {
            'message': 'Login Failed',
            'error': str(e)
        }, 500

@user_bp.route('/logout', methods=['POST'])
def logout():
    """登出並清除 session"""
    session.clear()
    return {'message': 'Logout successfully'}, 200

@user_bp.route('/current_user', methods=['GET'])
def get_current_user():
    """取得當前登入的使用者資訊"""
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Not logged in'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()  # 清除無效的 session
        return {'message': 'User not found'}, 404
    
    return jsonify(user.to_dict()), 200