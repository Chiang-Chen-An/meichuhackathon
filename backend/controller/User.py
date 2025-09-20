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

    if not phone_number or not password or not email:
        return { 'message': 'Phone number, password and email are required' }, 400
    
    # 驗證 phone_number 只能包含數字
    if not phone_number.isdigit():
        return { 'message': 'Phone number must contain only digits' }, 400
    
    # 驗證 phone_number 長度（台灣手機號碼通常是10位數）
    if len(phone_number) < 8 or len(phone_number) > 15:
        return { 'message': 'Phone number must be between 8 and 15 digits' }, 400
    
    # 驗證 password 長度
    if len(password) < 6:
        return { 'message': 'Password must be at least 6 characters long' }, 400
    
    # 驗證 email 格式
    if '@' not in email or '.' not in email or len(email) < 5:
        return { 'message': 'Invalid email format' }, 400
    
    # 檢查 phone_number 是否已存在
    existing_phone = User.query.filter_by(phone_number=phone_number).first()
    if existing_phone:
        return { 'message': 'Phone number already exists' }, 409
    
    # 檢查 email 是否已存在
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return { 'message': 'Email already exists' }, 409
    
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
        }, 201
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Registration Failed',
            'error': str(e)
        }, 500
    
@user_bp.route('/login', methods=['POST'])
def login():
    # 檢查是否已經登入
    if session.get('user_id'):
        current_user_id = session.get('user_id')
        current_user = User.query.get(current_user_id)
        if current_user:
            return { 
                'message': 'Already logged in',
                'User': current_user.to_dict()
            }, 400
        else:
            # 如果 session 中的用戶不存在，清除 session
            session.clear()
    
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

@user_bp.route('/user/profile', methods=['PUT'])
def update_profile():
    """更新當前登入用戶的個人資料"""
    # 從 session 取得當前登入用戶
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()  # 清除無效的 session
        return {'message': 'User not found'}, 404
    
    data = request.get_json()
    if not data:
        return {'message': 'No data provided'}, 400
    
    email = data.get('email', None)
    password = data.get('password', None)
    
    # 檢查是否有提供要更新的欄位
    if not email and not password:
        return {'message': 'No valid fields to update (email or password)'}, 400
    
    try:
        password_changed = False
        
        # 更新 email
        if email:
            # 檢查 email 格式（簡單驗證）
            if '@' not in email or '.' not in email:
                return {'message': 'Invalid email format'}, 400
            
            # 檢查 email 是否已被其他用戶使用
            existing_user = User.query.filter(User.email == email, User.user_id != user_id).first()
            if existing_user:
                return {'message': 'Email already exists'}, 409
            
            user.email = email
        
        # 更新 password
        if password:
            # 檢查密碼長度
            if len(password) < 6:
                return {'message': 'Password must be at least 6 characters long'}, 400
            
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
            user.password = hashed_password
            password_changed = True
        
        db.session.commit()
        
        # 如果密碼有改變，清除 session 強制重新登入
        if password_changed:
            session.clear()
            return {
                'message': 'Password updated successfully. Please login again.',
                'user': user.to_dict(),
                'logout': True
            }, 200
        
        return {
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }, 200
        
    except Exception as e:
        db.session.rollback()
        return {
            'message': 'Failed to update profile',
            'error': str(e)
        }, 500