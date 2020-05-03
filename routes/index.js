const express = require('express');
const router = express.Router();
var multer = require("multer");
var UUID = require('uuid') //uuid工具可以生成唯一标示

var gFilename = "";
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/data');   //此目录是项目根目录下的tmp目录，一定要确保此目录存在，否则上传失败
    },
    filename: function (req, file, callback) {
        let extName = file.originalname.slice(file.originalname.lastIndexOf('.'))
        let fileName = UUID.v1()
        gFilename = fileName + extName;
        callback(null, gFilename);
    }
});
//设置过滤规则（可选）
var Filter = function(req, file, callback){
    var acceptableMime = ['xml']
    if(acceptableMime.indexOf(file.mimetype) !== -1){
        callback(null, true)
    }else{
        callback(null, false)
    }
}
var upload = multer({
    storage: storage,
}).any();
 
router.post('/step', function (req, res, next) {
    upload(req, res, function (err) {
        if (res.finished) {
            return;
        }
        var rst = {
            rstcode: "error",
            desc: "上传失败",
            data: {filename: {}}
        };
        if (err) {
            return res.end(JSON.stringify(rst));
        }
        rst.rstcode = "success";
        rst.desc = "上传成功";
        rst.data.filename = gFilename;
        res.redirect('/step?filename='+gFilename);
        res.end();
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'JCUMap'});
});

module.exports = router;
