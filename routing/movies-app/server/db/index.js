const mongoose = require('mongoose')


var url = process.env.MONGO_URL||'mongodb://127.0.0.1:27017';

mongoose
    .connect( url+'/cinema', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db