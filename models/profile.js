const mongoose = require("mongoose")

const profile = new mongoose.Schema({

    userID: {type: String, default: ""}, 
    collectedEggs: {type: Array, default: []}

})

module.exports = mongoose.model("profile", profile)