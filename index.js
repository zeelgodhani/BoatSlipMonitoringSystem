//Create the Express server for the application
const express = require("express");

const app = express();

//Require the body parser to fetch the user inputs from the request
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

const { check, validationResult } = require('express-validator');

const boatData = [
                    {
                        "slipNumber": 1,
                        "vacant": true
                    },
                    {
                        "slipNumber": 2,
                        "vacant": true
                    },
                    {
                        "slipNumber": 3,
                        "vacant": true
                    },
                ];

// Get route that returns the boatData
app.get("/boat-slips", (req, res) => {
    return res.status(200).send(boatData);
});

// Post route that adds the vessel if a slip number is available
app.post("/boat-slips", 
    [

        check('vesselName', 'Invalid Vessel Name!!!')
            .notEmpty()
        

    ], (req, res) => {

        const errors = validationResult(req);        

        if(!errors.isEmpty()) {
            res.send(errors);
        }

        // Route through all the data and add a vessel if slip number
        // is vacant
        for (const data of boatData) {
            if (data.vacant == true) {
                
                let i = data.slipNumber - 1;

                data.vesselName = req.query.vesselName;
                boatData[i].vesselName = req.query.vesselName;
                boatData[i].vacant = false;

                return res.status(200).send({"slipNumber" : data.slipNumber});
            }
        }

        return res.status(409).send({"statusCode": 409, "Message": "There are no available boat slips."});
});

// Vacates the boat with the slip number if not vacated
app.put("/boat-slips/:slipNumber/vacate", (req, res) =>{
    const boat = boatData.find(c=> c.slipNumber === parseInt(req.params.slipNumber));

    if (!boat.vacant) {
        delete boatData[boat.slipNumber-1].vesselName;
        boatData[boat.slipNumber-1].vacant = true;
        return res.status(204).send({});
    }
    else{
        return res.status(409).send({"statusCode": 409, "Message": `Boat slip ${boat.slipNumber} is currently vacant.`})
    }
});

app.listen(8080, () => {
    console.log("Server has started");
}); 





