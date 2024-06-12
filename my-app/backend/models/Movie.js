const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  released: {
    type: Number,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  genres: [
    { type: String}
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('Movie', schema)