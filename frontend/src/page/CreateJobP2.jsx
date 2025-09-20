import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createJob } from "../route/job";

import './CreateJobP2.css'

function CreateJobPageTwo() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [jobDataPage2, setJobDataPage2] = useState({
        date_start: '',
        date_end: '',
        video: null // 加入 video 欄位
    });
    const [jobDataPage1, setJobDataPage1] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null); // 預覽用
    
    useEffect(() => {
        const savedData = localStorage.getItem('jobDataPage1');
        if (!savedData) {
            navigate('/createjob1');
            return;
        }
        setJobDataPage1(JSON.parse(savedData));

        const savedDataPage2 = localStorage.getItem('jobDataPage2');
        if (savedDataPage2) {
            try {
                const parsedPage2Data = JSON.parse(savedDataPage2);
                setJobDataPage2(prev => ({
                    ...prev,
                    date_start: parsedPage2Data.date_start || '',
                    date_end: parsedPage2Data.date_end || ''
                    // 注意：檔案不能儲存在 localStorage，所以不包含 video
                }));
                console.log('已載入第二頁儲存的資料:', parsedPage2Data);
            } catch (error) {
                console.error('解析第二頁資料失敗:', error);
                localStorage.removeItem('jobDataPage2');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDataPage2(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // 驗證檔案類型
            if (!file.type.startsWith('video/')) {
                setError('請選擇影片檔案');
                return;
            }
            
            // 驗證檔案大小（例如限制 100MB）
            const maxSize = 100 * 1024 * 1024; // 100MB
            if (file.size > maxSize) {
                setError('影片檔案大小不能超過 100MB');
                return;
            }
            
            setJobDataPage2(prev => ({
                ...prev,
                video: file
            }));
            
            // 建立預覽 URL
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
            
            setError(''); // 清除錯誤
            console.log('選擇的影片:', file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (!jobDataPage2.date_start || !jobDataPage2.date_end) {
            setError('請填寫時間範圍');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        
        Object.keys(jobDataPage1).forEach(key => {
            formData.append(key, jobDataPage1[key]);
        });
        
        formData.append('date_start', jobDataPage2.date_start);
        formData.append('date_end', jobDataPage2.date_end);
        
        if (jobDataPage2.video) {
            formData.append('video', jobDataPage2.video);
        }
        
        try {
            const res = await createJob(formData); // 傳送 FormData
            console.log('Job created successfully:', res);
            
            alert('工作創建成功！');
            
            // 清理預覽 URL
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
            
            localStorage.removeItem('jobDataPage1');
            localStorage.removeItem('jobDataPage2');
            navigate('/');
            
        } catch (err) {
            console.error('Error creating job:', err);
            setError(err.message || '創建工作失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        // 只儲存基本資料，不包含檔案
        const dataToSave = {
            date_start: jobDataPage2.date_start,
            date_end: jobDataPage2.date_end
        };
        localStorage.setItem('jobDataPage2', JSON.stringify(dataToSave));
        console.log('儲存第二頁資料:', dataToSave);
        navigate('/createjob1');
    };

    // 清理預覽 URL
    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }
        };
    }, [videoPreview]);

    return (
        <div className="create-job-page-2">
            
            <h2 className="create-job-header-2">Provide Job</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="create-job-input-box-2 first-child">
                    <label htmlFor="date-start" className="create-job-label-2">Date:</label>
                    <div className="create-job-input-range-box-2">
                        <input 
                            type="date" 
                            id="date-start"
                            name="date_start"
                            className="create-job-input-range-2"
                            value={jobDataPage2.date_start}
                            onChange={handleChange}
                            required
                        />
                        ~
                        <input 
                            type="date" 
                            id="date-end"
                            name="date_end"
                            className="create-job-input-range-2"
                            value={jobDataPage2.date_end}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                
                <div className="create-job-input-box-2">
                    <label htmlFor="video" className="create-job-label-2">Video:</label>
                    <input 
                        type="file" 
                        id="video"
                        name="video"
                        accept="video/mp4,video/avi,video/mov,video/*"
                        onChange={handleFileChange}
                        className="video-input-box"
                    />
                    {jobDataPage2.video && (
                        <div style={{ marginTop: '10px', color: '#666' }}>
                            choose file: {jobDataPage2.video.name} 
                            ({(jobDataPage2.video.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                    
                </div>
                
                <div className="action-button-box-2">
                    <button type="button" className="action-button-2" onClick={handleBack}>
                        Previous
                    </button>
                    <button type="submit" className="action-button-2" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Job'}
                    </button>
                </div>
            </form>
        </div>
    );   
}

export default CreateJobPageTwo;