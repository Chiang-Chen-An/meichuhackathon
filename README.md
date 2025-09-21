# meichuhackathon

## About the APP

為第三世界打造一款人力資源 app，讓他們能夠更快速的找到工作，功能如下：

1. 登入以及註冊功能
2. 建立（提供）新的工作
3. 透過短影音的方式來尋找工作
4. 可儲存有興趣的工作
5. 提供工作提供者電話給有需求的人

## Environment

Depends on docker file，目前有三個 services，分別為 `backend`, `frontend` 以及 `mysql`

### docker

用 `docker-compose.yml` 來啟動
```bash
docker compose up --build
```
如果有缺少module 嘗試以下指令
```bash
docker-compose up --build --no-cache
```

### backend

#### database

用 `flask-sqlalchemy` 來定義資料庫，可以用物件導向的方式來做 `CRUD` 相關行為，以下是相關的指令（要在 `./backend` 中執行）：

1. 到最新版的資料庫
    ```bash
    docker exec -it backend flask db upgrade
    ```
2. 回到上一版的資料庫
    ```bash
    docker exec -it backend flask db downgrade
    ```
3. 更新資料庫要自動產生 migration 檔案
    ```bash
    docker exec -it backend flask db migrate -m "<commit message>"
    ```

#### Video

目前暫時存在 local 端的資料夾中，資料夾位置為 `./backend/video`，影片的檔名為 `video_{job_id}.mp4`

#### Swagger

用 `openapi.yml` 來產生 swagger GUI 的界面，可以由 http://127.0.0.1:8000/apidocs 進入

### frontend

以 React 為前端架構，跑在 `http://127.0.0.1:5173`，用 `axios` 作為 http client

### TODO list
-   [ ] 不同身份不同界面
-   [ ] 短影音,列表式瀏覽模式
-   [ ] 符合當地通訊習慣
-   [ ] 身份審核機制
-   [ ] 便捷儲存工作介紹或是職缺（短影音模式）
-   [ ] 建立評價和投訴機制
-   [ ] 職缺分類搜尋
-   [ ] 短影音可以再沒有影片的情況下可自己設定BGM或是配音（畫面可由工作簡要自動生成一張圖片）