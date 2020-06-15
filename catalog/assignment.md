# 商品目錄 API
## 資料欄位
- `name` 商品名稱
- `price` 商品價格
- `description` 商品說明
- `count` 商品庫存量

## 新增
- 請求方式為 **POST**
- 路徑為 `/new`
- 只接受 `application/json` 格式
  ```js
  {
    "name": "",
    "price": 0,
    "description": "",
    "count": 0
  }
  ```
- 回傳相應狀態碼、是否成功、失敗訊息及商品 ID，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
    "id": ""
  }
  ```

## 修改
- 請求方式為 **PATCH**
- 路徑為 `/update`，以 param 判斷要修改的項目
- 能以 ID 修改庫存量、名稱、說明及價格
- 只接受 `application/json` 格式，`id` 是商品 ID，`data` 是要修改的資料
  ```js
  {
    "id": "",
    "data": ""
  }
  ```
- 回傳相應狀態碼、是否成功、失敗訊息，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
  }
  ```

## 刪除
- 請求方式為 **DELETE**
- 路徑為 `/delete`
- 只接受 `application/json` 格式，`id` 是商品 ID
  ```json
  {
    "id": ""
  }
  ```
- 回傳相應狀態碼、是否成功、失敗訊息，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
  }
  ```

## 查詢商品
- 請求方式為 **GET**
- 路徑為 `/product`
- 以 `id` 查詢商品資料
- 回傳相應狀態碼、是否成功、失敗訊息，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
    "name": "",
    "price": 0,
    "description": "",
    "count": 0
  }
  ```

## 查詢所有商品
- 請求方式為 **GET**
- 路徑為 `/all`
- 回傳是否成功、失敗訊息，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
    "products": [
      {
        "name": "",
        "price": 0,
        "description": "",
        "count": 0
      }
      // 其他商品...
    ]
  }
  ```

## 查詢庫存商品
- 請求方式為 **GET**
- 路徑為 `/instock`
- 僅顯示庫存量大於 0 的商品
- 回傳是否成功、失敗訊息，資料格式為 JSON
  ```js
  {
    "success": true,
    "message": "",
    "products": [
      {
        "name": "",
        "price": 0,
        "description": "",
        "count": 0
      }
      // 其他商品...
    ]
  }
  ```