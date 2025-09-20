from models.Job import Job, JobStatus
from flask import request, jsonify, Blueprint
from datetime import datetime

search_bp = Blueprint('search', __name__)

@search_bp.route('/search/jobs', methods=['POST'])
def search_jobs():
    """搜尋工作 - 支援按名稱、類型、日期範圍搜尋"""
    
    data = request.get_json()
    # 取得查詢參數
    keyword = data.get('keyword', '').strip()  # 合併為關鍵字搜尋
    date_start = data.get('date_start', '').strip()
    date_end = data.get('date_end', '').strip()
    status = data.get('status', 'open').strip() 
    
    # 開始建立查詢，先根據狀態篩選
    if status == 'open':
        query = Job.query.filter(Job.status == JobStatus.OPEN)
    elif status == 'closed':
        query = Job.query.filter(Job.status == JobStatus.CLOSED)
    else:
        query = Job.query
    
    # 關鍵字搜尋（同時搜尋名稱和類型）
    if keyword:
        query = query.filter(
            (Job.job_name.contains(keyword)) |
            (Job.job_type.contains(keyword))
        )
    
    # 日期範圍搜尋
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

    # 日期篩選
    if start_date:
        query = query.filter(Job.date_end >= start_date)
    if end_date:
        query = query.filter(Job.date_start <= end_date)

    try:
        jobs = query.order_by(Job.created_at.desc()).all() 
        jobs_list = [job.to_dict() for job in jobs]
        
        # 準備回應資料
        search_params = {
            'keyword': keyword if keyword else None,
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