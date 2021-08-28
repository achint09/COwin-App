//jshint esversion:6
const express=require('express');
const bodyParser=require('body-parser');
const https=require("https");
const fetch = require('node-fetch');
const ejs=require('ejs');
const { response } = require('express');
const app=express();
var cities=[];
var selectedState='Select a state';
var formType;
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.get("/pinCode",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
app.get("/main",(req,res)=>{
    res.render("main");
});
app.post("/slotBypinId",(req,res)=>{
    formType=req.body.buttonType;
    res.redirect("/");
})
app.get("/",(req,res)=>{
    let date=new Date(req.body.date);
    let dateformat=date.toLocaleString("en-GB");
      const stateUrl="https://cdn-api.co-vin.in/api/v2/admin/location/states";
      https.get(stateUrl,(response)=>{
              response.on("data",(data)=>{
                  var obj=JSON.parse(data);
                  console.log(cities);
                  res.render("index",{states:obj.states,cities:cities,selectedState:selectedState,formType:formType});
              });
});
});
app.listen(3000,()=>{
    console.log("app is working");
});
app.post("/selectDistrict",(req,res)=>{
    let state=JSON.parse(req.body.states);
   selectedState=state.state_name;
   let id=state.state_id;
    const url='https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+id;
    fetch(url)
    .then((res)=>res.json())
    .then((data)=> {
        cities=data.districts;
    });
res.redirect("/");
});

app.post("/",(request,response)=>{
    let date=new Date(request.body.date);
  let dateformat=date.toLocaleString("en-GB");
  let url;
  if(request.body.reqtype!="searchByDistrict")
     url="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+request.body.pinCode+"&date="+dateformat;
    else
        url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+request.body.city_id+'&date='+dateformat;
        fetch(url)
        .then((res)=>res.json())
        .then((data)=> {
          response.render("centers",{centers:data.centers});
        });
});