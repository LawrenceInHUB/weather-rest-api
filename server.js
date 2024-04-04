const express = require('express');
const districtRoutes = require('./routes/districtRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/', districtRoutes);

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});