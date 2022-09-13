const express = require('express')
const router = express.Router()
const removeWm = require('../controller/removeWm')

router.get('/removeWm', (req, res, next) => {
    // console.log(req.query);
    removeWm.removeWm(req.query).then((data) => {
        res.json(data)
    })
})

router.get('/downloadVideo', (req, res, next) => {
    // console.log(req.query);
    res.set("Content-Type","application/octet-stream")
    removeWm.downloadVideo(req.query).then((data) => {
        res.download(data.relativePath,data.vudeoName)
    })
})


module.exports = router