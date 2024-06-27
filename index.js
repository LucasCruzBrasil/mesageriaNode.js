const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");
const appointmentService = require("./services/appointmentService");
const AppointmentFactory = require("./factories/AppointmentFactory");


app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine','ejs')
mongoose.connect("mongodb://127.0.0.1:27017/agendamento")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/cadastro", (req , res) =>{
    res.render("create")
})

app.post("/create", async(req, res) => {
   
var status =   await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
    )
    if(status) {
    res.redirect("/")
    } else {
        res.send("Ocorreu uma falha")
    }

})

app.get("/getcalendar",  async (req, res) => {
    var consultas = await appointmentService.GetAll(false);
    res.json(consultas)
})

app.get("/event/:id",async (req,res) =>{
  var appointment = await appointmentService.GetById(req.params.id)
  res.render("event",{appo: appointment})
})

app.post("/finish", async(req,res) => {
   var id = req.body.id
   var result = await appointmentService.Finish(id);
   console.log(result)
   res.redirect("/")
})


app.get("/list", async (req,res) => {

 // await appointmentService.Search("038.027.905-37")
  var appos = await appointmentService.GetAll(true);
  res.render("list", {appos})
});

app.get("/searchResult", async (req, res) => {
  
  var appos = await appointmentService.Search(req.query.search)
  res.render("list", {appos})
})

var pollTime = 5000

setInterval(async() => {
  await appointmentService.SendNotification();
},pollTime)

app.listen(8080, () => {}) 

