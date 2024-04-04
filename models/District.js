const mssql = require('mssql');

const districtSchema = {
    location: {
        type: mssql.NVarChar,
        nullable: false
    },
    condition: {
        type: mssql.NVarChar,
        nullable: false
    },
    temperature: {
        type: mssql.Float,
        nullable: false
    },
    rainfall: {
        type: mssql.Float,
        nullable: false
    },
    humidity: {
        type: mssql.Float,
        nullable: false
    },
    reported_time: {
        type: mssql.DateTime,
        nullable: false
    },
    air_pressure: {
        type: mssql.Float
    }
};

module.exports = districtSchema;
