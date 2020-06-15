// import md5 from 'md5'
import express from 'express'
import cors from 'cors' // Express 處理跨網域要求
import bodyParser from 'body-parser'
import multer from 'multer' // 檔案上傳套件
import path from 'path' // Node.js 預設的路徑套件 (不用npm install)
import fs from 'fs' // Node.js 預設的檔案套件
import session from 'express-session' // 登入狀態
import connectMongo from 'connect-mongo' // 將登入狀態存入資料庫
import db from './db.js'

const MongoStore = connectMongo(session)
const app = express()

app.use(session({
  secret: 'sdlddlkfg', // 密鑰，加密認證資料用
  cookie: { // 登入狀態有效毫秒
    maxAge: 1000 * 60 * 30
  },
  saveUninitialized: false, // 是否保存沒有被修改的連線狀態
  rolling: true, // 是否每次重新計算過期時間
  store: new MongoStore({
    mongooseConnection: db.connection
  })
}))
app.use(cors({ // 使用cors 套件解決前台AJAX 跨網域問題
  origin (origin, callback) {
    /*
      origin 來源網域
      callback (錯誤, 是否允許)
    */
    callback(null, true)
  },
  credentials: true // 是否允許認證資訊
}))
app.use(bodyParser.json())

const upload = multer({ // 檔案上傳設定
  storage: multer.diskStorage({ // 檔案儲存，multer.diskstroage 代表存在本機上
    destination (req, file, cb) { // 儲存路徑
      /*
        req 代表使用者丟進來的資料
        file 代表使用者上傳的檔案
        cb 代表回應 (callback)
      */
      cb(null, 'images/') // cb(錯誤訊息，沒有就是null, 路徑)
    },
    filename (req, file, cb) { // 檔名
      const now = Date.now() // 目前時間
      const ext = path.extname(file.originalname) // 副檔名，使用path 套件取得上傳原始檔之副檔名
      cb(null, now + ext) // cb(錯誤訊息，沒有就是null, 檔名)
    }
  }),
  limits: {
    fileSize: 1024 * 1024 // 檔案大小限制 1MB
  },
  fileFilter (req, file, cb) {
    if (file.mimetype.includes('image')) { // 檔案類型(mimetype) 有無包含image 文字
      cb(null, true) // cb(沒有錯誤, 接受檔案)
    } else { // LIMIT_FORMAT 是自訂的錯誤CODE，統一用內建的錯誤CODE 格式
      cb(new multer.MulterError('LIMIT_FORMAT'), false) // 觸發multer 錯誤，不接受檔案
    }
  }
})

app.post('/new', async (req, res) => { // 新增資料
  if (!req.headers['content-type'].includes('multipart/form-data')) { // 因為要上傳檔案，要注意postman body 格式是form-data，不是raw json
    res.status(400)
    res.send({
      success: false,
      msg: 'unqualified post format'
    })
    return
  }
  /* 有單個上傳進來的檔案，欄位是image
    req 進來的東西
    res 要出去的東西
    err 檔案上傳的錯誤
    upload.single(欄位)(上傳完畢後的function)
   */
  upload.single('image')(req, res, async err => { // 處理錯誤訊息
    if (err instanceof multer.MulterError) { // 若是上傳發生錯誤
      const msg = (err.code === 'LIMIT_FILE_SIZE') ? 'file too big' : 'wrong image type'
      res.status(400)
      res.send({
        success: false,
        msg: msg
      })
    } else if (err) { // 若不是上傳的錯誤
      res.status(500)
      res.send({
        success: false,
        msg: 'errors from server'
      })
    } else { // 成功寫入資料庫
      try {
        const result = await db.catalog.create({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          count: req.body.count,
          image: req.file.filename
        })
        res.status(200)
        res.send({
          success: true,
          msg: 'post done',
          id: result._id
        })
      } catch (err) {
        const key = Object.keys(err.errors)[0]
        const msg = err.errors[key].message
        res.status(400)
        res.send({
          success: false,
          msg: msg
        })
      }
    }
  })
})

