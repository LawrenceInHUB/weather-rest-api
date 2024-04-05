const sql = require("mssql");

const config = {
    user: 'user',
    password: 'Nibm@123',
    server: 'nibm.database.windows.net',
    database: 'weather',
    options: {
      encrypt: true, // For secure connection to Azure SQL Database
      trustServerCertificate: false // Change to true for development environment only
    }
  };

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.error("Error connecting to SQL Server:", err);
  }
}

module.exports = { sql, connectToDatabase };
