const express = require('express');
const router = express.Router();
const { sql } = require('../Utils/sqlConnection'); 
const districtSchema = require('../models/District');
const generateRandomData = require('../Utils/dataGenerator');
const locations = require('../Utils/locations');
const authenticateToken = require('../middleware/authentication');
const { insertDistrictData, getAllDistricts, getLatestDistrictData } = require('../Utils/databaseOperations');

router.post('/districts', authenticateToken, async (req, res) => {
    try {
        const { location, condition, temperature, rainfall, humidity, reported_time, air_pressure } = req.body;

        await insertDistrictData(location, condition, temperature, rainfall, humidity, reported_time, air_pressure);

        res.status(201).send('Data inserted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/districts', authenticateToken, async (req, res) => {
    try {
        const districts = await getAllDistricts();
        res.status(200).json(districts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/districts/:districtName', authenticateToken, async (req, res) => {
    try {
        const districtName = req.params.districtName;
        const latestData = await getLatestDistrictData(districtName);
        res.status(200).json(latestData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/districts/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { location, condition, temperature, rainfall, humidity, reported_time, air_pressure } = req.body;
        
        await updateDistrictData(id, location, condition, temperature, rainfall, humidity, reported_time, air_pressure);

        res.status(200).send('Data updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/districts/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        await deleteDistrictData(id);

        res.status(200).send('Data deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


setInterval(async () => {
    for (const location of locations) {
        try {
            const data = await generateRandomData(location);
            
            await insertDistrictData(data.location, data.condition, data.temperature, data.rainfall, data.humidity, data.reported_time, data.air_pressure);
            
            console.log(`Data for ${location} inserted successfully`);
        } catch (error) {
            console.error(`Error inserting data for ${location}:`, error);
        }
    }
}, 5 * 60 * 1000);

module.exports = router;