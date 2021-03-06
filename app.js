const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('Public'));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})


app.post("/",function(req,res){

    console.log(req.body);

    var fName = req.body.fName;
    var lName = req.body.lName;
    var email = req.body.email;

    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonObject = JSON.stringify(data);
    const url = "https://us19.api.mailchimp.com/3.0/lists/79a35d176d";
    const options = {
        method: "POST",
        auth: "aman:f399e84afa37091600bae76e0974ddf1-us19"
    }
    
    const request = https.request(url, options, function(response){

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

        if(response.statusCode=== 200){
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }

    })

    request.write(jsonObject);
    request.end();


    

})

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 4040 ,function(){
    console.log("server up and running @ port 4040");
})

//api key f399e84afa37091600bae76e0974ddf1-us19
//79a35d176d