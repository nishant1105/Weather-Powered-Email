var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));
var SubscriptionHandler = require('./subscriptionhandler.js');
var sh = new SubscriptionHandler();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/weatherAppDB");
var subscriptionSchema = new mongoose.Schema({
    emailID: String,
    locationID: String
});
var User = mongoose.model("User", subscriptionSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addUserData", (req, res) => {
    var myData = new User(req.body);
    sh.addUserAccount({
    	"emailID": myData.emailID,
    	"locationID": myData.locationID	
    })
    .then(item => {
        res.send("Email and Location info is saved to database.");
    })
    .catch(err => {
        res.status(400).send("Email already subscribed! Unable to save to database.");
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

