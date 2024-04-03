
const District = require("../models/District");

const locations = ["Location1", "Location2", "Location3", "Location4", "Location5"];

async function addDistrictData() {
    try {
        for (const location of locations) {
            let temperatureMin, temperatureMax;

            switch (location) {
                case "Location1":
                    temperatureMin = 10;
                    temperatureMax = 22;
                    break;
                default:
                    temperatureMin = 0;
                    temperatureMax = 30;
                    break;
            }

            const sampleData = {
                location: location,
                condition: `Sample Condition for ${location}`,
                temperature: Math.floor(Math.random() * (temperatureMax - temperatureMin + 1)) + temperatureMin,
                rainfall: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
                humidity: Math.floor(Math.random() * (80 - 30 + 1)) + 30,
                reported_time: new Date(),
                air_pressure: Math.floor(Math.random() * (1020 - 990 + 1)) + 990
            };

            const newDistrict = new District(sampleData);

            await newDistrict.save();
            console.log(`Data added for ${location}`);
        }

        await maintainLatestDistricts(20);
    } catch (error) {
        console.error("Error adding district data:", error);
    }
}

async function maintainLatestDistricts(maxCount) {
    try {
        const districts = await District.find().sort({ reported_time: -1 });

        if (districts.length > maxCount) {
            const districtsToDelete = districts.slice(maxCount);
            for (const district of districtsToDelete) {
                await District.findByIdAndDelete(district._id);
            }
        }
    } catch (error) {
        console.error("Error maintaining latest districts:", error);
    }
}

module.exports = addDistrictData;