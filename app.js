const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.htm`);
});

app.post("/", function (req, res) {
    const fn = req.body.fname;
    const ln = req.body.lname;
    const e = req.body.eid;
    // console.log(fn,ln,e);
    var data = {
      name: "Temporary List",
      permission_reminder: "Placeholder reminder",
      email_type_option: true,
      contact: {
        company: "Temporary Company",
        address1: "123 Temporary Street",
        city: "Temporary City",
        state: "Temporary State",
        zip: "12345",
        country: "Temporary Country",
      },
      campaign_defaults: {
        from_name: "Temporary Name",
        from_email: "temporary@example.com",
        subject: "Temporary Subject",
        language: "en",
      },
      members: [
        {
          email_address: e,
          status: "subscribed",
          merge_fields: {
            FNAME: fn,
            LNAME: ln,
          },
        },
      ],
    };
    
    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0"
    const listId = "/lists/eaed569f03?skip_validation=true";
    const options = {
        method:"POST",
        auth: "shahi:7dde804ee4e6101a9490926681ed0431-us21" 
    }
    const request = https.request(url+listId, options, function (response) {
        response.on("data", function (data) {
            const memdata = JSON.parse(data);
            // console.log(JSON.parse(Data));
            // res.send(JSON.parse(data));
            // we could have also checked the same by using response.status_code=200 or not
            const stat = memdata.new_members[0].status;
            if (stat === "subscribed")
            {
              res.sendFile(__dirname + "/success.htm");
            }
             else
            {
              res.sendFile(__dirname + "/failure.htm");
            }
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/fail", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT||3000, function ()
{
    console.log("server is listening at 3000");
})
