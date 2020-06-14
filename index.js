// import md5 from 'md5'
import express from 'express'
import bodyParser from 'body-parser'
import db from './db.js'
// import db from './db.js'

const app = express()

app.use(bodyParser.json())

app.post('/new', async (req, res) => { // 新增資料
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400)
    res.send({
      success: false,
      msg: 'unqualified format'
    })
    return
  }
  if (req.body.name === undefined ||
    req.body.price === undefined ||
    req.body.description === undefined ||
    req.body.count === undefined) {
    res.status(400)
    res.send({
      success: false,
      msg: 'undefined input'
    })
  }
  try {
    const result = await db.catalog.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      count: req.body.count
    })
    console.log(result)
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
  if (req.query.id === undefined) {
    res.status(400)
    res.send({
      success: false,
      msg: 'undefined query'
    })
    return
  }
  try {
    const result = await db.catalog.findById(req.query.id)
    res.status(200)
    res.send({
      success: true,
      msg: 'get done',
      name: result.name,
      price: result.price,
      description: result.description,
      count: result.count
    })
  } catch (err) {
    res.status(404)
    res.send({
      success: false,
      msg: 'find nothing'
    })
  }
})

app.get('/all', async (req, res) => {

})

app.get('/instock', async (req, res) => {

})

app.listen(8080, () => {
  console.log('web server on!!!')
  console.log('http://localhost:8080')
})
