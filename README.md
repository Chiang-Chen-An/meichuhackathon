# meichuhackathon

## Environment

Depends on docker file

### docker

用 `docker-compose.yml` 來啟動
```bash
docker compose up --build
```

### backend

#### database

用 `sqlalchemy` 來定義資料庫，可以用物件導向的方式來做 `CRUD` 相關行為，以下是相關的指令（要在 `./backend` 中執行）：

1. 到最新版的資料庫
    ```bash
    flask db upgrade
    ```
2. 回到上一版的資料庫
    ```bash
    flask db downgrade
    ```
3. 更新資料庫要自動產生 migration 檔案
    ```bash
    flask db migrate -m "<commit message>"
    ```
