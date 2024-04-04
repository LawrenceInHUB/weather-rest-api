const express = require('express');
const districtRoutes = require('./routes/districtRoutes');

const app = express();

app.use(express.json()); 

app.use('/', districtRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
