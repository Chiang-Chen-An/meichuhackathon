from flasgger import Swagger
from flask import Flask
# from flask_migrate import Migrate
from flask_restful import Api
from models import db, migrate
from controller.User import user_bp
from controller.Job import job_bp
from controller.recruit import recruit_bp
from controller.search import search_bp
from flask_cors import CORS

from controller.search import search_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://user:user@mysql:3306/db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 設定 secret key 用於 session 管理
app.config['SECRET_KEY'] = 'meichuhackathon2024-super-secret-key-for-session-management'
CORS(app)  
db.init_app(app)
migrate.init_app(app, db)
app.config['SWAGGER'] = {
    "title": "WEB API",
    "description": "API For MySQL",
    "version": "1.0.0",
    "termsOfService": "",
    "openapi": "3.0.2",
    "hide_top_bar": True
}

swag = Swagger(app, template_file = 'openapi.yml')
api = Api(app)

# API
app.register_blueprint(user_bp)
app.register_blueprint(job_bp)
app.register_blueprint(recruit_bp)
app.register_blueprint(search_bp)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)