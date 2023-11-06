const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");


const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = (req.body.first_name);
    const lastName = (req.body.last_name);
    const email = (req.body.email);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }

            }
        ]
    };
    console.log(data);
    const jsonData = JSON.stringify(data);
    const url = "https://us13.api.mailchimp.com/3.0/lists/e598f4082b";

    const options = {
        method: "POST",
        auth: "Pinnacle:c9d30ac0465c10a4f26a5de95a90281e-us13"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failures.html");
        }

        



        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    console.log(request)

    request.write(jsonData)
    request.end();



});

app.post("/failure", function(req, res) {
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
})

