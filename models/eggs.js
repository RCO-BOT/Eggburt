const mongoose = require("mongoose")

const eggs = new mongoose.Schema({
    DB_ID: {type: String, default: process.env.DB_ID}, 
    eggs: {type: Array, default: []},
    eggsInDB: {type: Number, defaultL: 0}
})

module.exports = mongoose.model("eggs", eggs)