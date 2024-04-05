const express = require('express');
const router = express.Router();
const { sql, connectToDatabase } = require('../Utils/sqlConnection'); 
const districtSchema = require('../models/District');
const generateRandomData = require('../Utils/dataGenerator'); 
const locations = require('../Utils/locations');
const authenticateToken = require('../middleware/authentication'); 
const config = require('../Utils/sqlConnection')

connectToDatabase();

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

router.use(async (req, res, next) => {
    try {
        await poolConnect;
        next();
    } catch (error) {
        console.error('Error establishing database connection:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define the SQL query to create the 'district' table
const createTableQuery = `
CREATE TABLE district (
    id INT IDENTITY(1,1) PRIMARY KEY,
    location NVARCHAR(255) NOT NULL,
    condition NVARCHAR(255) NOT NULL,
    temperature FLOAT NOT NULL,
    rainfall FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    reported_time DATETIME NOT NULL,
    air_pressure FLOAT
);`;

// Function to check if the 'district' table exists and create it if it doesn't
async function createDistrictTableIfNotExists() {
    try {
        await connectToDatabase();

        // Check if the 'district' table exists
        const result = await sql.query`SELECT OBJECT_ID('district') AS objectId`;
        const objectId = result.recordset[0].objectId;

        if (!objectId) {
            // Table doesn't exist, create it
            await sql.query(createTableQuery);
            console.log("Created 'district' table successfully");
        } else {
            console.log("The 'district' table already exists");
        }
    } catch (error) {
        console.error("Error creating 'district' table:", error);
    }
}

// Call the function to create the 'district' table if it doesn't exist
createDistrictTableIfNotExists();

// Define the route to handle POST requests
router.post('/districts', authenticateToken, async (req, res) => {
    try {
        const { location, condition, temperature, rainfall, humidity, reported_time, air_pressure } = req.body;
        const request = pool.request();
        await request
            .input('location', sql.NVarChar, location)
            .input('condition', sql.NVarChar, condition)
            .input('temperature', sql.Float, temperature)
            .input('rainfall', sql.Float, rainfall)
            .input('humidity', sql.Float, humidity)
            .input('reported_time', sql.DateTime, reported_time)
            .input('air_pressure', sql.Float, air_pressure)
            .query(`INSERT INTO district (${Object.keys(districtSchema).join(', ')}) 
                    VALUES (@location, @condition, @temperature, @rainfall, @humidity, @reported_time, @air_pressure)`);

        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define the route to fetch all districts
router.get('/districts', authenticateToken, async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query('SELECT * FROM district');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define the function to automatically post data for each location every 5 seconds
async function postLocationData(location) {
    try {
        const request = pool.request();
        const data = await generateRandomData(location);

        // Insert data into the database
        await request
        .input('location', sql.NVarChar, data.location)
        .input('condition', sql.NVarChar, data.condition)
        .input('temperature', sql.Float, data.temperature)
        .input('rainfall', sql.Float, data.rainfall)
        .input('humidity', sql.Float, data.humidity)
        .input('reported_time', sql.DateTime, data.reported_time)
        .input('air_pressure', sql.Float, data.air_pressure)
        .query(`INSERT INTO district (location, condition, temperature, rainfall, humidity, reported_time, air_pressure) 
                VALUES (@location, @condition, @temperature, @rainfall, @humidity, @reported_time, @air_pressure)`);

        // Keep only the latest 100 records for each location
        const deleteQuery = `
            DELETE FROM district
            WHERE id NOT IN (
                SELECT TOP 5 id
                FROM district
                WHERE location = @location
                ORDER BY reported_time DESC
            ) AND location = @location;
        `;
        await request.query(deleteQuery);

        console.log(`Data for ${location} inserted successfully and older records deleted`);
    } catch (error) {
        console.error(`Error inserting data for ${location}:`, error);
    }
}

// Route to fetch the latest data for a specific district
router.get('/districts/:districtName', authenticateToken, async (req, res) => {
    try {
        const districtName = req.params.districtName;
        const request = pool.request();
        
        const result = await request
            .input('districtName', sql.NVarChar, districtName)
            .query(`
                SELECT TOP 1 *
                FROM district
                WHERE location = @districtName
                ORDER BY reported_time DESC
            `);
        
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Automatically post data for each location every 5 seconds
setInterval(async () => {
    for (const location of locations) {
        await postLocationData(location);
    }
}, 5000);

module.exports = router;