const mongoose = require('mongoose')

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

    console.log(`Mongo DB connected: ${conn.connection.host}`.cyan.underline.bold);
    
}

module.exports = connectDB;