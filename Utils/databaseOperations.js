const { sql, connectToDatabase , configDB } = require('./sqlConnection'); 

// Connect to the database
connectToDatabase(configDB);

async function insertDistrictData(location, condition, temperature, rainfall, humidity, reported_time, air_pressure) {
    try {
        const request = new sql.Request();
        await request
            .input('location', sql.NVarChar, location)
            .input('condition', sql.NVarChar, condition)
            .input('temperature', sql.Float, temperature)
            .input('rainfall', sql.Float, rainfall)
            .input('humidity', sql.Float, humidity)
            .input('reported_time', sql.DateTime, reported_time)
            .input('air_pressure', sql.Float, air_pressure)
            .query(`INSERT INTO district (location, condition, temperature, rainfall, humidity, reported_time, air_pressure) 
                    VALUES (@location, @condition, @temperature, @rainfall, @humidity, @reported_time, @air_pressure)`);
    } catch (error) {
        throw error;
    }
}



// Function to fetch all districts from the database
async function getAllDistricts() {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM district');
        return result.recordset;
    } catch (error) {
        throw error;
    }
}

// Function to fetch the latest data for a specific district from the database
async function getLatestDistrictData(districtName) {
    try {
        const request = new sql.Request();
        const result = await request
            .input('districtName', sql.NVarChar, districtName)
            .query(`
                SELECT TOP 1 *
                FROM district
                WHERE location = @districtName
                ORDER BY reported_time DESC
            `);
        return result.recordset;
    } catch (error) {
        throw error;
    }
}

// Function to update district data in the database
async function updateDistrictData(id, location, condition, temperature, rainfall, humidity, reported_time, air_pressure) {
    try {
        const request = new sql.Request();
        await request
            .input('id', sql.Int, id)
            .input('location', sql.NVarChar, location)
            .input('condition', sql.NVarChar, condition)
            .input('temperature', sql.Float, temperature)
            .input('rainfall', sql.Float, rainfall)
            .input('humidity', sql.Float, humidity)
            .input('reported_time', sql.DateTime, reported_time)
            .input('air_pressure', sql.Float, air_pressure)
            .query(`UPDATE district 
                    SET location = @location, 
                        condition = @condition, 
                        temperature = @temperature, 
                        rainfall = @rainfall, 
                        humidity = @humidity, 
                        reported_time = @reported_time, 
                        air_pressure = @air_pressure
                    WHERE id = @id`);
    } catch (error) {
        throw error;
    }
}

// Function to delete district data from the database
async function deleteDistrictData(id) {
    try {
        const request = new sql.Request();
        await request
            .input('id', sql.Int, id)
            .query(`DELETE FROM district WHERE id = @id`);
    } catch (error) {
        throw error;
    }
}




module.exports = {
    updateDistrictData,
    deleteDistrictData,
    insertDistrictData,
    getAllDistricts,
    getLatestDistrictData
};
