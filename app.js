// const express = require("express"),
//     multer = require("multer"),
//     ejs = require("ejs"),
//     mongoose = require("mongoose"),
//     bodyParser = require("body-parser"),
//     path = require("path");

// //Init App
// var app = express();

// var fName;

// mongoose.connect("mongodb://localhost:27017/img_Gallery", { useNewUrlParser: true });

// //body-parser
// app.use(bodyParser.urlencoded({ extended: true }));

// //Ejs
// app.set("view engine", "ejs");

// //public folder
// app.use(express.static("./public"));

// //port No.
// const port = 3060;

// //Schema Setup
// var imgGallerySchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     myImage: String
// });

// var ImgGal = mongoose.model("ImgGal", imgGallerySchema);

// //Set Storage Engine
// const storage = multer.diskStorage({
//     destination: "./public/uploads",
//     filename: function(req, file, cb) {
//         fName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
//         cb(null, fName);
//     }
// });

// //Init upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 11500000 },
//     fileFilter: function(req, file, cb) { checkFileType(file, cb); }
// }).single("myImage");

// //Check File Type
// function checkFileType(file, cb) {
//     //Allowed extensions
//     const fileTypes = /jpeg|jpg|png|gif/;
//     //check extensions
//     const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     //check MIME
//     const mimeType = fileTypes.test(file.mimetype);
//     if (mimeType && extName)
//         return cb(null, true);
//     else
//         cb("Error: Images Only!");
// }

// app.get("/", (req, res) => res.render("index"));

// app.post('/upload', (req, res) => {
//     upload(req, res, (err) => {
//         var title = req.body.title;
//         var desc = req.body.description;
//         var myImage = fName;
//         var newImg = { title: title, description: desc, myImage: myImage }
//         if (err) {
//             res.render('index', { msg: err });
//         } else {
//             if (req.file == undefined) {
//                 res.render('index', { msg: 'Error: No File Selected!' });
//             } else {
//                 //Create a new image and save to db
//                 ImgGal.create(newImg, function(err, newlyCreated) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         ImgGal.find({}, function(err, data) {
//                             res.render('show', {
//                                 practices: data
//                             });
//                         });
//                     }
//                 });
//             }
//         }
//     });
// });

// app.listen(port, function() {
//     console.log("Image Gallery Serve Started On Port : " + port);
// });

const express = require("express"),
    multer = require("multer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    path = require("path");

//Init App
var app = express();

var fName;

mongoose.connect("mongodb://localhost:27017/Image_Gallery", { useNewUrlParser: true });

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//Ejs
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

//port No.
const port = 3060;

//Schema Setup
var imgGallerySchema = new mongoose.Schema({
    myImage: String
});

var ImgGal = mongoose.model("ImgGal", imgGallerySchema);

//Set Storage Engine
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function(req, file, cb) {
        fName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, fName);
    }
});

//Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 /*5 MB upload limit */ },
    fileFilter: function(req, file, cb) { checkFileType(file, cb); }
}).single("myImage");

//Check File Type
function checkFileType(file, cb) {
    //Allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;
    //check extensions
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check MIME
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName)
        return cb(null, true);
    else
        cb("Images Only!");
}

app.get("/", (req, res) => res.render("index"));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        var myImage = fName;
        var newImg = { myImage: myImage }
        if (err) {
            res.render('index', { msg: err });
        } else {
            if (req.file == undefined) {
                res.render('index', { msg: 'No File Selected!' });
            } else {
                //Create a new image and save to db
                ImgGal.create(newImg, function(err, newlyCreated) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('index', { msg: "Image Uploaded." });
                    }
                });
            }
        }
    });
});

app.get('/upload', (req, res) => {
    ImgGal.find({}, function(err, data) {
        if (err)
            console.log(err);
        else {
            res.render('show', {
                practices: data
            });
        }
    });
});

app.listen(port, function() {
    console.log("Image Gallery Serve Started On Port : " + port);
});