const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districtSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    rainfall: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    reported_time: {
        type: Date,
        required: true
    },
    air_pressure: {
        type: String
    }
});

const District = mongoose.model("District", districtSchema);
module.exports = District;
