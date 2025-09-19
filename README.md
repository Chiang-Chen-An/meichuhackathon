# meichuhackathon

## Environment

Depends on docker file

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

用 `sqlalchemy` 來定義資料庫，可以用物件導向的方式來做 `CRUD` 相關行為，以下是相關的指令（要在 `./backend` 中執行）：

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

#### ai discussion
[aistudio](https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2210S6IUUipwQ_8piAc-YjcDdZf9HNw9pSv%22%5D,%22action%22:%22open%22,%22userId%22:%22117184502395428158266%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing)

### TODO list
-   [ ] 不同身份不同界面
-   [ ] 短影音,列表式瀏覽模式
-   [ ] 符合當地通訊習慣
-   [ ] 身份審核機制
-   [ ] 便捷儲存工作介紹或是職缺（短影音模式）
-   [ ] 建立評價和投訴機制
-   [ ] 職缺分類搜尋
-   [ ] 短影音可以再沒有影片的情況下可自己設定BGM或是配音（畫面可由工作簡要自動生成一張圖片）
-   [ ] 仿照 [104](https://www.104.com.tw/job/3v4x8?jobsource=index_job) 的界面設計六個block來當作詳細介紹

### DEMO
![alt text](<Generated Image September 19, 2025 - 11_34PM.png>)
![alt text](image.png)
![alt text](image-1.png)