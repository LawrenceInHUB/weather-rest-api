
const District = require("../models/District");

const locations = ["Location1", "Location2", "Location3", "Location4", "Location5"];

async function addDistrictData() {
    for (const location of locations) {
        const sampleData = {
            location: location,
            condition: `Sample Condition for ${location}`,
            temperature: Math.floor(Math.random() * (35 - 10 + 1)) + 10,
            rainfall: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
            humidity: Math.floor(Math.random() * (80 - 30 + 1)) + 30, 
            reported_time: new Date(),
            air_pressure: Math.floor(Math.random() * (1020 - 990 + 1)) + 990 
        };

        const newDistrict = new District(sampleData);

        try {
            await newDistrict.save();
            console.log(`Data added for ${location}`);
        } catch (err) {
            console.log(`Error adding data for ${location}: ${err}`);
        }
    }
}

module.exports = addDistrictData;
