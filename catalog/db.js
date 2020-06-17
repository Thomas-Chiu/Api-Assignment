import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
// import validator from 'validator'

const Schema = mongoose.Schema

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://127.0.0.1:27017/catalog', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.plugin(beautifyUnique)

const catalogSchema = new Schema({ // 定義collection 欄位
  name: {
    type: String,
    required: [true, 'required name input'],
    minlength: [1, 'at least one word'],
    maxlength: [10, 'ten words at most'],
    unique: 'repeated name'
  },
  price: {
    type: Number,
    minlength: [0, 'at least zero'],
    required: [true, 'required price input']
  },
  description: {
    type: String,
    minlength: [2, 'at least two words'],
    required: [true, 'required description input']
  },
  count: {
    type: Number,
    minlength: [0, 'at least zero'],
    required: [true, 'required count input']
  },
  image: { // 新增上傳照片功能
    type: String
    // required: [true, 'required image input']
  }
}, {
  versionKey: false
})

const userSchema = new Schema({
  account: {
    type: String
  },
  password: {
    type: String
  }
})

const catalog = mongoose.model('catalogs', catalogSchema) // model(資料表名稱, 對應的資料表基模)
const user = mongoose.model('users', userSchema)
const connection = mongoose.connection

export default {
  catalog,
  user,
  connection
}
