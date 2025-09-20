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
    username = data.get('username', None)

    if not phone_number or not password or not email:
        return { 'message': 'Phone number, password and email are required' }, 400
    
    if not phone_number.isdigit():
        return { 'message': 'Phone number must contain only digits' }, 400
    
    if len(phone_number) < 8 or len(phone_number) > 15:
        return { 'message': 'Phone number must be between 8 and 15 digits' }, 400
    
    if len(password) < 6:
        return { 'message': 'Password must be at least 6 characters long' }, 400
    
    if '@' not in email or '.' not in email or len(email) < 5:
        return { 'message': 'Invalid email format' }, 400
    
    existing_phone = User.query.filter_by(phone_number=phone_number).first()
    if existing_phone:
        return { 'message': 'Phone number already exists' }, 409
    
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

        db.session.flush()

        if not username:
            username = f'User#{user.user_id}'
        
        user.username = username

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
    if session.get('user_id'):
        current_user_id = session.get('user_id')
        current_user = User.query.get(current_user_id)
        if current_user:
            return {
                'message': 'Already logged in',
                'User': current_user.to_dict()
            }, 400
        else:
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
    session.clear()
    return {'message': 'Logout successfully'}, 200

@user_bp.route('/current_user', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Not logged in'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()  
        return {'message': 'User not found'}, 404
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/user/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear() 
        return {'message': 'User not found'}, 404
    
    data = request.get_json()
    if not data:
        return {'message': 'No data provided'}, 400
    
    email = data.get('email', None)
    password = data.get('password', None)
    
    if not email and not password:
        return {'message': 'No valid fields to update (email or password)'}, 400
    
    try:
        password_changed = False
        
        if email:
            if '@' not in email or '.' not in email:
                return {'message': 'Invalid email format'}, 400
            
            existing_user = User.query.filter(User.email == email, User.user_id != user_id).first()
            if existing_user:
                return {'message': 'Email already exists'}, 409
            
            user.email = email
        
        if password:
            if len(password) < 6:
                return {'message': 'Password must be at least 6 characters long'}, 400
            
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
            user.password = hashed_password
            password_changed = True
        
        db.session.commit()
        
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

@user_bp.route('/update/username', methods=['PUT'])
def updateUsername():
    user_id = session.get('user_id')
    if not user_id:
        return {'message': 'Please login first'}, 401
    
    user = User.query.get(user_id)
    if not user:
        session.clear()
        return {'message': 'User not found'}, 404
    
    data = request.get_json()

    username = data.get('username', None)

    if not username:
        return { 'message': 'Username can not be empty' }, 404
    
    try:
        user.username = username
        db.session.commit()

        return { 'message': 'Username update successfully' }, 200
    except Exception as error:
        db.session.rollback()

        return { 'message': 'Username update failed.', 'Error': str(error) }, 500
         