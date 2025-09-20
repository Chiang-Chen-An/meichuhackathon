from models.Job import Job, JobStatus
from models import db
from flask import request, jsonify, Blueprint
from datetime import datetime
from sqlalchemy import and_

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/jobs', methods=['POST'])
def search_jobs():
    """搜尋工作 - 支援按名稱、類型、日期範圍搜尋"""
    
    data = request.get_json()
    # 取得查詢參數
    job_name = data.get('name', '').strip()
    job_type = data.get('type', '').strip()
    date_start = data.get('date_start', '').strip()
    date_end = data.get('date_end', '').strip()
    status = data.get('status', 'open').strip()  # 預設只搜尋開放的工作
    
    # 建立基本查詢
    query = Job.query
    
    # 狀態篩選
    if status in ['open', 'closed']:
        if status == 'open':
            query = query.filter(Job.status == JobStatus.OPEN)
        else:
            query = query.filter(Job.status == JobStatus.CLOSED)
    
    # 名稱搜尋（模糊搜尋）
    if job_name:
        query = query.filter(Job.job_name.contains(job_name))
    
    # 類型搜尋（模糊搜尋）
    if job_type:
        query = query.filter(Job.job_type.contains(job_type))
    
    # 日期範圍搜尋
    date_filters = []
    start_date = None
    end_date = None
    
    # 解析搜尋開始日期
    if date_start:
        try:
            start_date = datetime.strptime(date_start, '%Y-%m-%d').date()
        except ValueError:
            return {'message': 'Invalid date_start format. Please use YYYY-MM-DD format'}, 400
    
    # 解析搜尋結束日期
    if date_end:
        try:
            end_date = datetime.strptime(date_end, '%Y-%m-%d').date()
        except ValueError:
            return {'message': 'Invalid date_end format. Please use YYYY-MM-DD format'}, 400
    
    # 驗證搜尋的開始時間要比搜尋結束時間還早
    if start_date and end_date and start_date > end_date:
        return {'message': 'Search start date must be earlier than search end date'}, 400
    
    # 建立日期篩選條件
    if start_date:
        # 搜尋開始時間要早於工作的結束時間（工作的結束日期 >= 搜尋開始日期）
        date_filters.append(Job.date_end >= start_date)
    
    if end_date:
        # 搜尋的結束時間要在工作結束時間之前（工作的開始日期 <= 搜尋結束日期）
        date_filters.append(Job.date_start <= end_date)
    
    # 應用日期篩選
    if date_filters:
        query = query.filter(and_(*date_filters))
    
    try:
        # 執行查詢並按建立時間排序（最新的在前）
        jobs = query.order_by(Job.created_at.desc()).all()
        
        # 轉換為字典格式
        jobs_list = [job.to_dict() for job in jobs]
        
        # 準備回應資料
        search_params = {
            'name': job_name if job_name else None,
            'type': job_type if job_type else None,
            'date_start': date_start if date_start else None,
            'date_end': date_end if date_end else None,
            'status': status
        }
        
        return jsonify({
            'search_params': {k: v for k, v in search_params.items() if v is not None},
            'total_results': len(jobs_list),
            'jobs': jobs_list
        }), 200
        
    except Exception as e:
        return {
            'message': 'Failed to search jobs',
            'error': str(e)
        }, 500