app.post('/login', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({
      success: false,
      msg: 'wrong format type'
    })
    return
  }
  try {
    const result = db.users.find({
      account: req.body.account,
      password: req.body.password
    })
    if (result.length > 0) {
      const account = result[0].account
      req.session.user = result[0]
      res.status(200)
      res.send({
        success: true,
        msg: 'post account done',
        account
      })
    } else {
      res.status(200)
      res.send({
        success: false,
        msg: 'wrong account and password'
      })
    }
  } catch (err) {
    res.status(400)
    res.send({
      success: false,
      msg: 'wrong account and password'
    })
  }
})

app.patch('/update/:type', async (req, res) => { // 修改資料
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({
      success: false,
      msg: 'unqualified format'
    })
    return
  }
  if (req.params.type !== 'name' &&
  req.params.type !== 'price' &&
  req.params.type !== 'description' &&
  req.params.type !== 'count') {
    res.status(400)
    res.send({
      success: false,
      msg: 'unqulified update type'
    })
    return
  }
  try {
    const result = await db.catalog.findByIdAndUpdate(req.body.id, { [req.params.type]: req.body.data }, { new: true })
    console.log(result)
    res.status(200)
    res.send({
      success: true,
      msg: 'update done'
    })
  } catch (err) {
    res.status(500)
    res.send({
      success: false,
      msg: 'errors from server'
    })
  }
})

app.delete('/delete', async (req, res) => { // 刪除資料
  if (req.headers['content-type'] !== 'application/json') { // 拒絕不是json 格式的資料
    res.status(400)
    res.send({ success: false, msg: 'unqualified format' })
    return
  }
  try {
    const result = await db.catalog.findByIdAndDelete(req.body.id)
    if (result === null) {
      res.status(404)
      res.send({
        success: false,
        msg: 'no item found'
      })
    } else {
      res.status(200)
      res.send({
        success: true,
        msg: 'delete done'
      })
    }
  } catch (err) {
    res.status(500)
    res.send({ success: false, msg: 'errors from server' })
  }
})

app.get('/product', async (req, res) => {
  let products = await db.catalogs.find()
  products = products.map(catalogs => { // 在圖檔前面加上網址路徑
    catalogs.image = 'http://localhost:3000/image/' + catalogs.image
    return catalogs
  })
  res.status(200)
  res.send({
    success: true,
    msg: 'get done',
    products
  })
})

app.get('image/:file', async (req, res) => {
  const path = process.cwd() + '/images/' + req.params.file // process.cwd() 可知道目前運作的js 檔(路徑)在哪裡
  const exists = fs.existsSync(path) // fs.existsSync() 可檢查檔案是否存在，只能用絕對路徑
  if (exists) {
    res.status(200)
    res.sendFile(path) // res.sendFile(絕對路徑)
    /*
      路徑只能放絕對路徑，不然就要設定 root (根資料夾) 為process.cwd()
      res.secdFile(路徑, {root: process.cwd()})
    */
  } else {
    res.status(404)
    res.send({
      success: false,
      msg: "file doesn't exist"
    })
  }
})

app.get('/checksession', async (req, res) => {
  res.status(200)
  res.send({
    success: true,
    msg: 'check session done',
    user: req.session.user
  })
})

app.get('/logout', async (req, res) => {
  req.session.destroy((err) => { // 刪除狀態
    if (err) { // 刪除時出錯
      res.status(500)
      res.send({
        success: false, msg: 'errors from server'
      })
    } else {
      res.clearCookie() // 清除瀏覽器的認證資訊
      res.send({
        success: true, msg: 'clear cookies'
      })
    }
  })
})

app.listen(3000, () => {
  console.log('web server on!!!')
  console.log('http://localhost:3000')
})
