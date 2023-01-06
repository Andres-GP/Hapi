const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  usename: String
});

module.exports = model('User', userSchema);