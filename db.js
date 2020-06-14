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
    require: [true, 'required input'],
    minlength: [1, 'at least one word'],
    maxlength: [10, 'ten words at most'],
    unique: 'repeated name'
  },
  price: {
    type: Number,
    require: [true, 'required input']
  },
  description: {
    type: String,
    require: [true, 'required input']
  },
  count: {
    type: Number,
    require: [true, 'required input']
  }
}, {
  versionKey: false
})

const catalog = mongoose.model('catalog', catalogSchema)

export default {
  catalog
}
