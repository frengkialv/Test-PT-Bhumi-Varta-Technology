const express = require('express');
const app = express();
const PORT = 3000;
const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/users", async (req, res, next) => {
    try {
        let foundData =  await sequelize.query(
            `select distinct u.id,u.longitude,u.latitude,u.brand,u.user_count from "Users" u
            where date_part('hour', u.time) between 7 and 8
            order by u.longitude`,
            {
                type: QueryTypes.SELECT,
            }
        )
        
        let range = {
            "range": "2021-10-20 08:00:00 to 2021-10-20 07:00:00",
        }

        let result = []

        for (let i = 0; i < foundData.length; i++) {
            foundData[i].range = range.range
            for (let j = i+1; j < foundData.length; j++) {
                if (foundData[i].longitude == foundData[j].longitude && foundData[i].latitude == foundData[j].latitude && i !== j) {
                    if(foundData[i].brand == foundData[j].brand){
                        foundData[i].user_count += foundData[j].user_count
                        foundData.splice(j, 1)
                    }
                }
            }
        }

        for (let i = 0; i < foundData.length; i++) {
            foundData[i].user_per_brand = foundData[i].user_count
            delete foundData[i]["user_count"];
            delete foundData[i]["id"];
        }

        for (let i = 0; i < foundData.length; i++) {
            for (let j = i+1; j < foundData.length; j++) {
                if (foundData[i].longitude == foundData[j].longitude && foundData[i].latitude == foundData[j].latitude && i !== j) {
                    let total = foundData[i].user_per_brand + foundData[j].user_per_brand
                    foundData[i].total_user = total
                    foundData[j].total_user = total
                }
            }          
        }

        res.status(200).json(foundData)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

app.listen(PORT, () => {
    console.log(`This Server listening to port ${PORT}`);
})