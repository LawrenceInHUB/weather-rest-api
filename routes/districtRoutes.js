const express = require('express');
const router = express.Router();
const { sql } = require('../Utils/sqlConnection'); 
const districtSchema = require('../models/District');
const generateRandomData = require('../Utils/dataGenerator');
const locations = require('../Utils/locations');
const authenticateToken = require('../middleware/authentication');
const { insertDistrictData, getAllDistricts, getLatestDistrictData } = require('../Utils/databaseOperations');

// Import swaggerJsdoc
const swaggerJsdoc = require('swagger-jsdoc');
// Import swaggerUi module
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Weather API',
    version: '1.0.0',
    description: 'API for managing weather data of districts',
  },
  servers: [
    {
      url: 'https://weather-rest-api-ed7w.onrender.com/api',
      description: 'Development server',
    },
  ],
  components: {
    schemas: {
      DistrictData: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          condition: { type: 'string' },
          temperature: { type: 'number', format: 'float' },
          rainfall: { type: 'number', format: 'float' },
          humidity: { type: 'integer' },
          reported_time: { type: 'string', format: 'date-time' },
          air_pressure: { type: 'number', format: 'float' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        scheme: 'bearer',
        in: 'header',
      },
    },
  },
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ['./routes/*.js'], // Change this to the path where your routes are defined
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Cerate new District Weather Data
/**
 * @swagger
 * /districts:
 *   post:
 *     summary: Create new District Weather Data
 *     description: Create new weather data for a district
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DistrictData'
 *     responses:
 *       '201':
 *         description: Data inserted successfully
 *       '500':
 *         description: Internal Server Error
 */
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

// Get all Districts Weather Data
/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get all Districts Weather Data
 *     description: Retrieve all weather data for districts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DistrictData'
 *       '500':
 *         description: Internal Server Error
 */
router.get('/districts', authenticateToken, async (req, res) => {
    try {
        const districts = await getAllDistricts();
        res.status(200).json(districts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get Selected District Weather Data
/**
 * @swagger
 * /districts/{districtName}:
 *   get:
 *     summary: Get Selected District Weather Data
 *     description: Retrieve weather data for a specific district
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: districtName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the district
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DistrictData'
 *       '500':
 *         description: Internal Server Error
 */
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

// Update Selected District Weather Data
/**
 * @swagger
 * /districts/{id}:
 *   put:
 *     summary: Update Selected District Weather Data
 *     description: Update weather data for a specific district
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the district
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DistrictData'
 *     responses:
 *       '200':
 *         description: Data updated successfully
 *       '500':
 *         description: Internal Server Error
 */
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

// Delete Selected District Weather Data
/**
 * @swagger
 * /districts/{id}:
 *   delete:
 *     summary: Delete Selected District Weather Data
 *     description: Delete weather data for a specific district
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the district
 *     responses:
 *       '200':
 *         description: Data deleted successfully
 *       '500':
 *         description: Internal Server Error
 */
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


// Generate random data for each location and insert it into the database every 5 minutes
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
}, 1000);

module.exports = router;
