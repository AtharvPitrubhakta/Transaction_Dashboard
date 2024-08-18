const mongoose = require("mongoose");
require("dotenv").config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(() => console.log("Database Connection are fulfill"))
    .catch((error) => {
        console.log("Due to some error, The DB connection are failed");
        console.error(error);
        process.exit(1);
    })
} 