const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('test', {title: 'JCUMap'});
});

module.exports = router;
