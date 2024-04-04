
const sql = require('mssql');
const locations = require('./locations');

async function generateRandomData(location) {
    let minTemp, maxTemp;
    let condition, minHumidity, maxHumidity, minRainfall, maxRainfall;

    // Set min and max temperature range, humidity range, and rainfall range based on location
    switch(location) {
        case "Colombo":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 10;
            maxRainfall = 50;
            break;
        case "Gampaha":
            minTemp = 24;
            maxTemp = 34;
            condition = 'Partly Cloudy';
            minHumidity = 65;
            maxHumidity = 90;
            minRainfall = 20;
            maxRainfall = 60;
            break;
        case "Kalutara":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Mostly Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 15;
            maxRainfall = 55;
            break;
        case "Kandy":
            minTemp = 20;
            maxTemp = 30;
            condition = 'Partly Cloudy';
            minHumidity = 70;
            maxHumidity = 95;
            minRainfall = 30;
            maxRainfall = 70;
            break;
        case "Nuwara Eliya":
            minTemp = 15;
            maxTemp = 25;
            condition = 'Cloudy';
            minHumidity = 80;
            maxHumidity = 100;
            minRainfall = 40;
            maxRainfall = 80;
            break;
        case "Galle":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 10;
            maxRainfall = 50;
            break;
        case "Matara":
            minTemp = 24;
            maxTemp = 34;
            condition = 'Partly Cloudy';
            minHumidity = 65;
            maxHumidity = 90;
            minRainfall = 20;
            maxRainfall = 60;
            break;
        case "Hambantota":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Mostly Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 15;
            maxRainfall = 55;
            break;
        case "Jaffna":
            minTemp = 20;
            maxTemp = 30;
            condition = 'Partly Cloudy';
            minHumidity = 70;
            maxHumidity = 95;
            minRainfall = 30;
            maxRainfall = 70;
            break;
        case "Mannar":
            minTemp = 15;
            maxTemp = 25;
            condition = 'Cloudy';
            minHumidity = 80;
            maxHumidity = 100;
            minRainfall = 40;
            maxRainfall = 80;
            break;
        case "Vavuniya":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 10;
            maxRainfall = 50;
            break;
        case "Mullaitivu":
            minTemp = 24;
            maxTemp = 34;
            condition = 'Partly Cloudy';
            minHumidity = 65;
            maxHumidity = 90;
            minRainfall = 20;
            maxRainfall = 60;
            break;
        case "Kilinochchi":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Mostly Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 15;
            maxRainfall = 55;
            break;
        case "Batticaloa":
            minTemp = 20;
            maxTemp = 30;
            condition = 'Partly Cloudy';
            minHumidity = 70;
            maxHumidity = 95;
            minRainfall = 30;
            maxRainfall = 70;
            break;
        case "Ampara":
            minTemp = 15;
            maxTemp = 25;
            condition = 'Cloudy';
            minHumidity = 80;
            maxHumidity = 100;
            minRainfall = 40;
            maxRainfall = 80;
            break;
        case "Trincomalee":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 10;
            maxRainfall = 50;
            break;
        case "Kurunegala":
            minTemp = 24;
            maxTemp = 34;
            condition = 'Partly Cloudy';
            minHumidity = 65;
            maxHumidity = 90;
            minRainfall = 20;
            maxRainfall = 60;
            break;
        case "Puttalam":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Mostly Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 15;
            maxRainfall = 55;
            break;
        case "Anuradhapura":
            minTemp = 20;
            maxTemp = 30;
            condition = 'Partly Cloudy';
            minHumidity = 70;
            maxHumidity = 95;
            minRainfall = 30;
            maxRainfall = 70;
            break;
        case "Polonnaruwa":
            minTemp = 15;
            maxTemp = 25;
            condition = 'Cloudy';
            minHumidity = 80;
            maxHumidity = 100;
            minRainfall = 40;
            maxRainfall = 80;
            break;
        case "Badulla":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 10;
            maxRainfall = 50;
            break;
        case "Monaragala":
            minTemp = 24;
            maxTemp = 34;
            condition = 'Partly Cloudy';
            minHumidity = 65;
            maxHumidity = 90;
            minRainfall = 20;
            maxRainfall = 60;
            break;
        case "Ratnapura":
            minTemp = 25;
            maxTemp = 35;
            condition = 'Mostly Sunny';
            minHumidity = 60;
            maxHumidity = 85;
            minRainfall = 15;
            maxRainfall = 55;
            break;
        case "Kegalle":
            minTemp = 20;
            maxTemp = 30;
            condition = 'Partly Cloudy';
            minHumidity = 70;
            maxHumidity = 95;
            minRainfall = 30;
            maxRainfall = 70;
            break;
        case "Matale":
            minTemp = 15;
            maxTemp = 25;
            condition = 'Cloudy';
            minHumidity = 80;
            maxHumidity = 100;
            minRainfall = 40;
            maxRainfall = 80;
            break;
            
         default:
            minTemp = 0;
            maxTemp = 50;
            condition = 'Unknown';
            minHumidity = 50;
            maxHumidity = 100;
            minRainfall = 0;
            maxRainfall = 100;
    }

    // Generate random data
    const temperature = minTemp + Math.random() * (maxTemp - minTemp);
    const humidity = minHumidity + Math.random() * (maxHumidity - minHumidity);
    const rainfall = minRainfall + Math.random() * (maxRainfall - minRainfall);
    const reported_time = new Date();
    const air_pressure = Math.random() * 1000; // Random air pressure

    return {
        location,
        condition,
        temperature,
        humidity,
        rainfall,
        reported_time,
        air_pressure
    };
}




module.exports = generateRandomData;