var child_process = require('child_process');
var express	= require("express");
var spawn = require("child_process").spawn; 
const fs = require('fs');
var app	= express();
var http = require('http');

var uploadPath = 'data/inputs';
var output_root = '';

var multer	=	require('multer');
var storage	=	multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadPath);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage : storage});


app.use(express.static("public"));
app.use(express.static("data/inputs"));
app.use(express.static("data/outputs"));
app.use(express.static("processing"));
app.use(express.static("."));
app.use(express.json());


app.get('/',function(req,res){
    res.sendfile("public/index.html");
});

app.get('/step',function(req,res){
    res.sendfile("public/step.html");
});

app.post('/uploadfile', upload.single('filename'), (req, res, next) => {
    const file = req.file;
    var rst = {
        rstcode: "error",
        desc: "Upload unsuccessfully",
        data: {filename: {}}
    };
    rst.rstcode = "success";
    rst.desc = "Upload successfully";
    rst.data.filename = file.originalname;
    res.redirect('/step?filename=' + file.originalname);
    res.end();
});

app.post('/save', function (req, res) {
    // let body = '';
    // req.on('data', chunk => {
    //     body += chunk.toString();
    // });
    
    // req.on('end', () => {
    //     var json = parse(body);
    // console.log(json)
    //     res.end('ok');
    // });
    // console.log(req.body);
    // console.log("start")
    // var process = spawn('python',["uied.py", 
    //                         "123","243"] ); 
    // process.stdout.on('data', function(data) { 
    //     res.send(data.toString()); 
    // } ) 
    // var data = Json.parse(req.body);

    
    // var SubjectCode = req.body.SubjectCode,
    //     SubjectName = req.body.SubjectName,
    //     SubjectCoordinator = req.body.SubjectCoordinator,
    //     SubjectDescription = req.body.SubjectDescription,
    //     CreditPoints = req.body.CreditPoints,
    //     StudyYear = req.body.StudyYear,
    //     TeachingPeriod = req.body.TeachingPeriod,
    //     SLOCount = req.body.SLOCount,
    //     MappingClassList = req.body.MappingClassList,
    //     PieceOfAssessmentList = req.body.PieceOfAssessmentList

    fs.writeFile("./data/outputs.txt", JSON.stringify(req.body), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The tmp file was saved!");
    });

    var workerProcess = child_process.exec('python3 mapping.py',
        function (error, stdout, stderr) {
            if (error) {
                console.log(stdout);
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
                res.json({code:0});
            }else{
                console.log('stdout: ' + stdout + '\n');
                res.json({code:1, result_path:stdout});
            }
        });

    workerProcess.on('exit', function () {
        console.log('Program Invoked');
    });
});

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '0.0.0.0');
// console.log('Server running at http://127.0.0.1:1337/');

app.listen(8000, function(){
    console.log("Working on port 8000");
});
