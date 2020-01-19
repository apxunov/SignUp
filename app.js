const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

// прокладываю путь к статичным файлам для отображения кастомных стилей: css/style.css на локальном сервере 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    var name = req.body.inputName; // ищем по атрибуту name
    var surname = req.body.inputSurname;
    var email = req.body.inputEmail;

    const apiKey = '582f0a4cb773e4369209e0a26a402a0b';
    const listID = 'beafd3b5f1';
    const us = 'us4';

    var data = {
        members: [
            {
                email_address: email,
                merge_fields: {
                    NAME: name,
                    SURNAME: surname,
                },
                status: "subscribed"
            }
        ]
    };

    var JSONdata = JSON.stringify(data);

    var options = {
        url: "https://" + us + ".api.mailchimp.com/3.0/lists/" + listID,
        method: "POST",
        headers: { 
            // "Authorization": "apxunov " + apiKey + "-" + us // Во избежание ошибки 401 (Unauthorized) прописываем себя
            "Authorization": "apxunov 582f0a4cb773e4369209e0a26a402a0b-us4"
        },
        body: JSONdata
    };

    request(options, function(error, response, data){
        if (error) {
            res.sendFile(__dirname + "/failure.html")
        } else {
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html")
            }
            else {
                res.sendFile(__dirname + "/failure.html")
            }
        }
    })
});



app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})

