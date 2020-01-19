const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const fs = require('file-system');

const app = express();
const auth = fs.readFileSync('auth.json', 'utf8');

var auth_data = JSON.parse(auth);

const me = auth_data.user;
const url = auth_data.url;
const apiKey = auth_data.API;
const listID = auth_data.listID;
const us = auth_data.us;


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
        url: url,
        method: "POST",
        headers: { 
            // "Authorization": "apxunov " + apiKey + "-" + us // Во избежание ошибки 401 (Unauthorized) прописываем себя
            "Authorization": me + apiKey + "-" + us
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

app.post("/failure", function (req, res) {
    res.redirect("/")
})


app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
})

