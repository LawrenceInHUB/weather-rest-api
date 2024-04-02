const router = require("express").Router();
let District = require("../models/District");
const addDistrictData = require("../Utils/dataGenerator"); // Assuming dataGenerator.js is in the same directory

//create route to create a product
router.route("/").post((req,res) => {
    const location = req.body.location;
    const condition = req.body.condition;
    const temperature = Number(req.body.temperature);
    const rainfall = Number(req.body.rainfall);
    const humidity = Number(req.body.humidity);
    const reported_time = Date.parse(req.body.reported_time);
    const air_pressure = req.body.air_pressure;
    

    const newDistrict = new District({
        location,
        condition,
        temperature,
        rainfall,
        humidity,
        reported_time,
        air_pressure

    })

    newProduct.save().then(() =>{
        res.json("District Data added")
    }).catch((err) =>{
        console.log(err);
    })

})


//create route to view district data 
router.route("/").get((req,res) =>{
    District.find().then((getDistrict) =>{
        res.json(getDistrict)
    }).catch((err) =>{
        console.log(err)
    })
})

//get only 1 districts by id
router.route("/:id").get(async (req,res) =>{
    let districtId = req.params.id;
    const district = await District.findById(districtId)
    .then((district) =>{
        res.status(200).send({status: "District Data fetched", district})
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error while fetching", error: err.message})
    })
})


//update district by id
router.route("/:id").put(async (req,res) => {
    let districtId = req.params.id;
    const{
        location,
        condition,
        temperature,
        rainfall,
        humidity,
        reported_time,
        air_pressure
    } = req.body;

    const updateDistrict = {
        location,
        condition,
        temperature,
        rainfall,
        humidity,
        reported_time,
        air_pressure
    }

    const update = await District.findByIdAndUpdate(districtId,updateDistrict).then(() =>{

    res.status(200).send({status:"District data updated"})
    }).catch((err) =>{
        console.log(err);
        res.status(500).send({status: "Error when Updating", error: err.message});
    })
})



//delete route 
router.route("/:id").delete(async (res,rep) =>{
    let districtId = req.params.id;

    await Product.findByIdAndDelete(districtId).then(() =>{
        res.status(200).send({status: "District Data deleted  ID  : ", districtId});
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error when deleting", error: err.message});
    })
})


//Set Time Interval
setInterval(addDistrictData, 5 * 60 * 100);


//export
module.exports = router;
